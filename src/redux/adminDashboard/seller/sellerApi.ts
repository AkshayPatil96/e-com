import {
  IBulkActionResponse,
  IDeleteRestoreResponse,
  IGenerateUploadUrlsRequest,
  IGenerateUploadUrlsResponse,
  IProcessImagesRequest,
  IProcessImagesResponse,
  ISellerAdminListResponse,
  ISellerBulkActionRequest,
  ISellerFormData,
  ISellerResponse,
  ISellerSearchResponse,
  ISellerStatistics,
  IToggleStatusResponse,
  IUserSearchResponse,
  SellerAdminQueryParams,
} from "@/app/admin/(routes)/sellers/_types/seller.types";
import { apiSlice } from "@/redux/api/apiSlice";

export const adminSellerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 1. List & View APIs
    getSellersListAdmin: builder.query<
      ISellerAdminListResponse,
      SellerAdminQueryParams
    >({
      query: (params = {}) => ({
        url: "/admin/sellers",
        method: "GET",
        params: {
          page: 1,
          limit: 20,
          search: "",
          status: "all",
          verified: "all",
          featured: "all",
          isDeleted: false,
          sortBy: "createdAt",
          sortOrder: "desc",
          ...params,
        },
        credentials: "include" as const,
      }),
      providesTags: (result) =>
        result?.data?.data
          ? [
              ...result.data.data.map(({ _id }) => ({
                type: "Seller" as const,
                id: _id,
              })),
              { type: "Seller", id: "LIST" },
            ]
          : [{ type: "Seller", id: "LIST" }],
    }),

    getSellerByIdAdmin: builder.query<ISellerResponse, string>({
      query: (id) => ({
        url: `/admin/sellers/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: (result, error, id) => [{ type: "Seller", id }],
    }),

    // 2. CRUD Operations
    createSeller: builder.mutation<ISellerResponse, ISellerFormData>({
      query: (data) => ({
        url: "/admin/sellers",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [
        { type: "Seller", id: "LIST" },
        { type: "SellerStats", id: "STATS" },
      ],
    }),

    updateSeller: builder.mutation<
      ISellerResponse,
      { id: string } & Partial<ISellerFormData>
    >({
      query: ({ id, ...data }) => ({
        url: `/admin/sellers/${id}`,
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Seller", id },
        { type: "Seller", id: "LIST" },
        { type: "SellerStats", id: "STATS" },
      ],
    }),

    deleteSeller: builder.mutation<IDeleteRestoreResponse, string>({
      query: (id) => ({
        url: `/admin/sellers/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Seller", id },
        { type: "Seller", id: "LIST" },
        { type: "SellerStats", id: "STATS" },
      ],
    }),

    restoreSeller: builder.mutation<IDeleteRestoreResponse, string>({
      query: (id) => ({
        url: `/admin/sellers/${id}/restore`,
        method: "PUT",
        credentials: "include" as const,
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Seller", id },
        { type: "Seller", id: "LIST" },
        { type: "SellerStats", id: "STATS" },
      ],
    }),

    toggleSellerStatus: builder.mutation<IToggleStatusResponse, string>({
      query: (id) => ({
        url: `/admin/sellers/${id}/toggle-status`,
        method: "PUT",
        credentials: "include" as const,
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Seller", id },
        { type: "Seller", id: "LIST" },
        { type: "SellerStats", id: "STATS" },
      ],
    }),

    // 3. Search APIs
    searchSellersAdmin: builder.query<
      ISellerSearchResponse,
      {
        q?: string;
        limit?: number;
        page?: number;
        includeDeleted?: boolean;
      }
    >({
      query: (params) => ({
        url: "/admin/sellers/search",
        method: "GET",
        params: {
          q: "",
          limit: 20,
          page: 1,
          includeDeleted: false,
          ...params,
        },
        credentials: "include" as const,
      }),
      providesTags: [{ type: "Seller", id: "SEARCH" }],
    }),

    searchUsersForSeller: builder.query<
      IUserSearchResponse,
      {
        q?: string;
        limit?: number;
        page?: number;
        excludeExistingSellers?: boolean;
      }
    >({
      query: (params) => ({
        url: "/admin/users/search",
        method: "GET",
        params: {
          q: "",
          limit: 20,
          page: 1,
          excludeExistingSellers: true,
          ...params,
        },
        credentials: "include" as const,
      }),
      providesTags: [{ type: "User", id: "SEARCH" }],
    }),

    // 4. Statistics API
    getSellerStatistics: builder.query<ISellerStatistics, void>({
      query: () => ({
        url: "/admin/sellers/statistics",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: [{ type: "SellerStats", id: "STATS" }],
    }),

    // 5. Bulk Actions
    bulkActionSellers: builder.mutation<
      IBulkActionResponse,
      ISellerBulkActionRequest
    >({
      query: (data) => ({
        url: "/admin/sellers/bulk-action",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [
        { type: "Seller", id: "LIST" },
        { type: "SellerStats", id: "STATS" },
      ],
    }),

    // 6. File Upload APIs
    generateSellerUploadUrls: builder.mutation<
      IGenerateUploadUrlsResponse,
      IGenerateUploadUrlsRequest
    >({
      query: (data) => ({
        url: "/admin/sellers/upload-urls",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
    }),

    processSellerImages: builder.mutation<
      IProcessImagesResponse,
      IProcessImagesRequest
    >({
      query: (data) => ({
        url: "/admin/sellers/process-images",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
    }),

    // 7. Additional Features
    verifySeller: builder.mutation<ISellerResponse, string>({
      query: (id) => ({
        url: `/admin/sellers/${id}/verify`,
        method: "PUT",
        credentials: "include" as const,
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Seller", id },
        { type: "Seller", id: "LIST" },
        { type: "SellerStats", id: "STATS" },
      ],
    }),

    unverifySeller: builder.mutation<ISellerResponse, string>({
      query: (id) => ({
        url: `/admin/sellers/${id}/unverify`,
        method: "PUT",
        credentials: "include" as const,
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Seller", id },
        { type: "Seller", id: "LIST" },
        { type: "SellerStats", id: "STATS" },
      ],
    }),

    toggleSellerFeature: builder.mutation<ISellerResponse, string>({
      query: (id) => ({
        url: `/admin/sellers/${id}/toggle-feature`,
        method: "PUT",
        credentials: "include" as const,
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Seller", id },
        { type: "Seller", id: "LIST" },
        { type: "SellerStats", id: "STATS" },
      ],
    }),
  }),
});

export const {
  // List & View
  useGetSellersListAdminQuery,
  useGetSellerByIdAdminQuery,

  // CRUD
  useCreateSellerMutation,
  useUpdateSellerMutation,
  useDeleteSellerMutation,
  useRestoreSellerMutation,
  useToggleSellerStatusMutation,

  // Search
  useSearchSellersAdminQuery,
  useSearchUsersForSellerQuery,

  // Statistics
  useGetSellerStatisticsQuery,

  // Bulk Actions
  useBulkActionSellersMutation,

  // File Upload
  useGenerateSellerUploadUrlsMutation,
  useProcessSellerImagesMutation,

  // Features
  useVerifySellerMutation,
  useUnverifySellerMutation,
  useToggleSellerFeatureMutation,
} = adminSellerApi;
