"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import TooltipContainer from "@/components/ui/TooltipContainer";
import { nameInitials } from "@/lib/utils";
import LogoIcon from "@/public/assets/icons/logo.png";
import Logo from "@/public/assets/icons/logo.svg";
import { useLogoutMutation } from "@/redux/auth/authApi";
import { useAppSelector } from "@/redux/hooks";
import {
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  PackageSearch,
  Settings,
  Shirt,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { FC, useEffect, useState } from "react";
import { toast } from "sonner";
import { Menu } from "lucide-react";

type IMenuItem = {
  title: string;
  link?: string;
  icon?: React.ReactNode;
  subMenu?: IMenuItem[];
};
const menu: IMenuItem[] = [
  { title: "Dashboard", icon: <LayoutDashboard />, link: "/admin/dashboard" },
  { title: "Users", icon: <User />, link: "/admin/users" },
  {
    title: "Products",
    icon: <Shirt />,
    subMenu: [
      { title: "All Products", link: "/admin/products" },
      { title: "Add Product", link: "/admin/products/add" },
    ],
  },
  { title: "Orders", icon: <PackageSearch />, link: "/admin/orders" },
  { title: "Settings", icon: <Settings />, link: "/admin/settings" },
];

type Props = {};

const AdminSidebar: FC<Props> = ({}) => {
  const router = useRouter();
  const { user, sidebar } = useAppSelector((state) => ({
    user: state.auth.user,
    sidebar: state.adminSettings.sidebar,
  }));

  const [logout, { isSuccess, error, isLoading, data }] = useLogoutMutation();

  useEffect(() => {
    if (isSuccess) toast.success("Logged out successfully");

    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
      } else {
        toast.error("An error occured: ", error as any);
      }
    }
  }, [isSuccess, error]);

  return (
    <>
      <div
        className={`${
          !sidebar ? "w-72" : "w-20"
        } border hidden md:block relative duration-300`}
      >
        <div className="flex items-center h-[8vh] px-2.5 border-b">
          <Link
            href="/"
            passHref
            className="w-10 h-10 flex items-center"
          >
            <Image
              src={LogoIcon}
              alt="Logo"
              width={150}
              height={150}
              className={`w-full h-full`}
            />
            <p
              className={`text-2xl lg:text-3xl ml-2.5 duration-500 font-bold font-josefin ${
                !sidebar ? "" : "scale-0"
              }`}
            >
              Logoipsum
            </p>
          </Link>
        </div>

        <div>
          {menu.map((item: IMenuItem, index) => (
            <MenuItem
              key={index}
              item={item}
              sidebar={sidebar}
            />
          ))}
        </div>

        {/* <div className="my-2.5">
          {menu.map((item, index) => (
            <div key={index}>
              {item.subMenu ? (
                <Collapsible className="">
                  <CollapsibleTrigger className="flex items-center p-2.5 hover:bg-gray-100 w-full">
                    <div className="ml-2.5">{item.icon}</div>
                    <p
                      className={`${
                        !sidebar ? "ml-2.5" : "scale-0"
                      } duration-500 w-full flex items-center justify-between`}
                    >
                      {item.title}
                      <ChevronDown />
                    </p>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    {item.subMenu.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        href={subItem.link || "#"}
                        className="flex items-center p-2.5 pl-10 hover:bg-gray-100"
                      >
                        {subItem.icon ? (
                          <div className="ml-2.5">{subItem.icon}</div>
                        ) : null}
                        <p
                          className={`${
                            !sidebar ? "ml-2.5" : "scale-0"
                          } duration-500`}
                        >
                          {subItem.title}
                        </p>
                      </Link>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <TooltipContainer content={item.title}>
                  <Link
                    href={item.link ? item.link : "/"}
                    className={`w-full flex items-center p-2.5 duration-300 hover:bg-gray-100 `}
                  >
                    <div className="ml-2.5">{item.icon}</div>
                    <p
                      className={`${
                        !sidebar ? "ml-2.5" : "scale-0"
                      } duration-500`}
                    >
                      {item.title}
                    </p>
                  </Link>
                </TooltipContainer>
              )}
            </div>
          ))}
        </div> */}

        <div className="absolute bottom-0 w-full border-t">
          <ul className="my-2.5">
            <li className="flex items-center">
              <button
                className={`w-full flex items-center p-2.5 duration-300 hover:bg-gray-100 `}
                onClick={() => {
                  logout({});
                  router.push("/");
                }}
              >
                <div className="ml-2.5">
                  <LogOut />
                </div>
                <p
                  className={`${!sidebar ? "ml-2.5" : "scale-0"} duration-500`}
                >
                  Logout
                </p>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

interface MenuItemProps {
  item: IMenuItem;
  sidebar: boolean;
}
const MenuItem: React.FC<MenuItemProps> = ({ item, sidebar }) => {
  return (
    <Collapsible className="">
      <CollapsibleTrigger
        asChild
        className={``}
      >
        {item?.subMenu?.length ? (
          <div className="flex items-center justify-between duration-300 hover:bg-gray-100 p-2.5 cursor-pointer">
            <div className={`w-full flex items-center`}>
              <div className="ml-2.5">{item.icon}</div>
              <p className={`${!sidebar ? "ml-2.5" : "scale-0"} duration-500`}>
                {item.title}
              </p>
            </div>
            {item?.subMenu?.length ? <ChevronDown size={20} /> : null}
          </div>
        ) : (
          <div>
            <Link
              href={item.link ? item.link : "/"}
              className={`w-full flex items-center p-2.5 duration-300 hover:bg-gray-100`}
            >
              <div className="ml-2.5">{item.icon}</div>
              <p className={`${!sidebar ? "ml-2.5" : "scale-0"} duration-500`}>
                {item.title}
              </p>
            </Link>
          </div>
        )}
      </CollapsibleTrigger>
      {item?.subMenu?.length ? (
        <CollapsibleContent className="mx-2">
          {/* Render children recursively */}
          {item?.subMenu?.map((child: IMenuItem, index) => (
            <MenuItem
              key={index}
              item={child}
              sidebar={sidebar}
            />
          ))}
        </CollapsibleContent>
      ) : null}
    </Collapsible>
  );
};
export default AdminSidebar;
