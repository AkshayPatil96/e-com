/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Banner1 from "@/../public/assets/images/hero-banner/banner-1.png";
import Banner2 from "@/../public/assets/images/hero-banner/banner-2.png";
import Banner3 from "@/../public/assets/images/hero-banner/banner-3.png";
import Banner4 from "@/../public/assets/images/hero-banner/banner-4.png";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/splide/dist/css/splide.min.css";
import Image from "next/image";
import React, { FC } from "react";

type IBannerData = {
  id: number;
  image: any;
  url: string;
};

const data = [
  { id: 1, image: Banner1, url: "/" },
  { id: 2, image: Banner2, url: "/" },
  { id: 3, image: Banner3, url: "/" },
  { id: 4, image: Banner4, url: "/" },
] as IBannerData[];

const HeroBanner = () => {
  return (
    <div className="w-full h-full">
      <Splide
        options={{
          type: "slide",
          rewind: true,
          drag: true,
          snap: true,
          perPage: 1,
          gap: "1rem",
          interval: 2500,
        }}
      >
        {data?.map((li: IBannerData) => (
          <SplideSlide key={li?.id}>
            <div className="w-full md:h-[350px]">
              <Image
                src={li?.image}
                alt="banner"
                // width={1920}
                // height={250}
                // layout="responsive"
                className="w-full h-full object-fill"
              />
            </div>
          </SplideSlide>
        ))}
      </Splide>
    </div>
  );
};

export default HeroBanner;
