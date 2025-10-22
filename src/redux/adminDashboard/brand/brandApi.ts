import {
  BrandAdminQueryParams,
  IBrandBulkActionRequest,
  IBrandFormData,
  IBrandListResponse,
  IBrandResponse,
  IBrandSearchParams,
  IBrandSearchResponse,
  IBrandStatisticsResponse,
  IBulkActionResponse,
  IDeleteRestoreResponse,
  IGenerateUploadUrlsRequest,
  IGenerateUploadUrlsResponse,
  IImage,
  IProcessImagesRequest,
  IProcessImagesResponse,
  IToggleStatusResponse,
} from "@/app/admin/(routes)/brands/_types/brand.types";
import { apiSlice } from "@/redux/api/apiSlice";

export const adminBrandApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 1. List & View APIs
    getBrandsListAdmin: builder.query<
      IBrandListResponse,
      BrandAdminQueryParams
    >({
      query: (params = {}) => ({
        url: "/admin/brands",
        method: "GET",
        params,
        credentials: "include" as const,
      }),
      providesTags: (result) =>
        result?.data?.data
          ? [
              ...result.data.data.map(({ _id }) => ({
                type: "Brand" as const,
                id: _id,
              })),
              { type: "Brand", id: "LIST" },
            ]
          : [{ type: "Brand", id: "LIST" }],
    }),

    getBrandByIdAdmin: builder.query<IBrandResponse, string>({
      query: (id) => ({
        url: `/admin/brands/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: (result, error, id) => [{ type: "Brand", id }],
    }),

    getBrandStatistics: builder.query<IBrandStatisticsResponse, void>({
      query: () => ({
        url: "/admin/brands/statistics",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: [{ type: "Brand", id: "STATS" }],
    }),

    searchBrands: builder.query<IBrandSearchResponse, IBrandSearchParams>({
      query: (params = {}) => ({
        url: "/admin/brands/search",
        method: "GET",
        params: {
          limit: 10, // Default limit for autocomplete
          ...params,
        },
        credentials: "include" as const,
      }),
      providesTags: [{ type: "Brand", id: "SEARCH" }],
    }),

    // 2. CRUD Operations
    createBrand: builder.mutation<IBrandResponse, IBrandFormData>({
      query: (data) => ({
        url: "/admin/brands",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [
        { type: "Brand", id: "LIST" },
        { type: "Brand", id: "STATS" },
        { type: "Brand", id: "SEARCH" },
      ],
    }),

    updateBrand: builder.mutation<
      IBrandResponse,
      IBrandFormData & { id: string }
    >({
      query: ({ id, ...data }) => ({
        url: `/admin/brands/${id}`,
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Brand", id },
        { type: "Brand", id: "LIST" },
        { type: "Brand", id: "STATS" },
        { type: "Brand", id: "SEARCH" },
      ],
    }),

    deleteBrand: builder.mutation<IDeleteRestoreResponse, string>({
      query: (id) => ({
        url: `/admin/brands/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Brand", id },
        { type: "Brand", id: "LIST" },
        { type: "Brand", id: "STATS" },
        { type: "Brand", id: "SEARCH" },
      ],
    }),

    restoreBrand: builder.mutation<IDeleteRestoreResponse, string>({
      query: (id) => ({
        url: `/admin/brands/${id}/restore`,
        method: "PUT",
        credentials: "include" as const,
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Brand", id },
        { type: "Brand", id: "LIST" },
        { type: "Brand", id: "STATS" },
        { type: "Brand", id: "SEARCH" },
      ],
    }),

    // 3. Status & Feature Management
    toggleBrandStatus: builder.mutation<IToggleStatusResponse, string>({
      query: (id) => ({
        url: `/admin/brands/${id}/toggle-status`,
        method: "PUT",
        credentials: "include" as const,
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Brand", id },
        { type: "Brand", id: "LIST" },
        { type: "Brand", id: "STATS" },
        { type: "Brand", id: "SEARCH" },
      ],
    }),

    // 4. Image Upload Operations
    generateBrandUploadUrls: builder.mutation<
      IGenerateUploadUrlsResponse,
      IGenerateUploadUrlsRequest
    >({
      query: (data) => ({
        url: "/admin/brands/upload-urls",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
    }),

    processUploadedImages: builder.mutation<
      IProcessImagesResponse,
      IProcessImagesRequest
    >({
      query: (data) => ({
        url: "/admin/brands/process-images",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
    }),

    updateBrandLogo: builder.mutation<
      IBrandResponse,
      {
        id: string;
        logoData?: IImage;
        externalUrl?: string;
        deleteFromS3?: boolean;
      }
    >({
      query: ({ id, logoData, externalUrl, deleteFromS3 }) => ({
        url: `/admin/brands/${id}/logo`,
        method: "PUT",
        body: { logoData, externalUrl, deleteFromS3 },
        credentials: "include" as const,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Brand", id },
        { type: "Brand", id: "LIST" },
        { type: "Brand", id: "SEARCH" },
      ],
    }),

    updateBrandBanner: builder.mutation<
      IBrandResponse,
      {
        id: string;
        bannerData?: IImage;
        externalUrl?: string;
        deleteFromS3?: boolean;
      }
    >({
      query: ({ id, bannerData, externalUrl, deleteFromS3 }) => ({
        url: `/admin/brands/${id}/banner`,
        method: "PUT",
        body: { bannerData, externalUrl, deleteFromS3 },
        credentials: "include" as const,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Brand", id },
        { type: "Brand", id: "LIST" },
        { type: "Brand", id: "SEARCH" },
      ],
    }),

    // 5. Bulk Operations
    bulkBrandAction: builder.mutation<
      IBulkActionResponse,
      IBrandBulkActionRequest
    >({
      query: (data) => ({
        url: "/admin/brands/bulk-action",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [
        { type: "Brand", id: "LIST" },
        { type: "Brand", id: "STATS" },
        { type: "Brand", id: "SEARCH" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  // List & View
  useGetBrandsListAdminQuery,
  useGetBrandByIdAdminQuery,
  useGetBrandStatisticsQuery,

  // Search
  useSearchBrandsQuery,

  // CRUD Operations
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
  useRestoreBrandMutation,

  // Status Management
  useToggleBrandStatusMutation,

  // Image Upload Operations
  useGenerateBrandUploadUrlsMutation,
  useProcessUploadedImagesMutation,
  useUpdateBrandLogoMutation,
  useUpdateBrandBannerMutation,

  // Bulk Operations
  useBulkBrandActionMutation,
} = adminBrandApi;
