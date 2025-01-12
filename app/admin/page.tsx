"use client";

import { Button } from "@/components/ui/button";
import { switchSidebar } from "@/redux/admin/adminSettingSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import React from "react";
import AdminHeader from "./_components/AdminHeader";

type Props = {};

const AdminPage = (props: Props) => {
  const dispatch = useAppDispatch();
  const { user, sidebar } = useAppSelector((state) => ({
    user: state.auth.user,
    sidebar: state.adminSettings.sidebar,
  }));

  return <div className=""></div>;
};

export default AdminPage;
