import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import React, { FC } from "react";
import { NextButton, PrevButton } from "./EmblaCarouselArrowButtons";
import { Button } from "./ui/button";

type Props = {
  title: string;
  category?: string;
  slider?: boolean;
  onPrevButtonClick?: () => void;
  onNextButtonClick?: () => void;
  prevBtnDisabled?: boolean;
  nextBtnDisabled?: boolean;
  link?: string;
};

const BannerTitle: FC<Props> = ({
  title,
  category,
  slider,
  onPrevButtonClick,
  onNextButtonClick,
  prevBtnDisabled,
  nextBtnDisabled,
  link,
}) => {
  return (
    <div className="flex flex-col gap-2.5 sm:gap-5">
      {category ? (
        <h3 className="text-[#DB4444] flex items-center gap-4 text-lg before:w-4 before:h-8 before:bg-[#DB4444] before:rounded-sm before:p-1 before:border before:border-red-500">
          {category}
        </h3>
      ) : null}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <h2 className="text-2xl md:text-4xl">{title}</h2>
        <div className="flex items-center gap-2 justify-between">
          {slider ? (
            <div className="flex items-center gap-4 justify-end">
              <div className="`embla__controls`">
                <div className="embla__buttons">
                  <PrevButton
                    onClick={onPrevButtonClick}
                    disabled={prevBtnDisabled}
                  />
                  <NextButton
                    onClick={onNextButtonClick}
                    disabled={nextBtnDisabled}
                  />
                </div>
              </div>
            </div>
          ) : null}
          {link ? (
            <Link
              href={link}
              className="text-sm bg-button-2 text-white px-4 py-2 rounded-sm"
            >
              View all
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default BannerTitle;
