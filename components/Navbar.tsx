"use client";

import React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useCategoriesByLevelQuery } from "@/redux/category/categoryApi";
import { ICategory } from "@/@types/category.types";

type Props = {};

const Navbar = (props: Props) => {
  const { data, isLoading, isSuccess, isError } = useCategoriesByLevelQuery(3);

  return (
    <nav className="border hidden lg:flex">
      {isSuccess && data?.data?.length ? (
        <div className="container">
          <NavigationMenu>
            <NavigationMenuList>
              {data?.data?.map((category: ICategory) => (
                <NavigationMenuItem key={category._id}>
                  <NavigationMenuTrigger className="bg-inherit ">
                    {category.name}
                  </NavigationMenuTrigger>
                  {category.children?.length ? (
                    <NavigationMenuContent className="p-4 w-[800px] overflow-hidden">
                      <div className="columns-3 gap-6">
                        {category?.children.map((cate: ICategory, index) => {
                          let link = cate?.ancestors?.length
                            ? `/category/${(
                                cate.ancestors as unknown as ICategory[]
                              )
                                .map((cat: ICategory) => cat?.slug)
                                .join("/")}/${cate.slug}`
                            : `/category/${cate.slug}`;
                          return (
                            <div
                              key={cate._id}
                              className="min-w-[200px] break-inside-avoid mb-4"
                            >
                              <Link href={link}>
                                <h3 className="font-bold text-md text-title hover:text-primary cursor-pointer mb-2">
                                  {cate.name}
                                </h3>
                              </Link>
                              {cate?.children?.length ? (
                                <ul>
                                  {cate.children.map((sub: ICategory, i) => {
                                    let link = sub?.ancestors?.length
                                      ? `/category/${(
                                          sub.ancestors as unknown as ICategory[]
                                        )
                                          .map((cat: ICategory) => cat?.slug)
                                          .join("/")}/${sub.slug}`
                                      : `/category/${sub.slug}`;
                                    return (
                                      <li
                                        key={sub._id}
                                        className="text-label hover:text-primary text-sm cursor-pointer"
                                      >
                                        <Link href={link}>{sub?.name}</Link>
                                      </li>
                                    );
                                  })}
                                </ul>
                              ) : null}
                            </div>
                          );
                        })}
                      </div>
                    </NavigationMenuContent>
                  ) : null}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      ) : null}
    </nav>
  );
};

export default Navbar;
