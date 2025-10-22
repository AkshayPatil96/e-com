import { apiSlice } from "../api/apiSlice";

export const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    nestedCategories: builder.query({
      query: () => ({
        url: "/category/nested",
        method: "GET",
        credentials: "include" as const,
      }),
      keepUnusedDataFor: 60 * 60, // 1 hour
      // async onQueryStarted(arg, { dispatch, queryFulfilled }) {
      //   try {
      //     const result = await queryFulfilled;
      //     dispatch(setNestedCategory({ data: result.data.data }));
      //   } catch (error: any) {
      //     console.log("error: ", error);
      //   }
      // },
    }),
    getfeaturedCategories: builder.query({
      query: (query) => ({
        url: "/category",
        method: "GET",
        params: { ...query },
        credentials: "include" as const,
      }),
      keepUnusedDataFor: 60 * 60, // 1 hour
    }),
  }),
  // @ts-ignore
  overrideExisting: true,
});

export const { useNestedCategoriesQuery, useGetfeaturedCategoriesQuery } =
  productApi;
