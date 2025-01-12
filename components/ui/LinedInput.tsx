import React, { FC } from "react";
import { Input } from "./input";
import { Eye, EyeOffIcon } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

type Props = {
  error?: boolean;
  togglePassword?: () => void;
} & InputProps;

const LinedInput: FC<Props> = ({ error, togglePassword, ...rest }) => {
  return (
    <div
      className={`relative border-b ${
        error ? "border-error-background" : "border-line"
      }`}
    >
      <Input
        {...rest}
        className="p-1 bg-transparent border-none border-b focus-visible:ring-0"
        type={rest?.type}
      />
      {rest?.name === "password" || rest?.name === "confirmPassword" ? (
        rest?.type === "password" ? (
          <Eye
            className="cursor-pointer absolute right-0 top-1/2 transform -translate-y-1/2 mr-2 size-4 text-placholder"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (togglePassword) togglePassword();
            }}
          />
        ) : rest?.type === "text" ? (
          <EyeOffIcon
            className="cursor-pointer absolute right-0 top-1/2 transform -translate-y-1/2 mr-2 size-4 text-placholder"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (togglePassword) togglePassword();
            }}
          />
        ) : null
      ) : null}
    </div>
  );
};

export default LinedInput;
