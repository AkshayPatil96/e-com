"use client";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import { headersHeight } from "@/lib/utils";
import { useAppSelector } from "@/redux/hooks";
import { redirect, usePathname } from "next/navigation";
import React, { FC } from "react";
import AccountSidebar from "./_components/accountSidebar";
import ClientAuthRedirect from "./clientAuthRedirect";

type Props = {
  children: React.ReactNode;
};

const ProfileLayout: FC<Props> = ({ children }) => {
  const { user } = useAppSelector((state) => state.auth);

  if (user)
    return (
      <ClientAuthRedirect>
        <Header />
        <div className="container ">
          <div
            className="flex my-4 border border-border rounded-lg overflow-hidden bg-white"
            style={{
              minHeight: `calc(100vh - ${headersHeight}px - 4rem)`,
            }}
          >
            <AccountSidebar />
            {children}
          </div>
        </div>
        <Footer />
      </ClientAuthRedirect>
    );
  else return redirect("/auth/login");
};
export default ProfileLayout;
