/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { usePermissions } from "@/hooks/usePermissions";
import { adminHeadersHeight } from "@/lib/utils";
import { useLogoutMutation } from "@/redux/auth/authApi";
import {
  ChevronDown,
  CircleChevronRightIcon,
  LayoutDashboardIcon,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import {
  filterMenuByPermissions,
  ISidebarMenuItem,
  sidebarMenu,
} from "./sidebarData";

const AdminSidebar = () => {
  const router = useRouter();
  const { open, setOpen } = useSidebar();
  const { permissions, isSuperAdmin, isAuthenticated } = usePermissions();

  const [logout, { isSuccess, error }] = useLogoutMutation();

  // Filter menu items based on user permissions
  const filteredMenu = useMemo(() => {
    return filterMenuByPermissions(sidebarMenu, permissions, isSuperAdmin);
  }, [permissions, isSuperAdmin]);

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

  // Don't render sidebar if user is not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Show loading state if permissions are still loading
  if (!permissions && isAuthenticated) {
    return (
      <Sidebar collapsible="icon">
        <SidebarHeader
          className="flex items-center justify-center border-b transition duration-300 relative"
          style={{ height: `${adminHeadersHeight}px` }}
        >
          <div className="text-sm text-muted-foreground">Loading...</div>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <div className="text-center text-sm text-muted-foreground">
            Loading permissions...
          </div>
        </SidebarContent>
      </Sidebar>
    );
  }

  return (
    <>
      <Sidebar collapsible="icon" className="bg-white!">
        <SidebarHeader
          className="flex items-center justify-center border-b transition duration-300 relative bg-white!"
          style={{ height: `${adminHeadersHeight}px` }}
        >
          <SidebarMenu className="">
            <SidebarMenuItem className="flex items-center justify-between gap-2">
              {open ? (
                <SidebarMenuButton
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-2 p-2`}
                >
                  <LayoutDashboardIcon className={`${open && "size-6"}`} />
                  <span
                    className={`text-lg text-title/75 font-medium ${
                      !open && "hidden"
                    }`}
                  >
                    Logoipsum
                  </span>
                </SidebarMenuButton>
              ) : (
                <SidebarMenuButton>
                  <CircleChevronRightIcon
                    onClick={() => setOpen(true)}
                    className={`size-6`}
                  />
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent className="p-2 bg-white!">
          <SidebarMenu>
            {filteredMenu.map((item: ISidebarMenuItem, index) => {
              return item?.subMenu ? (
                <Collapsible key={`${Math.random()}-collapsible-${index}`}>
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        className=""
                        tooltip={item.title}
                      >
                        {item.icon}
                        {item.title}
                        <ChevronDown className="ml-auto transition-transform duration-300 group-data-[state=open]/collapsible:rotate-180" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        <SidebarMenuSubItem>
                          {item?.subMenu
                            ?.filter((sub) => {
                              // Additional client-side filtering if needed
                              // The filterMenuByPermissions already handles this, but this is for extra safety
                              return sub.link; // Only show items with valid links
                            })
                            .map((sub) => (
                              <SidebarMenuButton
                                asChild
                                key={sub.title}
                                className=""
                                tooltip={sub.title}
                              >
                                <Link
                                  href={sub.link || "#"}
                                  className="flex w-full"
                                >
                                  {sub.title}
                                </Link>
                              </SidebarMenuButton>
                            ))}
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem key={`${Math.random()}-menuitem-${index}`}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                  >
                    <Link
                      href={item.link || "#"}
                      className="flex w-full"
                    >
                      {item.icon}
                      {item.title}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>

        <Separator />

        <SidebarFooter className="bg-white!">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={async () => {
                  await logout().unwrap();
                  router.push("/");
                }}
              >
                <LogOut />
                Logout
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </>
  );
};

export default AdminSidebar;
