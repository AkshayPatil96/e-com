import React, { FC } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

type Props = {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
};

const TooltipContainer: FC<Props> = ({
  children,
  content,
  side = "bottom",
}) => {
  return (
    <TooltipProvider disableHoverableContent>
      <Tooltip>
        <TooltipTrigger className="mt-1.5 w-full">{children}</TooltipTrigger>
        <TooltipContent side={side}>{content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipContainer;
