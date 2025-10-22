import React from "react";
// import { InfinitySpin, RotatingLines } from "react-loader-spinner";

const InfinityLoader = () => {
  return (
    <div className="h-full w-full flex items-center justify-center">
      {/* <InfinitySpin
        width="200"
        color="#4fa94d"
      /> */}
      <div className="text-center">Loading...</div>
    </div>
  );
};

type LoaderProps = {
  color?: string;
};

export const Loader = ({ color = "black" }: LoaderProps) => {
  return (
    <div className="h-full w-full flex items-center justify-center">
      {/* <RotatingLines
        visible={true}
        width="24"
        strokeColor={color}
        strokeWidth="5"
        animationDuration="0.75"
      /> */}
      <div className="text-center">Loading...</div>
    </div>
  );
};

export default InfinityLoader;
