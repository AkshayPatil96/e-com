import React, { FC } from "react";

type Props = {
  children: React.ReactNode;
};

const CategoryLayout: FC<Props> = ({ children }) => {
  return <div>{children}</div>;
};

export default CategoryLayout;
