import {
  BulkActionRequest,
  CategoryAdminQueryParams,
  CategoryFormData,
  IBulkActionResponse,
  ICategoryHierarchyResponse,
  ICategoryListResponse,
  ICategoryResponse,
  ICategorySearchParams,
  ICategorySearchResponse,
  ICategoryStatisticsResponse,
  IDeleteRestoreResponse,
  IMoveResponse,
  IToggleStatusResponse,
} from "@/app/admin/(routes)/categories/_types/category.types";
import { apiSlice } from "@/redux/api/apiSlice";

export const adminCategoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 1. List & View APIs
    getCategoriesListAdmin: builder.query<ICategoryListResponse, CategoryAdminQueryParams>({
      query: (params = {}) => ({
        url: "/admin/categories",
        method: "GET",
        params,
        credentials: "include" as const,
      }),
      providesTags: (result) =>
        result?.data?.data
          ? [
              ...result.data.data.map(({ _id }) => ({ type: "Category" as const, id: _id })),
              { type: "Category", id: "LIST" },
            ]
          : [{ type: "Category", id: "LIST" }],
    }),

    getCategoryByIdAdmin: builder.query<ICategoryResponse, string>({
      query: (id) => ({
        url: `/admin/categories/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: (result, error, id) => [{ type: "Category", id }],
    }),

    getCategoryHierarchy: builder.query<ICategoryHierarchyResponse, void>({
      query: () => ({
        url: "/admin/categories/hierarchy",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: [{ type: "Category", id: "HIERARCHY" }],
    }),

    getCategoryStatistics: builder.query<ICategoryStatisticsResponse, void>({
      query: () => ({
        url: "/admin/categories/statistics",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: [{ type: "Category", id: "STATS" }],
    }),

    searchCategories: builder.query<ICategorySearchResponse, ICategorySearchParams>({
      query: (params = {}) => ({
        url: "/admin/categories/search",
        method: "GET",
        params: {
          limit: 10, // Default limit for autocomplete
          ...params,
        },
        credentials: "include" as const,
      }),
      providesTags: [{ type: "Category", id: "SEARCH" }],
    }),

    // 2. CRUD Operations
    createCategory: builder.mutation<ICategoryResponse, CategoryFormData>({
      query: (data) => ({
        url: "/admin/categories",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [
        { type: "Category", id: "LIST" },
        { type: "Category", id: "HIERARCHY" },
        { type: "Category", id: "STATS" },
        { type: "Category", id: "SEARCH" },
      ],
    }),

    updateCategory: builder.mutation<ICategoryResponse, CategoryFormData & { id: string }>({
      query: ({ id, ...data }) => ({
        url: `/admin/categories/${id}`,
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Category", id },
        { type: "Category", id: "LIST" },
        { type: "Category", id: "HIERARCHY" },
        { type: "Category", id: "STATS" },
        { type: "Category", id: "SEARCH" },
      ],
    }),

    deleteCategory: builder.mutation<IDeleteRestoreResponse, string>({
      query: (id) => ({
        url: `/admin/categories/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Category", id },
        { type: "Category", id: "LIST" },
        { type: "Category", id: "HIERARCHY" },
        { type: "Category", id: "STATS" },
        { type: "Category", id: "SEARCH" },
      ],
    }),

    restoreCategory: builder.mutation<IDeleteRestoreResponse, string>({
      query: (id) => ({
        url: `/admin/categories/${id}/restore`,
        method: "PUT",
        credentials: "include" as const,
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Category", id },
        { type: "Category", id: "LIST" },
        { type: "Category", id: "HIERARCHY" },
        { type: "Category", id: "STATS" },
        { type: "Category", id: "SEARCH" },
      ],
    }),

    // 3. Status & Feature Management
    toggleCategoryStatus: builder.mutation<IToggleStatusResponse, string>({
      query: (id) => ({
        url: `/admin/categories/${id}/toggle-status`,
        method: "PUT",
        credentials: "include" as const,
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Category", id },
        { type: "Category", id: "LIST" },
        { type: "Category", id: "HIERARCHY" },
        { type: "Category", id: "STATS" },
        { type: "Category", id: "SEARCH" },
      ],
    }),

    // 4. Organization & Structure
    moveCategory: builder.mutation<IMoveResponse, { id: string; newParentId?: string; newOrder?: number }>({
      query: ({ id, ...data }) => ({
        url: `/admin/categories/${id}/move`,
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Category", id },
        { type: "Category", id: "LIST" },
        { type: "Category", id: "HIERARCHY" },
        { type: "Category", id: "STATS" },
        { type: "Category", id: "SEARCH" },
      ],
    }),

    // 5. Bulk Operations
    bulkCategoryAction: builder.mutation<IBulkActionResponse, BulkActionRequest>({
      query: (data) => ({
        url: "/admin/categories/bulk-action",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [
        { type: "Category", id: "LIST" },
        { type: "Category", id: "HIERARCHY" },
        { type: "Category", id: "STATS" },
        { type: "Category", id: "SEARCH" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  // List & View
  useGetCategoriesListAdminQuery,
  useGetCategoryByIdAdminQuery,
  useGetCategoryHierarchyQuery,
  useGetCategoryStatisticsQuery,
  
  // Search
  useSearchCategoriesQuery,
  
  // CRUD Operations
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useRestoreCategoryMutation,
  
  // Status Management
  useToggleCategoryStatusMutation,
  
  // Organization
  useMoveCategoryMutation,
  
  // Bulk Operations
  useBulkCategoryActionMutation,
} = adminCategoryApi;
