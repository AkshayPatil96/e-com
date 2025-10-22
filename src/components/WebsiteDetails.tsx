import { Headphones, Package, ShieldCheck } from "lucide-react";
import React from "react";

const WebsiteDetails = () => {
  return (
    <div className="w-full container grid grid-cols-12 items-center justify-between gap-4 mt-12 p-12">
      <div className="detail-card">
        <Package size={48} />
        <div className="">
          <p className="">Free & Fast Delivery</p>
          <p className="">Get free delivery for all orders above ₹500</p>
        </div>
      </div>
      <div className="detail-card">
        <Headphones size={48} />
        <div className="">
          <p className="">24/7 Customer Service</p>
          <p className="">Friendly 24/7 customer support</p>
        </div>
      </div>
      <div className="detail-card">
        <ShieldCheck size={48} />
        <div className="">
          <p className="">Money Back Guarantee</p>
          <p className="">We return money within 15 days</p>
        </div>
      </div>
    </div>
  );
};

export default WebsiteDetails;
