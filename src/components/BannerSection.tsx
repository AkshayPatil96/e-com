/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { FC, ReactNode } from "react";
import BannerTitle from "./BannerTitle";
import { usePrevNextButtons } from "./EmblaCarouselArrowButtons";
import { useDotButton } from "./EmblaCarouselDotButton";
import useEmblaCarousel from "embla-carousel-react";
import { EmblaOptionsType } from "embla-carousel";
import HomepageProductSlider from "./EmblaSlider";
import ProductCard from "./ProductCard";
import CategoryCard from "./CategoryCard";
import { ICategory } from "@/@types/category.types";
import { IProduct } from "@/@types/product.types";

type Props = {
  category?: string;
  title: string;
  slider?: boolean;
  options?: EmblaOptionsType;
  type: "product" | "category";
  data?: any[];
  link?: string;
};

const BannerSection: FC<Props> = ({
  category,
  title,
  options,
  slider = false,
  data = [],
  type,
  link,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    ...options,
  });

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  const mapData = (item: IProduct | ICategory) => {
    return type === "category" ? (
      <CategoryCard data={item as ICategory} />
    ) : type === "product" ? (
      <ProductCard data={item as IProduct} />
    ) : null;
  };

  return slider ? (
    <>
      <section className="embla homebanners">
        <BannerTitle
          title={title}
          category={category}
          slider={slider}
          link={link}
          onPrevButtonClick={onPrevButtonClick}
          onNextButtonClick={onNextButtonClick}
          prevBtnDisabled={prevBtnDisabled}
          nextBtnDisabled={nextBtnDisabled}
        />

        <div
          className="embla__viewport mt-2 ml-2"
          ref={emblaRef}
        >
          <div className="embla__container">
            {data.map((item: IProduct | ICategory, index) => (
              <div
                className={`embla__slide ${
                  type === "product"
                    ? "!flex-[0_0_calc(100%_/_1)] sm:!flex-[0_0_calc(100%_/_2)] md:!flex-[0_0_calc(100%_/_3)] lg:!flex-[0_0_calc(100%_/_4)]"
                    : "!flex-[0_0_calc(100%_/_2)] sm:!flex-[0_0_calc(100%_/_3)] md:!flex-[0_0_calc(100%_/_4)] lg:!flex-[0_0_calc(100%_/_6)]"
                }`}
                key={index}
              >
                <div className="embla__slide__number">{mapData(item)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  ) : (
    <div>
      <BannerTitle
        title={title}
        category={category}
        slider={slider}
        link={link}
      />

      <div className="mt-6 grid grid-cols-12 gap-4">
        {data?.map((item, index) => (
          <div
            key={index}
            className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3"
          >
            {mapData(item)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BannerSection;
