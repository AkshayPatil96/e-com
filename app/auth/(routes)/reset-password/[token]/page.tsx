import React, { FC } from "react";
import { GetServerSideProps } from "next";
import { redirect } from "next/navigation";
import ResetPassword from "../../../_components/ResetPassword";

type Props = {
  params: {
    token: string;
  };
};

const ResetPasswordPage: FC<Props> = async ({ params }) => {
  let { token } = await params;
  return params?.token ? (
    <div>
      <ResetPassword resetToken={token} />
    </div>
  ) : (
    redirect("/auth/login")
  );
};

export default ResetPasswordPage;
