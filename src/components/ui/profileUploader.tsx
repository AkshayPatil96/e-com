"use client";

import {
  ArrowLeftIcon,
  CircleUserRoundIcon,
  XIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Cropper,
  CropperCropArea,
  CropperDescription,
  CropperImage,
} from "@/components/ui/cropper";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { useFileUpload } from "@/hooks/use-file-upload";

// Define type for pixel crop area
type Area = { x: number; y: number; width: number; height: number };

// Helper function to create a cropped image blob
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous"); // Needed for canvas Tainted check
    image.src = url;
  });

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  outputWidth: number = pixelCrop.width, // Optional: specify output size
  outputHeight: number = pixelCrop.height,
): Promise<Blob | null> {
  try {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return null;
    }

    // Set canvas size to desired output size
    canvas.width = outputWidth;
    canvas.height = outputHeight;

    const centerX = outputWidth / 2;
    const centerY = outputHeight / 2;
    const radius = Math.min(outputWidth, outputHeight) / 2;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.clip();

    // Draw the cropped image onto the canvas
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      outputWidth, // Draw onto the output size
      outputHeight,
    );

    // Convert canvas to blob
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/jpeg"); // Specify format and quality if needed
    });
  } catch (error) {
    console.error("Error in getCroppedImg:", error);
    return null;
  }
}

// Controlled ProfileUploader for use in forms
type ProfileUploaderProps = {
  value: File | null;
  onChange: (file: File | null) => void;
  error?: string;
};

export function ProfileUploader({
  value,
  onChange,
  error,
}: ProfileUploaderProps) {
  const [
    { files, isDragging },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
    },
  ] = useFileUpload({
    accept: "image/*",
  });

  // If value is set from outside, show its preview
  const [finalImageUrl, setFinalImageUrl] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const previousFileIdRef = useRef<string | undefined | null>(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [zoom, setZoom] = useState(1);

  // If value changes from outside, update preview
  useEffect(() => {
    if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setFinalImageUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setFinalImageUrl(null);
    }
  }, [value]);

  // Use uploaded file for cropping
  const previewUrl = files[0]?.preview || null;
  const fileId = files[0]?.id;

  const handleCropChange = useCallback((pixels: Area | null) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleApply = async () => {
    if (!previewUrl || !fileId || !croppedAreaPixels) {
      if (fileId) {
        removeFile(fileId);
        setCroppedAreaPixels(null);
      }
      return;
    }
    try {
      const croppedBlob = await getCroppedImg(previewUrl, croppedAreaPixels);
      if (!croppedBlob)
        throw new Error("Failed to generate cropped image blob.");
      const croppedFile = new File([croppedBlob], files[0].file.name, {
        type: croppedBlob.type,
      });
      onChange(croppedFile);
      setIsDialogOpen(false);
    } catch {
      setIsDialogOpen(false);
    }
  };

  const handleRemoveFinalImage = () => {
    setFinalImageUrl(null);
    onChange(null);
  };

  // Open dialog when a new file is uploaded
  useEffect(() => {
    if (fileId && fileId !== previousFileIdRef.current) {
      setIsDialogOpen(true);
      setCroppedAreaPixels(null);
      setZoom(1);
    }
    previousFileIdRef.current = fileId;
  }, [fileId]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative inline-flex">
        <button
          className="border-border hover:bg-accent/50 data-[dragging=true]:bg-accent/50 focus-visible:border-ring focus-visible:ring-ring/50 relative flex size-16 items-center justify-center overflow-hidden rounded-full border transition-colors outline-none focus-visible:ring-[3px] has-disabled:pointer-events-none has-disabled:opacity-50 has-[img]:border-none"
          onClick={openFileDialog}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          type="button"
          onDrop={handleDrop}
          data-dragging={isDragging || undefined}
          aria-label={finalImageUrl ? "Change image" : "Upload image"}
        >
          {finalImageUrl ? (
            <img
              className="size-full object-cover"
              src={finalImageUrl || "/placeholder.svg"}
              alt="User avatar"
              width={64}
              height={64}
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div aria-hidden="true">
              <CircleUserRoundIcon className="size-8 opacity-60" />
            </div>
          )}
        </button>
        {finalImageUrl && (
          <Button
            onClick={handleRemoveFinalImage}
            size="icon"
            className="border-background focus-visible:border-background absolute -top-1 -right-1 size-6 rounded-full border-2 shadow-none"
            aria-label="Remove image"
            type="button"
          >
            <XIcon className="size-3.5" />
          </Button>
        )}
        <input
          {...getInputProps()}
          className="sr-only"
          aria-label="Upload image file"
          tabIndex={-1}
        />
      </div>
      {error && <span className="text-red-500 text-xs">{error}</span>}
      <Dialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      >
        <DialogContent className="gap-0 p-0 sm:max-w-140 *:[button]:hidden">
          <DialogDescription className="sr-only">
            Crop image dialog
          </DialogDescription>
          <DialogHeader className="contents space-y-0 text-left">
            <DialogTitle className="flex items-center justify-between border-b p-4 text-base">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="-my-1 opacity-60"
                  onClick={() => setIsDialogOpen(false)}
                  aria-label="Cancel"
                >
                  <ArrowLeftIcon aria-hidden="true" />
                </Button>
                <span>Crop image</span>
              </div>
              <Button
                className="-my-1"
                onClick={handleApply}
                disabled={!previewUrl}
                type="button"
                autoFocus
              >
                Apply
              </Button>
            </DialogTitle>
          </DialogHeader>
          {previewUrl && (
            <Cropper
              className="h-96 sm:h-120"
              image={previewUrl}
              zoom={zoom}
              onCropChange={handleCropChange}
              onZoomChange={setZoom}
              aspectRatio={1}
            >
              <CropperDescription />
              <CropperImage />
              <CropperCropArea />
            </Cropper>
          )}
          <DialogFooter className="border-t px-4 py-6">
            <div className="mx-auto flex w-full max-w-80 items-center gap-4">
              <ZoomOutIcon
                className="shrink-0 opacity-60"
                size={16}
                aria-hidden="true"
              />
              <Slider
                defaultValue={[1]}
                value={[zoom]}
                min={1}
                max={3}
                step={0.1}
                onValueChange={(value) => setZoom(value[0])}
                aria-label="Zoom slider"
              />
              <ZoomInIcon
                className="shrink-0 opacity-60"
                size={16}
                aria-hidden="true"
              />
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
