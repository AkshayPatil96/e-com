import { GetServerSideProps, Metadata } from "next";
import { redirect } from "next/navigation";
import React, { FC } from "react";
import ResetPassword from "../../../_components/ResetPassword";

type Props = {
  params: {
    token: string;
  };
};

export const metadata: Metadata = {
  title: "Reset Password | E-Com",
  description: "Reset your account password",
};

const ResetPasswordPage: FC<Props> = async ({ params }) => {
  const { token } = await params;
  return params?.token ? (
    <div>
      <ResetPassword resetToken={token} />
    </div>
  ) : (
    redirect("/auth/login")
  );
};

export default ResetPasswordPage;
