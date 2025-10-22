"use client";

import React, { FC, useEffect, useState } from "react";
import SideImage from "@/public/assets/images/Side Image.png";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Register from "./Register";
import Login from "./Login";
import { useSearchParams } from "next/navigation";
import OTPSection from "./OTPSection";
import Link from "next/link";
import ForgetPassword from "./ForgetPassword";

type Props = {
  type?: "login" | "register" | "forgot-password" | "otp";
};

const AuthSection: FC<Props> = ({ type = "login" }) => {
  return (
    <div className="flex-1 flex flex-col justify-between px-2 py-10">
      <div>
        {type === "login" ? (
          <Login />
        ) : type === "register" ? (
          <Register />
        ) : type === "otp" ? (
          <OTPSection />
        ) : type === "forgot-password" ? (
          <ForgetPassword />
        ) : null}
      </div>

      {type === "otp" || type === "forgot-password" ? null : (
        <div className="">
          <p className="text-center text-sm text-slate-400">
            {type === "register" ? (
              <span>
                Already have an account?{" "}
                <Link href="/account/login">
                  <span className="text-primary font-medium">Login</span>
                </Link>
              </span>
            ) : (
              <span>
                Don't have an account?{" "}
                <Link href="/account/register">
                  <span className="text-primary font-medium">Register</span>
                </Link>
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default AuthSection;
