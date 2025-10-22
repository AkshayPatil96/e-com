import { redirect } from "next/navigation";
import React from "react";

type Props = {};

const AuthPage = (props: Props) => {
  return redirect("/auth/login");
};

export default AuthPage;
