import {
  Admin,
  AdminFilters,
  AdminFormData,
} from "@/app/admin/(routes)/settings/admin/_types/admin.types";
import { apiSlice } from "@/redux/api/apiSlice";

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminsList: builder.query({
      query: (filters: AdminFilters = {}) => ({
        url: "/admin/admin-user/all",
        method: "GET",
        params: filters,
        credentials: "include" as const,
      }),
      providesTags: ["Admin"],
    }),

    createAdmin: builder.mutation({
      query: (data: AdminFormData) => ({
        url: "/admin/admin-user/create",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: ["Admin"],
    }),

    updateAdmin: builder.mutation({
      query: ({ id, ...data }: { id: string } & Partial<AdminFormData>) => ({
        url: `/admin/admin-user/${id}/details`,
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: ["Admin"],
    }),

    updateAdminPermissions: builder.mutation({
      query: ({
        id,
        permissions,
      }: {
        id: string;
        permissions: Admin["permissions"];
      }) => ({
        url: `/admin/${id}/permissions`,
        method: "PUT",
        body: { permissions },
        credentials: "include" as const,
      }),
      invalidatesTags: ["Admin"],
    }),

    // Soft delete admin (archive)
    softDeleteAdmin: builder.mutation({
      query: (id: string) => ({
        url: `/admin/admin-user/${id}/archive`,
        method: "DELETE",
        credentials: "include" as const,
      }),
      invalidatesTags: ["Admin"],
    }),

    // Restore archived admin
    restoreAdmin: builder.mutation({
      query: (id: string) => ({
        url: `/admin/admin-user/${id}/restore`,
        method: "PUT",
        credentials: "include" as const,
      }),
      invalidatesTags: ["Admin"],
    }),

    // Permanently delete admin
    permanentlyDeleteAdmin: builder.mutation<
      void,
      { id: string; confirmDelete: string }
    >({
      query: ({ id, confirmDelete }) => ({
        url: `/admin/admin-user/${id}/permanent`,
        method: "DELETE",
        body: { confirmDelete },
        credentials: "include" as const,
      }),
      invalidatesTags: ["Admin"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAdminsListQuery,
  useCreateAdminMutation,
  useUpdateAdminMutation,
  useUpdateAdminPermissionsMutation,
  useSoftDeleteAdminMutation,
  useRestoreAdminMutation,
  usePermanentlyDeleteAdminMutation,
} = adminApi;
