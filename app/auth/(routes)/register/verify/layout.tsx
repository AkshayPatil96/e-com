"use client";
import { redirect } from "next/navigation";
import React, { FC } from "react";
import { useSelector } from "react-redux";

type Props = {
  children: React.ReactNode;
};

const VerifyLayout: FC<Props> = ({ children }) => {
  const { page } = useSelector((state: any) => ({
    page: state.auth.page,
  }));
  return page === "verify" ? children : redirect("/auth/register");
};

export default VerifyLayout;
