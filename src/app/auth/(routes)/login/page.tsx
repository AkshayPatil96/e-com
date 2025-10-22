import { Metadata } from "next";
import { FC } from "react";
import Login from "../../_components/Login";

type Props = {};

export const metadata: Metadata = {
  title: "Login | UrbanStore",
  description: "Login to your account",
};

const LoginPage: FC<Props> = ({}) => {
  return <Login />;
};

export default LoginPage;
