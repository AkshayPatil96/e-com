"use client";
import AuthHeader from "@/components/header/AuthHeader";
import { SidebarProvider } from "@/components/ui/sidebar";
import { adminHeadersHeight, headersHeight } from "@/lib/utils";
import { useAppSelector } from "@/redux/hooks";
import { redirect } from "next/navigation";
import React, { FC, useEffect, useState } from "react";
import AdminHeader from "../_components/AdminHeader";
import AdminSidebar from "../_components/AdminSidebar";

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

  // Handle unauthorized access - redirect non-admin users to homepage
  useEffect(() => {
    if (user && user?.role !== "admin" && user?.role !== "superadmin") {
      redirect("/");
    }
  }, [user]);

  // If no user is logged in, redirect to login
  if (!user) {
    redirect("/auth/login");
  }

  // If user exists but is not admin/superadmin, the useEffect will handle redirect
  if (user && user?.role !== "admin" && user?.role !== "superadmin") {
    return null; // Will redirect via useEffect
  }

  if (!visible) {
    return (
      <main className="">
        <div className="min-h-screen">
          <AuthHeader />
          <div
            className="flex items-center justify-center"
            style={{ minHeight: `calc(100vh - ${adminHeadersHeight}px)` }}
          >
            <h1 className="text-3xl text-center">
              This page is not supported on mobile devices.
            </h1>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="flex">
      <SidebarProvider>
        <AdminSidebar />

        <main className="w-full border-r">
          <AdminHeader />
          <div
            className=""
            style={{ minHeight: `calc(100vh - ${adminHeadersHeight}px)` }}
          >
            {children}
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
};

export default AdminLayout;
