"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { nameInitials } from "@/lib/utils";
import { useLoadUserQuery } from "@/redux/user/userApi";
import React from "react";

const sidebarData = [
  { name: "Profile", href: "/account" },
  { name: "Orders", href: "/account/orders" },
  { name: "Settings", href: "/account/settings" },
];

const AccountSidebar = () => {
  const { data: { data: user } = {} } = useLoadUserQuery();

  return (
    <>
      <div className="hidden md:flex w-64 border-r border-gray-200">
        <div className="flex flex-col w-full pt-2 gap-2">
          {/* Create a profile tab (pic + name) */}
          <div className="flex items-center px-2 gap-x-2">
            <Avatar className="w-12 h-12">
              <AvatarImage
                src={user?.profileImage?.url}
                alt={user?.profileImage?.alt}
              />
              <AvatarFallback className="font-medium bg-slate-500 text-white text-lg">
                {nameInitials(
                  user?.name || `${user?.firstName} ${user?.lastName}`,
                )}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-md font-semibold text-gray-900">
                {user?.name || `${user?.firstName} ${user?.lastName}`}
              </h1>
              <p className="text-sm text-placeholder capitalize break-all">
                {user?.role}
              </p>
            </div>
          </div>

          <Separator />

          {sidebarData.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="block p-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              {item.name}
            </a>
          ))}
        </div>
      </div>
    </>
  );
};

export default AccountSidebar;
