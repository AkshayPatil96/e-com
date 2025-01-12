"use client";

import { ICategory } from "@/@types/category.types";
import BannerSection from "@/components/BannerSection";
import { Loader } from "@/components/ui/loader";
import React, { FC, useState } from "react";

type Props = {
  categories: ICategory[];
};

const CategoryContainer: FC<Props> = ({ categories }) => {
  console.log("categories: ", categories);

  return (
    <div>
      <div className="">
        {/* <Loader /> */}
        {categories?.length ? (
          <BannerSection
            // category="Categories"
            title="Categories"
            type="category"
            slider
            data={categories}
          />
        ) : null}
      </div>
    </div>
  );
};

export default CategoryContainer;
