import BrandSlider from "@/components/BrandSlider";
import Categories from "@/components/Categories";
import HeroBanner from "@/components/HeroBanner";
import HomeBannersContainer from "@/components/HomeBannersContainer";
import { brandImagesArray } from "@/components/images";
import WebsiteDetails from "@/components/WebsiteDetails";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home | UrbanStore",
  description: "UrbanStore",
};

export default function Home() {
  return (
    <>
      <div className="container">
        <div className="lg:min-h-[25vh] grid grid-cols-12">
          <div className="hidden lg:block h-full col-span-3 py-2 border-r">
            <Categories />
          </div>
          <div className="h-full col-span-12 lg:col-span-9 p-0 lg:p-4 pt-4">
            <HeroBanner />
          </div>
        </div>
      </div>

      <BrandSlider images={brandImagesArray} />

      <div className="container">
        <HomeBannersContainer />
      </div>

      <div className="bg-white">
        <WebsiteDetails />
      </div>
    </>
  );
}
