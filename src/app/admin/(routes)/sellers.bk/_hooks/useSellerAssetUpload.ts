import {
  useGenerateSellerUploadUrlsMutation,
  useProcessSellerUploadedImagesMutation,
} from "@/redux/adminDashboard/seller/sellerApi";
import { useCallback, useState } from "react";

// Updated interfaces to match seller requirements
interface UploadProgress {
  stage:
    | "idle"
    | "generating-urls"
    | "uploading-to-s3"
    | "processing-images"
    | "complete"
    | "error";
  progress: number;
  message: string;
  error?: string;
}

interface UploadAssets {
  image?: File;
  banner?: File;
  externalUrls?: {
    image?: string;
    banner?: string;
  };
}

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

export interface UseSellerAssetUploadOptions {
  onUploadComplete?: (image: ProcessedImage) => void;
  onUploadError?: (error: string) => void;
  onProgressUpdate?: (progress: number) => void;
}

export function useSellerAssetUpload(options: UseSellerAssetUploadOptions = {}) {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    stage: "idle",
    progress: 0,
    message: "",
  });

  // RTK Query mutations
  const [generateUrls] = useGenerateSellerUploadUrlsMutation();
  const [processImages] = useProcessSellerUploadedImagesMutation();

  // Main upload function implementing the 3-stage flow
  // For external URLs: The backend handles downloading and uploading, so we skip S3 upload
  // For direct files: We upload to S3 first, then process them
  const uploadAssets = useCallback(
    async (assets: UploadAssets) => {
      try {
        // Step 1: Generate upload URLs
        setUploadProgress({
          stage: "generating-urls",
          progress: 10,
          message: "Generating upload URLs...",
        });

        const fileTypes: ("image" | "banner")[] = [];
        if (assets.image || assets.externalUrls?.image) fileTypes.push("image");
        if (assets.banner || assets.externalUrls?.banner) fileTypes.push("banner");

        console.log("assets: ", assets);
        const urlResponse = await generateUrls({
          fileTypes,
          externalUrls: assets.externalUrls,
        }).unwrap();
        console.log("urlResponse: ", urlResponse);

        // Step 2: Upload files to S3 using presigned URLs (only for direct file uploads)
        const hasFileUploads = assets.image || assets.banner;
        const hasExternalUrls = assets.externalUrls?.image || assets.externalUrls?.banner;
        
        if (hasFileUploads) {
          setUploadProgress({
            stage: "uploading-to-s3",
            progress: 30,
            message: "Uploading files to S3...",
          });
        } else if (hasExternalUrls) {
          setUploadProgress({
            stage: "uploading-to-s3",
            progress: 30,
            message: "Processing external URLs...",
          });
        }

        const uploadPromises: Promise<void>[] = [];
        const uploadedAssets: Record<
          string,
          {
            tempKey: string;
            filename: string;
            originalName: string;
          }
        > = {};

        // Upload image if it's a file (not external URL) and URL generated
        if (assets.image && urlResponse.data.uploadUrls.image) {
          const imageUpload = fetch(urlResponse.data.uploadUrls.image.uploadUrl, {
            method: "PUT",
            body: assets.image,
            headers: {
              "Content-Type": assets.image.type,
            },
          }).then((response) => {
            if (!response.ok) {
              throw new Error(`Image upload failed: ${response.statusText}`);
            }
            uploadedAssets.image = {
              tempKey: urlResponse.data.uploadUrls.image.key,
              filename: assets.image!.name,
              originalName: assets.image!.name,
            };
          });
          uploadPromises.push(imageUpload);
        }

        // Upload banner if it's a file (not external URL) and URL generated
        if (assets.banner && urlResponse.data.uploadUrls.banner) {
          const bannerUpload = fetch(
            urlResponse.data.uploadUrls.banner.uploadUrl,
            {
              method: "PUT",
              body: assets.banner,
              headers: {
                "Content-Type": assets.banner.type,
              },
            },
          ).then((response) => {
            if (!response.ok) {
              throw new Error(`Banner upload failed: ${response.statusText}`);
            }
            uploadedAssets.banner = {
              tempKey: urlResponse.data.uploadUrls.banner.key,
              filename: assets.banner!.name,
              originalName: assets.banner!.name,
            };
          });
          uploadPromises.push(bannerUpload);
        }

        // Wait for all S3 uploads to complete (skip if only external URLs)
        if (uploadPromises.length > 0) {
          await Promise.all(uploadPromises);
        }

        // Step 3: Process uploaded images (only if we have actual file uploads)
        let processedResults: Record<string, ProcessedImage> = {};
        if (Object.keys(uploadedAssets).length > 0) {
          setUploadProgress({
            stage: "processing-images",
            progress: 70,
            message: "Processing and optimizing images...",
          });

          const processResponse = await processImages({
            uploads: uploadedAssets,
          }).unwrap();

          if (!processResponse.success) {
            throw new Error("Image processing failed");
          }

          processedResults = processResponse.data.processedImages;
        }

        // Step 4: Combine processed uploads with external URL results
        const finalAssets: Record<string, ProcessedImage> = {};

        // Add processed uploads
        Object.entries(processedResults).forEach(([type, data]) => {
          finalAssets[type] = data;
        });

        // Add external URL results
        const externalResults = urlResponse.data.externalResults || {};
        Object.entries(externalResults).forEach(([type, result]) => {
          if (result.success) {
            finalAssets[type] = {
              url: result.url!,
              s3Key: result.s3Key!,
              uploadMethod: "external_url",
              ...result.metadata,
            };
          }
        });

        setUploadProgress({
          stage: "complete",
          progress: 100,
          message: "Upload complete!",
        });

        return {
          success: true,
          data: finalAssets,
        };
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        setUploadProgress({
          stage: "error",
          progress: 0,
          message: "Upload failed",
          error: errorMessage,
        });
        throw error;
      }
    },
    [generateUrls, processImages],
  );

  const resetProgress = useCallback(() => {
    setUploadProgress({
      stage: "idle",
      progress: 0,
      message: "",
    });
  }, []);

  // Legacy compatibility methods for existing ImageUploader
  const uploadFiles = useCallback(
    async (files: File[], type: "image" | "banner" | "gallery") => {
      const assets: UploadAssets = {};
      if (type === "image") assets.image = files[0];
      if (type === "banner") assets.banner = files[0];

      const result = await uploadAssets(assets);
      const processedImage = result.data[type];

      if (processedImage) {
        options.onUploadComplete?.(processedImage);
        return [processedImage];
      }
      return [];
    },
    [uploadAssets, options],
  );

  const processExternalImageUrls = useCallback(
    async (
      urls: Array<{ url: string; alt?: string }>,
      type: "image" | "banner" | "gallery",
    ) => {
      const assets: UploadAssets = {
        externalUrls: {
          [type]: urls[0]?.url,
        },
      };

      const result = await uploadAssets(assets);
      const processedImage = result.data[type];

      if (processedImage) {
        options.onUploadComplete?.(processedImage);
        return [processedImage];
      }
      return [];
    },
    [uploadAssets, options],
  );

  const clearState = useCallback(() => {
    resetProgress();
  }, [resetProgress]);

  return {
    // Guide-compliant interface
    uploadAssets,
    uploadProgress,
    resetProgress,
    isUploading:
      uploadProgress.stage !== "idle" &&
      uploadProgress.stage !== "complete" &&
      uploadProgress.stage !== "error",
    isComplete: uploadProgress.stage === "complete",
    hasError: uploadProgress.stage === "error",

    // Legacy compatibility for existing components
    uploadFiles,
    processExternalImageUrls,
    clearState,
    progress: {},
    errors: uploadProgress.error ? [uploadProgress.error] : [],
  };
}