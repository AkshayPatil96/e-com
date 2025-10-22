/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useUpdateBrandBannerMutation,
  useUpdateBrandLogoMutation,
} from "@/redux/adminDashboard/brand/brandApi";
import { Image as ImageIcon, Link, Loader2, Upload, X } from "lucide-react";
import React, { useCallback, useRef, useState } from "react";
import { useBrandAssetUpload } from "../_hooks/useBrandAssetUpload";
import { BRAND_VALIDATION, IImage } from "../_types/brand.types";
import { ImagePreview } from "./ImagePreview";

interface ImageUploaderProps {
  type: "logo" | "banner" | "gallery";
  value?: IImage | IImage[];
  onChange: (value: IImage | IImage[]) => void;
  maxFiles?: number;
  accept?: string;
  disabled?: boolean;
  className?: string;
  formType?: "add" | "edit";
  editId?: string | undefined;
}

export function ImageUploader({
  type,
  value,
  onChange,
  maxFiles = type === "gallery" ? 10 : 1,
  accept = "image/*",
  disabled = false,
  className = "",
  formType,
  editId,
}: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [externalUrl, setExternalUrl] = useState("");
  const [isProcessingUrl, setIsProcessingUrl] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [updateBrandLogo, { isLoading: isLogoLoading, data: logoData }] =
    useUpdateBrandLogoMutation();
  const [updateBrandBanner, { isLoading: isBannerLoading, data: bannerData }] =
    useUpdateBrandBannerMutation();

  const {
    isUploading,
    errors,
    uploadFiles,
    processExternalImageUrls,
    clearState,
  } = useBrandAssetUpload({
    onUploadComplete: async (image: any) => {
      if (formType === "edit") {
        const payload = {
          url: image.url,
          alt: image.alt,
          s3Key: image.s3Key,
          bucket: image.bucket,
          width: image.width,
          height: image.height,
          size: image.size,
          format: image.format,
          uploadMethod: image.uploadMethod,
          isProcessed: image.isProcessed,
          processingStatus: image.processingStatus,
          uploadedAt: image.uploadedAt,
          processedAt: image.processedAt,
        };
        await handleUpdateImage(payload);
      } else {
        if (Array.isArray(value)) {
          onChange([...(value || []), image]);
        } else {
          onChange(image);
        }
      }
    },
    onUploadError: (error) => {
      console.error("Upload error:", error);
    },
  });

  const handleUpdateImage = async (
    image: IImage,
    deleteFromS3: boolean = false,
  ) => {
    try {
      if (type === "logo") {
        let payload = {
          id: editId || "",
        } as any;
        if (deleteFromS3) {
          payload = { ...payload, deleteFromS3 };
        } else {
          payload = {
            ...payload,
            logoData: image,
            externalUrl,
          };
        }

        await updateBrandLogo(payload);
      } else if (type === "banner") {
        let payload = {
          id: editId || "",
        } as any;
        if (deleteFromS3) {
          payload = { ...payload, deleteFromS3 };
        } else {
          payload = {
            ...payload,
            bannerData: image,
            externalUrl,
          };
        }
        await updateBrandBanner(payload);
      }
    } catch (error) {
      console.error("Image update failed:", error);
    }
  };

  const currentImages = Array.isArray(value) ? value : value ? [value] : [];
  const canAddMore = currentImages.length < maxFiles;

  // Get validation info for current type
  const getValidationInfo = useCallback(() => {
    const typeKey = type.toUpperCase() as keyof typeof BRAND_VALIDATION.IMAGE;
    const validation = BRAND_VALIDATION.IMAGE[typeKey];

    if (typeof validation === "object" && "MIN_WIDTH" in validation) {
      const minDimensions = `${validation.MIN_WIDTH}x${validation.MIN_HEIGHT}px`;
      const maxDimensions = `${validation.MAX_WIDTH}x${validation.MAX_HEIGHT}px`;
      let recommendedDimensions = "";

      // Only show recommended dimensions if they exist
      if (
        "RECOMMENDED_WIDTH" in validation &&
        "RECOMMENDED_HEIGHT" in validation
      ) {
        const validationWithRecommended = validation as typeof validation & {
          RECOMMENDED_WIDTH: number;
          RECOMMENDED_HEIGHT: number;
        };
        recommendedDimensions = `${validationWithRecommended.RECOMMENDED_WIDTH}x${validationWithRecommended.RECOMMENDED_HEIGHT}px`;
      }

      return {
        minDimensions,
        maxDimensions,
        recommendedDimensions,
      };
    }

    return null;
  }, [type]);

  const validationInfo = getValidationInfo();

  const handleFileUpload = useCallback(
    async (files: File[]) => {
      if (!canAddMore) return;

      const filesToUpload = files.slice(0, maxFiles - currentImages.length);

      try {
        clearState();
        await uploadFiles(filesToUpload, type);
      } catch (error) {
        console.log("Upload failed:", error);
      }
    },
    [canAddMore, maxFiles, currentImages.length, uploadFiles, type, clearState],
  );

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (disabled || !canAddMore) return;

      const files = Array.from(e.dataTransfer.files);
      handleFileUpload(files);
    },
    [disabled, canAddMore, handleFileUpload],
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || disabled || !canAddMore) return;

      const files = Array.from(e.target.files);
      handleFileUpload(files);

      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [disabled, canAddMore, handleFileUpload],
  );

  const handleExternalUrlSubmit = useCallback(async () => {
    if (!externalUrl.trim() || !canAddMore || isProcessingUrl) return;

    setIsProcessingUrl(true);
    try {
      clearState();
      const processedImages = await processExternalImageUrls(
        [{ url: externalUrl.trim() }],
        type,
      );

      if (processedImages.length > 0) {
        setExternalUrl("");
      }
    } catch (error) {
      console.error("External URL processing failed:", error);
    } finally {
      setIsProcessingUrl(false);
    }
  }, [
    externalUrl,
    canAddMore,
    isProcessingUrl,
    processExternalImageUrls,
    type,
    clearState,
  ]);

  const handleRemoveImage = async (data: any) => {
    await handleUpdateImage(data, true);
  };

  const getProgressInfo = () => {
    // Since the new hook doesn't use the same progress structure,
    // we'll use isUploading state instead
    if (!isUploading) return null;

    return {
      averageProgress: 50, // Simplified progress
      activeUploads: 1,
      total: 1,
    };
  };

  const progressInfo = getProgressInfo();

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Current Images */}
      {currentImages.length > 0 && (
        <div
          className={`${type === "gallery" ? "grid grid-cols-4 gap-4" : ""}`}
        >
          {currentImages.map((image, index) => (
            <div
              key={index}
              className={`relative group h-48 bg-muted/50 rounded-md ${
                type !== "gallery" ? "flex items-center justify-center" : ""
              }`}
            >
              <ImagePreview
                image={image}
                className={`aspect-square !h-full ${
                  type === "banner" ? "w-full" : ""
                }`}
                showProcessingStatus
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                onClick={() => handleRemoveImage(image)}
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Progress */}
      {progressInfo && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>
                  Uploading {progressInfo.activeUploads} of {progressInfo.total}{" "}
                  files
                </span>
                <span>{Math.round(progressInfo.averageProgress)}%</span>
              </div>
              <Progress
                value={progressInfo.averageProgress}
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Interface - Always visible */}
      {canAddMore && (
        <Card className={`${errors.length > 0 ? "border-destructive" : ""}`}>
          <CardContent className="p-4">
            <Tabs
              defaultValue="file"
              className=""
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  value="file"
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Upload Files
                </TabsTrigger>
                <TabsTrigger
                  value="url"
                  className="flex items-center gap-2"
                >
                  <Link className="h-4 w-4" />
                  External URL
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="file"
                className="space-y-4"
              >
                <div
                  className={`
                    border-2 border-dashed rounded-lg p-8 text-center transition-colors
                    ${
                      dragActive
                        ? "border-primary bg-primary/10"
                        : "border-muted-foreground/25"
                    }
                    ${
                      disabled
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer hover:border-primary/50"
                    }
                    ${errors.length > 0 ? "border-destructive/50" : ""}
                  `}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => !disabled && fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple={maxFiles > 1}
                    accept={accept}
                    onChange={handleFileSelect}
                    disabled={disabled}
                    className="hidden"
                    aria-label={`Upload ${type} image${
                      maxFiles > 1 ? "s" : ""
                    }`}
                  />

                  <div className="space-y-4">
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      {isUploading ? (
                        <Loader2 className="h-6 w-6 text-primary animate-spin" />
                      ) : (
                        <ImageIcon className="h-6 w-6 text-primary" />
                      )}
                    </div>

                    <div className="space-y-2">
                      <p className="text-lg font-medium">
                        {isUploading
                          ? "Uploading..."
                          : "Drop files here or click to browse"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {maxFiles > 1
                          ? `Up to ${maxFiles} files`
                          : "Single file"}{" "}
                        • Max {BRAND_VALIDATION.IMAGE.MAX_SIZE / (1024 * 1024)}
                        MB each
                      </p>
                      {validationInfo && (
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <p>Min: {validationInfo.minDimensions}</p>
                          <p>
                            Recommended: {validationInfo.recommendedDimensions}
                          </p>
                          <p>Max: {validationInfo.maxDimensions}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* <div className="flex flex-wrap gap-2">
                  {BRAND_VALIDATION.IMAGE.ALLOWED_TYPES.map((mimeType) => (
                    <Badge key={mimeType} variant="secondary" className="text-xs">
                      {mimeType.split("/")[1].toUpperCase()}
                    </Badge>
                  ))}
                </div> */}
              </TabsContent>

              <TabsContent
                value="url"
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="external-url">Image URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="external-url"
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={externalUrl}
                      onChange={(e) => setExternalUrl(e.target.value)}
                      disabled={disabled || isProcessingUrl}
                      className={
                        errors.length > 0
                          ? "border-destructive focus-visible:ring-destructive"
                          : ""
                      }
                    />
                    <Button
                      type="button"
                      onClick={handleExternalUrlSubmit}
                      disabled={
                        !externalUrl.trim() || disabled || isProcessingUrl
                      }
                    >
                      {isProcessingUrl ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Process"
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enter a direct link to an image. The image will be
                    downloaded and processed.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Upload Errors - Always at bottom */}
      {errors.length > 0 && (
        <Card className="border-destructive bg-destructive/5">
          <CardContent className="p-4">
            <div className="space-y-2">
              <Label className="text-destructive font-medium flex items-center gap-2">
                <X className="h-4 w-4" />
                Upload Errors
              </Label>
              <div className="space-y-1">
                {errors.map((error, index) => (
                  <p
                    key={index}
                    className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded border border-destructive/20"
                  >
                    {error}
                  </p>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearState}
                className="mt-2 text-xs"
              >
                Clear Errors
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Limit Reached */}
      {/* {!canAddMore && (
        <Card className="border-muted">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Maximum {maxFiles} {maxFiles === 1 ? "image" : "images"} reached
            </p>
          </CardContent>
        </Card>
      )} */}
    </div>
  );
}
