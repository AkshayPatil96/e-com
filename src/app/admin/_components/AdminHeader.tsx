/* eslint-disable @typescript-eslint/no-explicit-any */
import LogoIcon from "@/../public/assets/icons/logo.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { adminHeadersHeight, headersHeight, nameInitials } from "@/lib/utils";
import { switchSidebar } from "@/redux/adminDashboard/adminSettingSlice";
import { useLogoutMutation } from "@/redux/auth/authApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  ChevronDown,
  LogOutIcon,
  Menu,
  SettingsIcon,
  User2Icon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

const AdminHeader = () => {
  const router = useRouter();

  const dispatch = useAppDispatch();
  const { user, sidebar } = useAppSelector((state) => ({
    user: state.auth.user,
    sidebar: state.adminSettings.sidebar,
  }));
  const [logout, { isSuccess, error }] = useLogoutMutation();

  useEffect(() => {
    if (isSuccess) toast.success("Logged out successfully");

    if (error) {
      if (error && typeof error === "object" && "data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
      } else {
        toast.error("An error occured: ", error as any);
      }
    }
  }, [isSuccess, error]);

  return (
    <div
      className={`border-b flex items-center justify-between px-5 bg-white`}
      style={{ height: `${adminHeadersHeight}px` }}
    >
      <SidebarTrigger />
      <Link
        href="/"
        passHref
        className={`flex items-center gap-2 transition duration-300 p-2
            `}
      >
        <Image
          src={LogoIcon}
          alt="Logo"
          width={150}
          height={150}
          className={`size-6`}
        />
        <p
          className={`text-lg transition duration-300 font-semibold font-josefin`}
        >
          Logoipsum
        </p>
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger
          asChild
          className="cursor-pointer"
        >
          <div className="flex items-center">
            <Avatar className="border border-slate-200 cursor-pointer size-8 -mt-1">
              <AvatarImage
                src={user?.profileImage?.url}
                alt={user?.profileImage?.alt}
              />
              <AvatarFallback className="bg-slate-500 text-white text-xs">
                {nameInitials(user?.name)}
              </AvatarFallback>
            </Avatar>
            <div className="ml-2">
              <h3 className="text-base font-semibold">{user?.name}</h3>
              <p className="flex items-center text-xs text-slate-500 capitalize">
                {user?.role}

                <ChevronDown className="ml-1 size-4 transition-transform duration-300" />
              </p>
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-48"
        >
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Link
            href="/account/profile"
            passHref
            className="w-full"
          >
            <DropdownMenuItem>
              <User2Icon className="text-popover-foreground" />
              Profile
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem>
            <SettingsIcon className="text-popover-foreground" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={async () => {
              await logout().unwrap();
              router.push("/");
            }}
          >
            <LogOutIcon className="text-popover-foreground" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default AdminHeader;
