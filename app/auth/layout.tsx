"use client";
import Image from "next/image";
import { redirect } from "next/navigation";
import React, { FC } from "react";
import SideImage from "@/public/assets/images/Side Image.png";
import { useLoadUserQuery } from "@/redux/api/apiSlice";
import InfinityLoader from "@/components/ui/loader";
import { useAppSelector } from "@/redux/hooks";

type Props = {
  children: React.ReactNode;
};

const AuthLayout: FC<Props> = ({ children }) => {
  const { user } = useAppSelector((state) => state.auth);

  if (user) return redirect("/");
  else
    return (
      <div className="w-full md:w-3/4 h-[550px] m-auto my-8 bg-white border border-slate-200 flex justify-center">
        <div className="h-full flex-1 hidden lg:flex">
          <Image
            src={SideImage}
            alt="Side Image"
            width={800}
            height={800}
            className="w-full h-full"
          />
        </div>
        <div className="flex-1 flex flex-col justify-between px-2 py-5">
          {children}
        </div>
      </div>
    );
};
export default AuthLayout;
