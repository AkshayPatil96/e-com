import { ICategory } from "@/@types/category.types";
import React, { FC } from "react";
import PhoneImg from "@/public/assets/images/mobile.png";
import Image from "next/image";
import Link from "next/link";
import TooltipContainer from "./ui/TooltipContainer";

type Props = {
  data?: ICategory;
};

const CategoryCard: FC<Props> = ({ data }) => {
  let link = data?.ancestors?.length
    ? `/category/${(data.ancestors as unknown as ICategory[])
        .map((cat: ICategory) => cat?.slug)
        .join("/")}/${data.slug}`
    : `/category/${data?.slug}`;

  return (
    <Link
      href={link}
      className="min-w-[150px] w-[200px] group flex flex-col items-center justify-center gap-2 border border-[#EFEFEF] bg-[#F8FAFC]"
    >
      <Image
        src={data?.images?.length ? data.images[0]?.url : PhoneImg}
        alt="phone"
        width={150}
        height={150}
        className="w-full p-2 group-hover:scale-105 transition duration-500"
      />
      <TooltipContainer
        content={data?.name}
        side="top"
      >
        <p className="font-medium text-center p-2 group-hover:text-button-2 line-clamp-1">
          {data?.name}
        </p>
      </TooltipContainer>
    </Link>
  );
};

export default CategoryCard;
