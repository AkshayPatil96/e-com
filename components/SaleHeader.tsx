import Link from "next/link";
import React from "react";

type Props = {};

const SaleHeader = (props: Props) => {
  return (
    <div className="bg-black text-white p-1.5 text-center text-sm">
      Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!{" "}
      <Link href="/products" className="underline ml-1">
        <span>Shop Now</span>
      </Link>
    </div>
  );
};

export default SaleHeader;
