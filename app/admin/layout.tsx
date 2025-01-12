"use client";
import { useAppSelector } from "@/redux/hooks";
import { redirect } from "next/navigation";
import React, { FC, useEffect, useState } from "react";
import AdminSidebar from "./_components/AdminSidebar";
import AdminHeader from "./_components/AdminHeader";

type Props = {
  children: React.ReactNode;
};

const AdminLayout: FC<Props> = ({ children }) => {
  const { user, sidebar } = useAppSelector((state) => ({
    user: state.auth.user,
    sidebar: state.adminSettings.sidebar,
  }));

  const [visible, setVisible] = useState(true);

  // get screen width and set sidebar visibility false if screen width is less than 768px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setVisible(false);
      } else {
        setVisible(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (!visible) {
    return (
      <main className="container">
        <div className="min-h-screen flex items-center  justify-center">
          <h1 className="text-3xl">
            This page is not supported on mobile devices.
          </h1>
        </div>
      </main>
    );
  }

  return user && (user?.role === "admin" || user?.role === "superadmin") ? (
    <div className="container flex min-h-screen">
      <AdminSidebar />
      <main className="w-full border-r">
        <AdminHeader />
        {children}
      </main>
    </div>
  ) : (
    // redirect("/")
    ""
  );
};

export default AdminLayout;
