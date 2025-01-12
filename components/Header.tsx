"use client";

import { nameInitials } from "@/lib/utils";
import Logo from "@/public/assets/icons/logo.svg";
import { useLogoutMutation } from "@/redux/auth/authApi";
import { useNestedCategoriesQuery } from "@/redux/category/categoryApi";
import {
  CircleUser,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  ShoppingCart,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Result } from "postcss";
import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Categories from "./Categories";
import Navbar from "./Navbar";
import { AspectRatio } from "./ui/aspect-ratio";
import AutoComplete from "./ui/autoComplete";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import TooltipContainer from "./ui/TooltipContainer";
import { toast } from "sonner";

interface Props {}

const Header: FC<Props> = ({}) => {
  let pathname = usePathname();
  const { user } = useSelector((state: any) => ({
    user: state.auth.user,
  }));
  const { data, isLoading, isSuccess, isError } = useNestedCategoriesQuery({});

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="border-b sticky z-10 top-0 bg-white">
        <header className="container h-[8vh] flex items-center justify-between gap-8">
          <div className="w-[200px] md:w-[150px] flex items-center gap-3">
            <div className="lg:hidden cursor-pointer">
              <MobileMenu />
            </div>
            <Link
              href="/"
              passHref
            >
              <Image
                src={Logo}
                alt="Logo"
                width={150}
                height={100}
              />
            </Link>
          </div>
          <div className="hidden md:block flex-1">
            <AutoComplete
              // startIcon={
              //   <Search
              //     className="text-placholder"
              //     size={18}
              //   />
              // }
              placeholder="What are you looking for?"
            />
          </div>
          <nav className="">
            <ul className="flex items-center gap-4">
              <li className="md:hidden">
                <Link
                  href="/search"
                  className=""
                >
                  <TooltipContainer content={"Search"}>
                    <Search />
                  </TooltipContainer>
                </Link>
              </li>
              <li className="hidden sm:flex">
                <Link
                  href="/#"
                  className=""
                >
                  <TooltipContainer content={"Cart"}>
                    <ShoppingBag />
                  </TooltipContainer>
                </Link>
              </li>
              <li className="hidden sm:flex">
                <Link
                  href="/#"
                  className=""
                >
                  <TooltipContainer content={"Favorite"}>
                    <Heart />
                  </TooltipContainer>
                </Link>
              </li>
              <li className="">
                {user ? (
                  <div>
                    <ProfileMenu user={user} />
                  </div>
                ) : (
                  <Link
                    href={"/auth/login"}
                    className=""
                  >
                    <Button
                      variant={"outline"}
                      className="text-primary"
                    >
                      Login
                    </Button>
                  </Link>
                )}
              </li>
            </ul>
          </nav>
        </header>
      </div>
      {pathname === "/" ? null : <Navbar />}
    </>
  );
};

interface DropdownMenuProps {
  user: any;
}

export const ProfileMenu: FC<DropdownMenuProps> = ({ user }) => {
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="border border-slate-200 cursor-pointer size-7 -mt-1">
          <AvatarImage
            src={user?.profileImage?.url}
            alt={user?.profileImage?.alt}
          />
          <AvatarFallback className="bg-slate-500 text-white text-xs">
            {nameInitials(user?.name)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuItem>
          <Link
            href="/account/profile"
            passHref
          >
            Profile
          </Link>
        </DropdownMenuItem>
        {user.role === "admin" || user.role === "superadmin" ? (
          <DropdownMenuItem>
            <Link
              href="/admin"
              passHref
            >
              Admin Dashboard
            </Link>
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuItem>
          <Link
            href="/account"
            passHref
          >
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault();
            logout({});
          }}
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface mobileMenuProps {}

const MobileMenu: FC<mobileMenuProps> = ({}) => {
  return (
    <Sheet>
      <SheetTrigger>
        <Menu
          size={28}
          className="mt-2 text-black"
        />
      </SheetTrigger>
      <SheetOverlay className="lg:hidden">
        <SheetContent
          side={"left"}
          className="h-screen lg:hidden"
        >
          <SheetHeader>
            <SheetTitle>
              <SheetClose asChild>
                <Link
                  href="/"
                  passHref
                >
                  <Image
                    src={Logo}
                    alt="Logo"
                    width={150}
                    height={100}
                  />
                </Link>
              </SheetClose>
            </SheetTitle>
          </SheetHeader>

          <div className="mt-4 flex flex-col gap-1 text-black font-bold">
            <p className="text-lg">Categories</p>
            <div className="h-full overflow-y-auto custom-scrollbar">
              <SheetClose asChild>
                <Categories />
              </SheetClose>
            </div>
          </div>
        </SheetContent>
      </SheetOverlay>
    </Sheet>
    // <Sheet>
    //   <SheetTrigger asChild>
    //     <Menu
    //       size={28}
    //       className="text-black"
    //     />
    //   </SheetTrigger>
    //   <SheetContent>
    //     <SheetHeader>
    //       <SheetTitle>
    //         <SheetClose asChild>
    //           <Link
    //             href="/"
    //             passHref
    //           >
    //             <Image
    //               src={Logo}
    //               alt="Logo"
    //               width={150}
    //               height={100}
    //             />
    //           </Link>
    //         </SheetClose>
    //       </SheetTitle>
    //     </SheetHeader>
    //     {/* <div className="grid gap-4 py-4">
    //       <div className="grid grid-cols-4 items-center gap-4">
    //         <Label
    //           htmlFor="name"
    //           className="text-right"
    //         >
    //           Name
    //         </Label>
    //         <Input
    //           id="name"
    //           value="Pedro Duarte"
    //           className="col-span-3"
    //         />
    //       </div>
    //       <div className="grid grid-cols-4 items-center gap-4">
    //         <Label
    //           htmlFor="username"
    //           className="text-right"
    //         >
    //           Username
    //         </Label>
    //         <Input
    //           id="username"
    //           value="@peduarte"
    //           className="col-span-3"
    //         />
    //       </div>
    //     </div> */}
    //     <SheetFooter>
    //       <SheetClose asChild>
    //         <Button type="submit">Save changes</Button>
    //       </SheetClose>
    //     </SheetFooter>
    //   </SheetContent>
    // </Sheet>
  );
};

export default Header;
