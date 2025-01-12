"use client";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import React, { FC } from "react";
import {
  NextButton,
  PrevButton,
  usePrevNextButtons,
} from "./EmblaCarouselArrowButtons";
import { DotButton, useDotButton } from "./EmblaCarouselDotButton";
import { Dot } from "lucide-react";
import ProductCard from "./ProductCard";

type Props = {
  slides: number[];
  options?: EmblaOptionsType;
};

const HomepageProductSlider: FC<Props> = (props) => {
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  return (
    <>
      <section className="embla">
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

        <div
          className="embla__viewport"
          ref={emblaRef}
        >
          <div className="embla__container">
            {slides.map((index) => (
              <div
                className="embla__slide"
                key={index}
              >
                <div className="embla__slide__number">
                  <ProductCard data={""} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HomepageProductSlider;
