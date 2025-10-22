/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useGenerateBrandUploadUrlsMutation,
  useProcessUploadedImagesMutation,
  useUpdateBrandBannerMutation,
  useUpdateBrandLogoMutation,
} from "@/redux/adminDashboard/brand/brandApi";
import { useCallback, useState } from "react";

// Updated interfaces to match guide
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
  logo?: File;
  banner?: File;
  externalUrls?: {
    logo?: string;
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

export interface UseBrandAssetUploadOptions {
  onUploadComplete?: (image: ProcessedImage) => void;
  onUploadError?: (error: string) => void;
  onProgressUpdate?: (progress: number) => void;
}

export function useBrandAssetUpload(options: UseBrandAssetUploadOptions = {}) {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    stage: "idle",
    progress: 0,
    message: "",
  });

  // RTK Query mutations
  const [generateUrls] = useGenerateBrandUploadUrlsMutation();
  const [processImages] = useProcessUploadedImagesMutation();

  // Main upload function implementing the 3-stage flow from the guide
  // const uploadAssets = useCallback(
  //   async (assets: UploadAssets) => {
  //     try {
  //       // Step 1: Generate upload URLs
  //       setUploadProgress({
  //         stage: "generating-urls",
  //         progress: 10,
  //         message: "Generating upload URLs...",
  //       });

  //       const fileTypes: ("logo" | "banner")[] = [];
  //       if (assets.logo || assets.externalUrls?.logo) fileTypes.push("logo");
  //       if (assets.banner || assets.externalUrls?.banner)
  //         fileTypes.push("banner");

  //       console.log("assets: ", assets);
  //       const urlResponse = await generateUrls({
  //         fileTypes,
  //         externalUrls: assets.externalUrls,
  //       }).unwrap();
  //       console.log("urlResponse: ", urlResponse);

  //       // Step 2: Upload files to S3 using presigned URLs
  //       setUploadProgress({
  //         stage: "uploading-to-s3",
  //         progress: 30,
  //         message: "Uploading files to S3...",
  //       });

  //       const uploadPromises: Promise<void>[] = [];
  //       const uploadedAssets: Record<
  //         string,
  //         {
  //           tempKey: string;
  //           filename: string;
  //           originalName: string;
  //         }
  //       > = {};

  //       // Upload logo if provided and URL generated
  //       console.log("assets: ", assets);
  //       if (assets.logo && urlResponse.data.uploadUrls.logo) {
  //         const logoUpload = fetch(urlResponse.data.uploadUrls.logo.uploadUrl, {
  //           method: "PUT",
  //           body: assets.logo,
  //           headers: {
  //             "Content-Type": assets.logo.type,
  //           },
  //         }).then((response) => {
  //           if (!response.ok) {
  //             throw new Error(`Logo upload failed: ${response.statusText}`);
  //           }
  //           uploadedAssets.logo = {
  //             tempKey: urlResponse.data.uploadUrls.logo.key,
  //             filename: assets.logo!.name,
  //             originalName: assets.logo!.name,
  //           };
  //         });
  //         uploadPromises.push(logoUpload);
  //       }

  //       // Upload banner if provided and URL generated
  //       if (assets.banner && urlResponse.data.uploadUrls.banner) {
  //         const bannerUpload = fetch(
  //           urlResponse.data.uploadUrls.banner.uploadUrl,
  //           {
  //             method: "PUT",
  //             body: assets.banner,
  //             headers: {
  //               "Content-Type": assets.banner.type,
  //             },
  //           },
  //         ).then((response) => {
  //           if (!response.ok) {
  //             throw new Error(`Banner upload failed: ${response.statusText}`);
  //           }
  //           uploadedAssets.banner = {
  //             tempKey: urlResponse.data.uploadUrls.banner.key,
  //             filename: assets.banner!.name,
  //             originalName: assets.banner!.name,
  //           };
  //         });
  //         uploadPromises.push(bannerUpload);
  //       }

  //       // Wait for all S3 uploads to complete
  //       await Promise.all(uploadPromises);

  //       // Step 3: Process uploaded images (move from temp to permanent location)
  //       setUploadProgress({
  //         stage: "processing-images",
  //         progress: 70,
  //         message: "Processing and optimizing images...",
  //       });

  //       let processedResults: Record<string, ProcessedImage> = {};
  //       if (Object.keys(uploadedAssets).length > 0) {
  //         const processResponse = await processImages({
  //           uploads: uploadedAssets,
  //         }).unwrap();

  //         if (!processResponse.success) {
  //           throw new Error("Image processing failed");
  //         }

  //         processedResults = processResponse.data.processedImages;
  //       }

  //       // Step 4: Combine processed uploads with external URL results
  //       const finalAssets: Record<string, ProcessedImage> = {};

  //       // Add processed uploads
  //       Object.entries(processedResults).forEach(([type, data]) => {
  //         finalAssets[type] = data;
  //       });

  //       // Add external URL results
  //       const externalResults = urlResponse.data.externalResults || {};
  //       Object.entries(externalResults).forEach(([type, result]) => {
  //         if (result.success) {
  //           finalAssets[type] = {
  //             url: result.url!,
  //             s3Key: result.s3Key!,
  //             uploadMethod: "external_url",
  //             ...result.metadata,
  //           };
  //         }
  //       });

  //       setUploadProgress({
  //         stage: "complete",
  //         progress: 100,
  //         message: "Upload complete!",
  //       });

  //       return {
  //         success: true,
  //         data: finalAssets,
  //       };
  //     } catch (error: unknown) {
  //       const errorMessage =
  //         error instanceof Error ? error.message : "Unknown error occurred";
  //       setUploadProgress({
  //         stage: "error",
  //         progress: 0,
  //         message: "Upload failed",
  //         error: errorMessage,
  //       });
  //       throw error;
  //     }
  //   },
  //   [generateUrls, processImages],
  // );

  const uploadAssets = useCallback(
    async (assets: UploadAssets) => {
      try {
        // Step 1: Generate upload URLs
        setUploadProgress({
          stage: "generating-urls",
          progress: 10,
          message: "Generating upload URLs...",
        });

        // ✅ Only request presigned URLs for actual files, not external URLs
        const fileTypes: ("logo" | "banner")[] = [];
        if (assets.logo) fileTypes.push("logo");
        if (assets.banner) fileTypes.push("banner");

        console.log("Requesting URLs for file types:", fileTypes);
        console.log("External URLs:", assets.externalUrls);

        const urlResponse = await generateUrls({
          fileTypes,
          externalUrls: assets.externalUrls,
        }).unwrap();

        console.log("URL Response:", urlResponse);

        // Step 2: Upload files to S3 using presigned URLs (only for actual files)
        if (fileTypes.length > 0) {
          setUploadProgress({
            stage: "uploading-to-s3",
            progress: 30,
            message: "Uploading files to S3...",
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

        // ✅ Only upload actual files, check that we have both file AND presigned URL
        if (assets.logo && urlResponse.data.uploadUrls?.logo) {
          const logoUpload = fetch(urlResponse.data.uploadUrls.logo.uploadUrl, {
            method: "PUT",
            body: assets.logo,
            headers: {
              "Content-Type": assets.logo.type, // ✅ Safe because we know assets.logo is a File
            },
          }).then((response) => {
            if (!response.ok) {
              throw new Error(`Logo upload failed: ${response.statusText}`);
            }
            uploadedAssets.logo = {
              tempKey: urlResponse.data.uploadUrls.logo.key,
              filename: assets.logo!.name,
              originalName: assets.logo!.name,
            };
          });
          uploadPromises.push(logoUpload);
        }

        if (assets.banner && urlResponse.data.uploadUrls?.banner) {
          const bannerUpload = fetch(
            urlResponse.data.uploadUrls.banner.uploadUrl,
            {
              method: "PUT",
              body: assets.banner,
              headers: {
                "Content-Type": assets.banner.type, // ✅ Safe because we know assets.banner is a File
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

        // Wait for all S3 uploads to complete
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
        setUploadProgress({
          stage: "processing-images",
          progress: 90,
          message: "Finalizing results...",
        });

        const finalAssets: Record<string, ProcessedImage> = {};

        // ✅ Add processed file uploads
        Object.entries(processedResults).forEach(([type, data]) => {
          finalAssets[type] = data as ProcessedImage;
        });

        // ✅ Add external URL results (these are already processed by backend)
        const externalResults = urlResponse.data.externalResults || {};
        Object.entries(externalResults).forEach(
          ([type, result]: [string, any]) => {
            if (result.success) {
              finalAssets[type] = {
                url: result.url,
                s3Key: result.s3Key,
                uploadMethod: "external_url",
                width: result.metadata?.width,
                height: result.metadata?.height,
                size: result.metadata?.size,
                format: result.metadata?.format,
              } as ProcessedImage;
            }
          },
        );

        setUploadProgress({
          stage: "complete",
          progress: 100,
          message: "Upload complete!",
        });

        console.log("Final processed assets:", finalAssets);

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
    async (files: File[], type: "logo" | "banner" | "gallery") => {
      const assets: UploadAssets = {};
      if (type === "logo") assets.logo = files[0];
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
      type: "logo" | "banner" | "gallery",
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
