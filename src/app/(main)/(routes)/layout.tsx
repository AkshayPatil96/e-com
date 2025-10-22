import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import React, { FC, ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const MainLayout: FC<Props> = ({ children }) => {
  return (
    <div className="">
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default MainLayout;
