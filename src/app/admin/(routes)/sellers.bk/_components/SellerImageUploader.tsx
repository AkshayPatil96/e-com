"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  ExternalLink,
  Eye,
  Image as ImageIcon,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import Image from "next/image";
import React, { useCallback, useRef, useState } from "react";
import { useSellerAssetUpload } from "../_hooks/useSellerAssetUpload";
import { ISellerImage } from "../_types/seller.types";

interface ProcessedImage {
  url: string;
  s3Key: string;
  uploadMethod: string;
  width?: number;
  height?: number;
  size?: number;
  format?: string;
  filename?: string;
}

interface SellerImageUploaderProps {
  type: "logo" | "banner" | "gallery";
  value?: ISellerImage | ISellerImage[];
  onChange: (value: ISellerImage | ISellerImage[]) => void;
  maxFiles?: number;
  accept?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  description?: string;
}

export function SellerImageUploader({
  type,
  value,
  onChange,
  maxFiles = type === "gallery" ? 10 : 1,
  accept = "image/*",
  disabled = false,
  className = "",
  label,
  description,
}: SellerImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [externalUrl, setExternalUrl] = useState("");
  const [isProcessingUrl, setIsProcessingUrl] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    isUploading,
    errors,
    uploadFiles,
    processExternalImageUrls,
    clearState,
  } = useSellerAssetUpload({
    onUploadComplete: (image: ProcessedImage) => {
      const sellerImage: ISellerImage = {
        url: image.url,
        alt: `${type} image`,
        s3Key: image.s3Key,
        bucket: "seller-assets", // Default bucket for seller assets
        width: image.width,
        height: image.height,
        size: image.size,
        format: image.format,
      };

      if (type === "gallery") {
        const currentImages = Array.isArray(value) ? value : [];
        onChange([...currentImages, sellerImage]);
      } else {
        onChange(sellerImage);
      }
      clearState();
    },
    onUploadError: (error: string) => {
      console.error("Upload error:", error);
    },
  });

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleFileUpload = useCallback(
    (files: File[]) => {
      if (disabled) return;

      const validFiles = files.filter((file) => file.type.startsWith("image/"));
      
      if (validFiles.length === 0) {
        return;
      }

      // Limit files based on maxFiles and current images
      const currentCount = Array.isArray(value) ? value.length : value ? 1 : 0;
      const remainingSlots = maxFiles - currentCount;
      const filesToUpload = validFiles.slice(0, remainingSlots);

      if (filesToUpload.length > 0) {
        // Map logo type to image for the hook
        const hookType = type === "logo" ? "image" : type === "banner" ? "banner" : "gallery";
        uploadFiles(filesToUpload, hookType);
      }
    },
    [disabled, value, maxFiles, uploadFiles, type]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (disabled) return;

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileUpload(files);
      }
    },
    [disabled, handleFileUpload]
  );

  const handleFileSelect = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  const handleExternalUrl = async () => {
    if (!externalUrl.trim() || disabled || isProcessingUrl) return;

    setIsProcessingUrl(true);
    try {
      // Map logo type to image for the hook
      const hookType = type === "logo" ? "image" : type === "banner" ? "banner" : "gallery";
      await processExternalImageUrls([{ url: externalUrl.trim() }], hookType);
      setExternalUrl("");
    } catch (error) {
      console.error("External URL processing error:", error);
    } finally {
      setIsProcessingUrl(false);
    }
  };

  const removeImage = (index?: number) => {
    if (disabled) return;

    if (type === "gallery" && Array.isArray(value) && typeof index === "number") {
      const newImages = value.filter((_, i) => i !== index);
      onChange(newImages);
    } else {
      onChange(type === "gallery" ? [] : ({} as ISellerImage));
    }
  };

  const currentImages = Array.isArray(value) ? value : value ? [value] : [];
  const canUploadMore = currentImages.length < maxFiles;

  return (
    <div className={`space-y-4 ${className}`}>
      {label && <Label className="text-sm font-medium">{label}</Label>}
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}

      {/* Current Images Display */}
      {currentImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {currentImages.map((image, index) => (
            <Card key={index} className="relative group">
              <CardContent className="p-2">
                <div className="relative aspect-square rounded-md overflow-hidden">
                  <Image
                    src={image.url}
                    alt={image.alt || `${type} image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => window.open(image.url, "_blank")}
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => removeImage(index)}
                      disabled={disabled}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="mt-2 text-xs text-muted-foreground truncate">
                  {image.alt || `${type} ${index + 1}`}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Section */}
      {canUploadMore && (
        <Card
          className={`border-2 border-dashed transition-colors ${
            dragActive
              ? "border-primary bg-primary/10"
              : "border-muted-foreground/25 hover:border-muted-foreground/50"
          } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleFileSelect}
        >
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="rounded-full bg-muted p-4">
                {isUploading ? (
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                ) : (
                  <Upload className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  {isUploading
                    ? "Uploading images..."
                    : `Drop ${type} images here or click to upload`}
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, JPEG up to 10MB each
                  {maxFiles > 1 && ` (${currentImages.length}/${maxFiles})`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* External URL Section */}
      {canUploadMore && (
        <>
          <div className="flex items-center gap-4">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide">
              OR
            </span>
            <Separator className="flex-1" />
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Enter image URL..."
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
                disabled={disabled || isProcessingUrl}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleExternalUrl();
                  }
                }}
              />
            </div>
            <Button
              variant="outline"
              onClick={handleExternalUrl}
              disabled={!externalUrl.trim() || disabled || isProcessingUrl}
            >
              {isProcessingUrl ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ExternalLink className="h-4 w-4" />
              )}
            </Button>
          </div>
        </>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple={maxFiles > 1}
        accept={accept}
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          if (files.length > 0) {
            handleFileUpload(files);
          }
          e.target.value = ""; // Reset input
        }}
        className="hidden"
        disabled={disabled}
        aria-label={`Upload ${type} images`}
        title={`Upload ${type} images`}
      />

      {/* Error Display */}
      {errors.length > 0 && (
        <div className="space-y-2">
          {errors.map((error, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-sm text-destructive"
            >
              <ImageIcon className="h-4 w-4" />
              <span>{error}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}