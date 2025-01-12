import Image from "next/image";
import React, { FC } from "react";
import Product1 from "@/public/assets/images/product-1.png";
import { Heart, ShoppingCart } from "lucide-react";
import { Rating, ThinRoundedStar } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { Button } from "./ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import Link from "next/link";
import TooltipContainer from "./ui/TooltipContainer";

type Props = {
  data: any;
};

const customStyles = {
  itemShapes: ThinRoundedStar,
  activeFillColor: "#FFAD33",
  inactiveFillColor: "#BFBFBF",
};

const ProductCard: FC<Props> = ({ data }) => {
  return (
    <div className="w-[270px] product-card overflow-hidden border border-[#EFEFEF] group bg-white">
      <div className="relative image-div overflow-hidden">
        <Image
          src={Product1}
          width={270}
          height={250}
          alt="product"
          className="w-full h-[250px] object-contain bg-[#F8FAFC] p-4 rounded-md transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-2 top-2 py-1 text-xs px-2 rounded-md text-white bg-[#DB4444]">
          -40%
        </span>

        <HoverCard>
          <HoverCardTrigger asChild>
            <button className="absolute right-2 top-2 p-1.5 rounded-full text-xs bg-white cursor-pointer">
              <Heart
                className="text-[#DB4444]"
                size={20}
              />
            </button>
          </HoverCardTrigger>
          <HoverCardContent className="w-48" align="end">
            <div className="flex justify-between space-x-4">
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">@nextjs</h4>
                <div className="flex items-center pt-2">
                  <span className="text-xs text-muted-foreground">
                    Joined December 2021
                  </span>
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>

        <Button className="cart-btn bg-black opacity-50 hover:opacity-100 text-white rounded-none w-full absolute bottom-0 left-0 translate-y-full transition duration-500 group-hover:translate-y-0">
          <ShoppingCart className="" />
          <span>Add To Cart</span>
        </Button>
      </div>

      <div className="px-1.5 py-2 flex flex-col gap-1">
        <TooltipContainer content={"HAVIT HV-G92 Gamepad"}>
          <Link
            href={`/#`}
            className="font-medium text-left line-clamp-1 hover:text-primary"
          >
            HAVIT HV-G92 Gamepad
          </Link>
        </TooltipContainer>

        <div className="flex items-center gap-x-2 text-sm flex-wrap">
          <div className="flex items-center gap-2 text-sm">
            <p className="text-[#DA4445] font-medium">$120</p>
            <p className="text-[#808080] font-medium line-through">$160</p>
          </div>
          <div className="">
            <span className="text-[#808080] text-xs mt-1 font-medium flex items-center">
              <Rating
                readOnly
                items={1}
                style={{ width: "15px" }}
                value={2.25}
                itemStyles={customStyles}
              />
              4.5 (95 Reviews)
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1 transition duration-500 p-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            {["black", "white", "#00aeff"].map((color) => (
              <div
                key={color}
                className={`outline outline-offset-2 outline-1 outline-cyan-500 rounded-full w-5 h-5`}
                style={{ backgroundColor: color }}
              />
            ))}

            <Link
              href={`/`}
              className="text-xs text-primary-foreground font-medium hover:underline hover:underline-offset-2"
            >
              + view more
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
