import BrandSlider from "@/components/BrandSlider";
import HeroBanner from "@/components/HeroBanner";
import { brandImagesArray } from "@/components/images";
import React, { FC } from "react";
import CategoryContainer from "../_components/CategoryContainer";
import { get } from "@/utils/ApiService";
import { Metadata, ResolvingMetadata } from "next";

interface CategoryError {
  message: string;
  code?: number;
}

const getCategory = async (slug: string) => {
  try {
    const response = await get(`/category/${slug}`);

    if (!response.success) {
      console.log("API Error:", {
        message: response.error,
        status: response.status,
      });
      return null;
    }

    return response.data;
  } catch (error) {
    const err = error as CategoryError;
    console.log("Failed to fetch category:", {
      message: err.message,
      code: err.code,
    });
    return null;
  }
};

interface CategoryData {
  data?: {
    metadata?: {
      title?: string;
      description?: string;
      keywords?: string;
    };
    images?: string[];
  };
}

type Props = {
  params: Promise<{ slug?: string[] }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  // Await params first
  const resolvedParams = await params;
  const slugString = resolvedParams?.slug?.length
    ? resolvedParams.slug[resolvedParams.slug.length - 1]
    : "";

  const [data, parentMetadata] = await Promise.all([
    getCategory(slugString),
    parent,
  ]);

  const previousImages = parentMetadata.openGraph?.images || [];
  const title = data?.data?.metadata?.title || "Category";
  const description = data?.data?.metadata?.description || "";
  const keywords = data?.data?.metadata?.keywords || "";
  const images = data?.data?.images || [];

  return {
    title,
    description,
    keywords,
    openGraph: {
      images: [...images, ...previousImages],
    },
  };
}

const CategoryPage = async ({ params }: Props) => {
  // Await params first
  const resolvedParams = await params;
  const slugString = resolvedParams?.slug?.length
    ? resolvedParams.slug[resolvedParams.slug.length - 1]
    : "";

  try {
    const category = await getCategory(slugString);

    if (!category) {
      return (
        <div className="container">
          <p>Failed to load category</p>
        </div>
      );
    }

    return (
      <div className="mb-8">
        <div className="container">
          <div className="h-full col-span-12 md:col-span-9 p-0 md:py-4 pt-4">
            <HeroBanner />
          </div>
        </div>

        <BrandSlider images={brandImagesArray} />

        <div className="container py-8">
          <CategoryContainer categories={category?.data?.children} />
        </div>
      </div>
    );
  } catch (error) {
    console.log("Page Error:", error);
    return (
      <div className="container">
        <p>Something went wrong</p>
      </div>
    );
  }
};

export default CategoryPage;
