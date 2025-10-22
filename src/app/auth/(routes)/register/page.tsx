import { Metadata } from "next";
import { FC } from "react";
import Register from "../../_components/Register";

type Props = {};

export const metadata: Metadata = {
  title: "Register | UrbanStore",
  description: "Register to your account",
};

const RegisterPage: FC<Props> = ({}) => {
  return <Register />;
};

export default RegisterPage;
