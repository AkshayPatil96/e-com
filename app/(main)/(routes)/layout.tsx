import React, { FC, ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const ManLayout: FC<Props> = ({ children }) => {
  return <div className="">{children}</div>;
};

export default ManLayout;
