import Logo from "@/public/assets/icons/logo.svg";
import { headersHeight } from "@/utils/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const AuthHeader = () => {
  return (
    <div
      className="border-b bg-white flex items-center justify-center"
      style={{ height: `${headersHeight}px` }}
    >
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
  );
};

export default AuthHeader;
