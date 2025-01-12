import React, { FC } from "react";
import { InfinitySpin, RotatingLines } from "react-loader-spinner";

type Props = {};

const InfinityLoader = (props: Props) => {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <InfinitySpin
        width="200"
        color="#4fa94d"
      />
    </div>
  );
};

type LoaderProps = {
  color?: string;
};

export const Loader: FC<LoaderProps> = ({ color = "black" }) => {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <RotatingLines
        visible={true}
        width="24"
        strokeColor={color}
        strokeWidth="5"
        animationDuration="0.75"
      />
    </div>
  );
};

export default InfinityLoader;
