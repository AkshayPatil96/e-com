"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Grid3X3, List, TreePine } from "lucide-react";
import { type TableViewMode } from "./types";
import { CategoryFiltersType } from "../../_types/category.types";

interface ViewModeToggleProps {
  currentMode: TableViewMode;
  onModeChange: (mode: TableViewMode) => void;
  disabled?: boolean;
  handleResetFilters: () => void;
}

const VIEW_MODES = [
  {
    value: "tree" as const,
    label: "Tree View",
    icon: TreePine,
    description: "Hierarchical view with expand/collapse",
  },
  {
    value: "list" as const,
    label: "List View",
    icon: List,
    description: "Flat table view",
  },
  {
    value: "grid" as const,
    label: "Grid View",
    icon: Grid3X3,
    description: "Card-based grid layout",
  },
] as const;

export function ViewModeToggle({
  currentMode,
  onModeChange,
  disabled = false,
  handleResetFilters,
}: ViewModeToggleProps) {
  return (
    <div className="flex items-center gap-1 border rounded-lg p-1">
      {VIEW_MODES.map((mode) => {
        const Icon = mode.icon;
        const isActive = currentMode === mode.value;

        return (
          <Button
            key={mode.value}
            variant={isActive ? "default" : "ghost"}
            size="sm"
            onClick={() => {
              console.log(currentMode, "mode.value: ", mode.value);
              if (mode.value === "tree") handleResetFilters();
              onModeChange(mode.value);
            }}
            disabled={disabled}
            className="flex items-center gap-2 relative"
            title={mode.description}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{mode.label}</span>
            {isActive && (
              <Badge
                variant="secondary"
                className="ml-1 px-1 py-0 text-xs"
              >
                Active
              </Badge>
            )}
          </Button>
        );
      })}
    </div>
  );
}

export default ViewModeToggle;
