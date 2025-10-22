"use client";
import { Loader } from "@/components/ui/loader";
import { useAppSelector } from "@/redux/hooks";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

type Props = {
  children: React.ReactNode;
};

const ClientAuthRedirect = ({ children }: Props) => {
  const { user, isLoading } = useAppSelector((state) => state.auth);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!user && !isLoading) {
      router.replace("/");
    }
  }, [user, pathname, router, isLoading]);

  return <>{isLoading ? <Loader /> : children}</>;
};

export default ClientAuthRedirect;
