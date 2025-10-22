"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, Clock, Loader2 } from "lucide-react";
import Image from "next/image";
import React from "react";
import { IImage, ProcessingStatus, UploadMethod } from "../_types/brand.types";

interface ImagePreviewProps {
  image: IImage;
  className?: string;
  showProcessingStatus?: boolean;
  showUploadMethod?: boolean;
  showDimensions?: boolean;
  onClick?: () => void;
}

export function ImagePreview({
  image,
  className = "",
  showProcessingStatus = false,
  showUploadMethod = false,
  showDimensions = false,
  onClick,
}: ImagePreviewProps) {
  const getProcessingStatusIcon = () => {
    switch (image.processingStatus) {
      case ProcessingStatus.PENDING:
        return <Clock className="h-3 w-3" />;
      case ProcessingStatus.PROCESSING:
        return <Loader2 className="h-3 w-3 animate-spin" />;
      case ProcessingStatus.COMPLETED:
        return <CheckCircle2 className="h-3 w-3" />;
      case ProcessingStatus.FAILED:
        return <AlertCircle className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getProcessingStatusColor = () => {
    switch (image.processingStatus) {
      case ProcessingStatus.PENDING:
        return "bg-yellow-500";
      case ProcessingStatus.PROCESSING:
        return "bg-blue-500";
      case ProcessingStatus.COMPLETED:
        return "bg-green-500";
      case ProcessingStatus.FAILED:
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getUploadMethodBadge = () => {
    switch (image.metadata?.uploadMethod) {
      case UploadMethod.PRESIGNED_UPLOAD:
        return (
          <Badge
            variant="secondary"
            className="text-xs"
          >
            S3 Upload
          </Badge>
        );
      case UploadMethod.EXTERNAL_URL:
        return (
          <Badge
            variant="outline"
            className="text-xs"
          >
            External URL
          </Badge>
        );
      case UploadMethod.LEGACY:
        return (
          <Badge
            variant="secondary"
            className="text-xs"
          >
            Legacy
          </Badge>
        );
      default:
        return null;
    }
  };

  const hasError =
    image.processingStatus === ProcessingStatus.FAILED || image.error;
  const isProcessing = image.processingStatus === ProcessingStatus.PROCESSING;
  const showProgress =
    typeof image.uploadProgress === "number" && image.uploadProgress < 100;

  return (
    <Card
      className={cn(
        "relative overflow-hidden group",
        onClick && "cursor-pointer hover:shadow-md transition-shadow",
        hasError && "border-destructive",
        className,
      )}
      onClick={onClick}
    >
      <CardContent className="p-0 aspect-square h-full relative">
        {/* Main Image */}
        <div className="relative w-full h-full bg-muted">
          {image.url ? (
            <Image
              src={image.url}
              alt={image.alt || "Brand image"}
              width={200}
              height={200}
              className={cn(
                "object-contain !w-full !h-full object-center transition-opacity",
                isProcessing && "opacity-70",
              )}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          )}
        </div>

        {/* Overlay for processing states */}
        {(isProcessing || hasError) && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-white text-center">
              {getProcessingStatusIcon()}
              {hasError && (
                <p className="text-xs mt-1">
                  {image.error || "Processing failed"}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Upload Progress */}
        {showProgress && (
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/75">
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-white">
                <span>Uploading...</span>
                <span>{image.uploadProgress}%</span>
              </div>
              <Progress
                value={image.uploadProgress}
                className="h-1 bg-white/20"
              />
            </div>
          </div>
        )}

        {/* Status Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {showProcessingStatus && image.processingStatus && (
            <Badge
              variant="secondary"
              className={cn(
                "text-xs text-white border-0 px-1.5 py-0.5",
                getProcessingStatusColor(),
              )}
            >
              <span className="flex items-center gap-1">
                {getProcessingStatusIcon()}
                {image.processingStatus}
              </span>
            </Badge>
          )}

          {showUploadMethod && getUploadMethodBadge()}
        </div>

        {/* Image Info */}
        {showDimensions && (image.width || image.height) && (
          <div className="absolute bottom-2 right-2">
            <Badge
              variant="secondary"
              className="text-xs"
            >
              {image.width}×{image.height}
            </Badge>
          </div>
        )}

        {/* File Info Tooltip */}
        {image.filename && (
          <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Badge
              variant="secondary"
              className="text-xs"
            >
              {image.filename}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
