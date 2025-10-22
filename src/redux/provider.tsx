"use client";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";
import { Provider } from "react-redux";
import { useAppSelector } from "./hooks";
import { store } from "./store";

interface ProviderProps {
  children: ReactNode;
}

export function StoreProvider({ children }: ProviderProps) {
  return <Provider store={store}>{children}</Provider>;
}

export const AdminProvider = ({ children }: ProviderProps) => {
  const { user } = useAppSelector((state) => state.auth);
  console.log("user: ", user);

  user && (user.role === "admin" || user.role === "superadmin") ? (
    <div>{children}</div>
  ) : (
    redirect("/")
  );
};
