"use client";
import InfinityLoader, { Loader } from "@/components/ui/loader";
import { useLoadUserQuery } from "@/redux/api/apiSlice";
import { useAppSelector } from "@/redux/hooks";
import { redirect, usePathname } from "next/navigation";
import React, { FC } from "react";

type Props = {
  children: React.ReactNode;
};

const ProfileLayout: FC<Props> = ({ children }) => {
  const { user } = useAppSelector((state) => state.auth);

  if (user) return <div>{children}</div>;
  else return redirect("/auth/login");
};
export default ProfileLayout;
