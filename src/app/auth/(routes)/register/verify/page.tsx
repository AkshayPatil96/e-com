import OTPSection from "@/app/auth/_components/OTPSection";
import { Metadata } from "next";
import { FC } from "react";

type Props = {};

export const metadata: Metadata = {
  title: "OTP | UrbanStore",
  description: "Enter your OTP",
};

const VeriPage: FC<Props> = ({}) => {
  return <OTPSection />;
};

export default VeriPage;
