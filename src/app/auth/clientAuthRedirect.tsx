"use client";
import { useAppSelector } from "@/redux/hooks";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

type Props = {
  children: React.ReactNode;
};

const ClientAuthRedirect = ({ children }: Props) => {
  const { user } = useAppSelector((state) => state.auth);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, [user, pathname, router]);

  return <>{children}</>;
};

export default ClientAuthRedirect;
