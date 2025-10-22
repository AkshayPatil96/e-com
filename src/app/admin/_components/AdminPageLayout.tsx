import { Button } from "@/components/ui/button";
import { headersHeight } from "@/lib/utils";
import { Plus } from "lucide-react";
import React, { ReactNode } from "react";

type AdminPageLayoutProps = {
  title: string;
  actionButtons?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
    variant?:
      | "default"
      | "destructive"
      | "outline"
      | "secondary"
      | "ghost"
      | "link";
    size?: "default" | "sm" | "lg" | "icon";
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    loading?: boolean;
    className?: string;
  }[];
  subtitle?: string;
};

const AdminPageLayout = ({
  title,
  actionButtons,
  subtitle,
}: AdminPageLayoutProps) => {
  return (
    <div
      className="flex flex-col"
      // style={{ minHeight: `calc(100vh - ${headersHeight}px)` }}
    >
      {/* Header Section */}
      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center px-4 py-2">
          <div className="flex-1">
            <h1 className="font-semibold text-2xl">{title}</h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>

          {actionButtons && actionButtons.length > 0 && (
            <div className="flex items-center gap-2 ml-auto">
              {actionButtons.map((button, index) => (
                <Button
                  key={index}
                  onClick={button.onClick}
                  variant={button.variant || "default"}
                  size={button.size || "default"}
                  type={button.type || "button"}
                  disabled={button.disabled || button.loading}
                  className={button.className}
                >
                  {button.loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                      Loading...
                    </>
                  ) : (
                    <>
                      {button.icon || <Plus className="h-4 w-4 mr-2" />}
                      {button.label}
                    </>
                  )}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPageLayout;
