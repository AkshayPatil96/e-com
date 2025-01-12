import React, { FC } from "react";

type Props = {
  params: { slug: string };
};

const ProductEdit: FC<Props> = async ({ params }) => {
  let { slug } = await params;
  return <div>ProductEdit: {slug}</div>;
};

export default ProductEdit;
