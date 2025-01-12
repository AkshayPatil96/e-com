"use client";

import React, { FC } from "react";
import BannerSection from "./BannerSection";
import { useGetfeaturedCategoriesQuery } from "@/redux/category/categoryApi";
import { Loader } from "./ui/loader";

type Props = {};

const HomeBannersContainer: FC<Props> = ({}) => {
  const {
    data: categoryData,
    isLoading: categoryLoading,
    isSuccess: categorySuccess,
    isError: categoryError,
  } = useGetfeaturedCategoriesQuery({ isFeatured: true });

  return (
    <div className="flex flex-col gap-20 mt-10">
      <div className="">
        <BannerSection
          category="Today's Special"
          title="Flash Sale"
          slider
          data={[1, 2, 3, 4, 5]}
          type="product"
        />
      </div>

      <div className="">
        {categoryLoading ? (
          <Loader />
        ) : categoryData?.success && categorySuccess ? (
          <BannerSection
            category="Categories"
            title="Browse by Category"
            type="category"
            slider
            data={categoryData?.data?.categories}
          />
        ) : null}
      </div>

      <div className="">
        <BannerSection
          category="This Month"
          title="Best Selling Products"
          type="product"
          link="/products"
          slider
          data={[1, 2, 3]}
        />
      </div>

      <div className="">
        <BannerSection
          category="Featured"
          title="New Arrivals"
          type="product"
          link="/products"
          slider
          data={[1, 2, 3, 4, 5, 6]}
        />
      </div>

      <div className="">
        <BannerSection
          // category="Today's Special"
          title="Recently Viewed"
          type="product"
          slider
          link="/products"
          data={[1, 2]}
        />
      </div>
    </div>
  );
};

export default HomeBannersContainer;
