"use client";
import InfinityLoader from "@/components/ui/loader";
import { useAppSelector } from "@/redux/hooks";
import { useLoadUserQuery } from "@/redux/user/userApi";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

type Props = {
  children: React.ReactNode;
};

const AuthCheckWrapper = ({ children }: Props) => {
  const { isLoading, isFetching } = useLoadUserQuery();
  const { isAuthLoading } = useAppSelector((state) => ({
    isAuthLoading: state.auth.isLoading,
  }));

  return (
    <>
      {isLoading || isFetching || isAuthLoading ? (
        <div className="h-[100vh]">
          <InfinityLoader />
        </div>
      ) : (
        <>{children}</>
      )}
    </>
  );
};

export default AuthCheckWrapper;
