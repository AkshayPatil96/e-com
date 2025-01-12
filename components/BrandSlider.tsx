import React, { FC } from "react";
import Marquee from "react-fast-marquee";
import Image, { StaticImageData } from "next/image";

type Props = {
  images: string[] | StaticImageData[];
};

const BrandSlider: FC<Props> = ({ images }) => {
  return (
    <div className="mt-8">
      <Marquee
        gradient={false}
        speed={40}
        direction="left"
        className="flex justify-center items-center gap-"
      >
        {images.map((img, index) => (
          <Image
            key={index}
            src={img}
            alt="brand-logo"
            className="object-contain w-[150px] h-[100px] md:w-[200px] md:h-[150px]"
            width={200}
            height={100}
          />
        ))}
      </Marquee>
    </div>
  );
};

export default BrandSlider;
