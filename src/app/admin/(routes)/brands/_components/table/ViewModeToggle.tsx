"use client";

import { Button } from "@/components/ui/button";
import { Grid3X3, List } from "lucide-react";
import React from "react";
import { type TableViewMode } from "./types";

interface ViewModeToggleProps {
  currentMode: TableViewMode;
  onModeChange: (mode: TableViewMode) => void;
  disabled?: boolean;
}

export function ViewModeToggle({
  currentMode,
  onModeChange,
  disabled = false,
}: ViewModeToggleProps) {
  return (
    <div className="flex items-center border rounded-md p-1 bg-background">
      <Button
        variant={currentMode === "list" ? "default" : "ghost"}
        size="sm"
        onClick={() => onModeChange("list")}
        disabled={disabled}
        className="px-3"
      >
        <List className="h-4 w-4" />
        <span className="ml-1 hidden sm:inline">List</span>
      </Button>
      <Button
        variant={currentMode === "grid" ? "default" : "ghost"}
        size="sm"
        onClick={() => onModeChange("grid")}
        disabled={disabled}
        className="px-3"
      >
        <Grid3X3 className="h-4 w-4" />
        <span className="ml-1 hidden sm:inline">Grid</span>
      </Button>
    </div>
  );
}

export default ViewModeToggle;