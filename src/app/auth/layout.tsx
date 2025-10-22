import SideImage from "@/../public/assets/images/Side Image.png";
import AuthFooter from "@/components/footer/AuthFooter";
import AuthHeader from "@/components/header/AuthHeader";
import { useAppSelector } from "@/redux/hooks";
import Image from "next/image";
import { redirect } from "next/navigation";
import React, { FC } from "react";
import ClientAuthRedirect from "./clientAuthRedirect";

type Props = {
  children: React.ReactNode;
};

const AuthLayout: FC<Props> = ({ children }) => {
  return (
    <ClientAuthRedirect>
      <div className="flex flex-col min-h-screen justify-between">
        <AuthHeader />

        <div className="w-full md:w-3/4 m-auto my-12 bg-white flex justify-center items-center rounded-lg overflow-hidden md:border md:border-border/50 md:shadow-lg">
          <div className="h-full flex-1 hidden lg:flex items-center justify-center">
            <Image
              src={SideImage}
              alt="Side Image"
              width={800}
              height={800}
              className="w-full h-full"
            />
          </div>

          <div className="flex-1 flex justify-center items-center px-2 py-8">
            {children}
          </div>
        </div>

        <AuthFooter />
      </div>
    </ClientAuthRedirect>
  );
};
export default AuthLayout;
