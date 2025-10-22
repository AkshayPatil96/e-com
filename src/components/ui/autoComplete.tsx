/* eslint-disable @typescript-eslint/no-empty-object-type */
"use client";

import React, { FC, InputHTMLAttributes } from "react";
import { Input } from "./input";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

type Props = {
  starticon?: React.ReactNode;
} & InputProps;

const AutoComplete: FC<Props> = ({ starticon, ...rest }) => {
  return (
    <div>
      <Input
        // startIcon={starticon}
        {...rest}
      />
    </div>
  );
};

export default AutoComplete;
