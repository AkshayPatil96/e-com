import { Metadata } from "next";
import { FC } from "react";
import ForgetPassword from "../../_components/ForgetPassword";

type Props = {};

export const metadata: Metadata = {
  title: "OTP | UrbanStore",
  description: "Enter your OTP",
};

const ForgetPasswordPage: FC<Props> = ({}) => {
  return <ForgetPassword />;
};

export default ForgetPasswordPage;
