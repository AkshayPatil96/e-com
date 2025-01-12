"use client";
import InfinityLoader, { Loader } from "@/components/ui/loader";
import { useLoadUserQuery } from "@/redux/api/apiSlice";
import { redirect } from "next/navigation";
import React, { FC } from "react";
import { useSelector } from "react-redux";

type Props = {
  children: React.ReactNode,
};

const ProfileLayout: FC<Props> = ({ children }) => {
  // const { isLoading, isSuccess, isError } = useLoadUserQuery({});

  // if (isLoading)
  //   return (
  //     <div className="h-[calc(100vh-8rem)]">
  //       <InfinityLoader />
  //     </div>
  //   );

  // if (isError) redirect("/account/login");

  // if (isSuccess)
  return (
    <div>
      <div className="flex flex-col w-1/4 h-full bg-gray-100">
        <div className="flex items-center justify-center h-24 bg-gray-200">
          <h1 className="text-2xl font-bold">Profile</h1>
        </div>
        <div className="flex flex-col items-center justify-center h-full">
          <div className="flex items-center justify-center w-24 h-24 bg-gray-200 rounded-full">
            <Loader color="black" />
          </div>
          <div className="flex items-center justify-center w-24 h-24 bg-gray-200 rounded-full">
            <Loader color="black" />
          </div>
          <div className="flex items-center justify-center w-24 h-24 bg-gray-200 rounded-full">
            <Loader color="black" />
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};
export default ProfileLayout;
