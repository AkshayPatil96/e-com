import FormLayout from "@/app/admin/_components/FormLayout";
import ProductAddForm from "@/app/admin/_components/ProductAddForm";
import React, { FC } from "react";

type Props = {};

const ProductAdd: FC<Props> = ({}) => {
  return (
    <div className="m-4 p-2">
      <h1 className="text-2xl">Add Product</h1>
      <p className="text-sm text-placholder">Here you can add a new product</p>

      <ProductAddForm />
    </div>
  );
};

export default ProductAdd;
