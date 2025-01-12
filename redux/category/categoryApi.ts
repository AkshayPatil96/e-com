import { apiSlice } from "../api/apiSlice";

export const categoryApi = apiSlice.injectEndpoints({
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
    categoriesByLevel: builder.query({
      query: (level: number) => ({
        url: `/category/level/${level}`,
        method: "GET",
        credentials: "include" as const,
      }),
      keepUnusedDataFor: 60 * 60, // 1 hour
    }),
  }),
  // @ts-ignore
  overrideExisting: true,
});

export const {
  useNestedCategoriesQuery,
  useGetfeaturedCategoriesQuery,
  useCategoriesByLevelQuery,
} = categoryApi;
