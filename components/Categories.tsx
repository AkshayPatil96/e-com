"use client";
import { ICategory } from "@/@types/category.types";
import { useNestedCategoriesQuery } from "@/redux/category/categoryApi";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React, { FC } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { Skeleton } from "./ui/skeleton";

type Props = {};

const Categories: FC<Props> = ({}) => {
  const { data, isLoading, isSuccess, isError } = useNestedCategoriesQuery({});

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 items-center p-2">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
      </div>
    );
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <>
      <div className="overflow-y-auto custom-scrollbar h-[40vh] mr-2">
        {data?.data?.map((category: ICategory) => (
          <CategoryItem
            key={category._id}
            category={category}
          />
        ))}
      </div>
    </>
  );
};

interface CategoryProps {
  category: ICategory;
}
const CategoryItem: React.FC<CategoryProps> = ({ category }) => {
  let link = category?.ancestors?.length
    ? `/category/${(category.ancestors as unknown as ICategory[])
        .map((cat: ICategory) => cat?.slug)
        .join("/")}/${category.slug}`
    : `/category/${category.slug}`;

  return (
    <Collapsible className="">
      <CollapsibleTrigger
        asChild
        className={`w-full flex items-center justify-between px-2 py-2 border-b text-sm hover:bg-input-bg font-medium`}
      >
        <div>
          <Link
            href={link}
            passHref
            className={`flex items-center gap-2 ${
              !category?.children?.length ? "w-full" : ""
            } hover:text-primary`}
          >
            {category.name}
          </Link>
          {category?.children?.length ? <ChevronRight size={16} /> : null}
        </div>
      </CollapsibleTrigger>
      {category?.children?.length ? (
        <CollapsibleContent className="mx-2">
          {/* Render children recursively */}
          {category?.children?.map((child: ICategory) => (
            <CategoryItem
              key={child._id}
              category={child}
            />
          ))}
        </CollapsibleContent>
      ) : null}
    </Collapsible>
  );
};

export default Categories;
