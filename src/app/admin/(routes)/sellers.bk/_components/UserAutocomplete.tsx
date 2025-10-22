"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DynamicAutocomplete, {
  type AutocompleteOption,
  type DynamicAutocompleteProps,
} from "@/components/ui/dynamic-autocomplete";
import { useSearchUsersQuery } from "@/redux/adminDashboard/seller/sellerApi";
import { useCallback, useMemo } from "react";
import type { IUser } from "../_types/seller.types";

interface UserAutocompleteProps
  extends Omit<
    DynamicAutocompleteProps,
    "options" | "isLoading" | "onSearch" | "fetchOption" | "config"
  > {
  excludeId?: string; // Exclude a user (useful for edit mode)
  includeInactive?: boolean; // Whether to show inactive users
}

const UserAutocomplete = ({
  excludeId,
  includeInactive = false,
  texts = {},
  ...props
}: UserAutocompleteProps) => {
  // Search users with debounced query
  const {
    data: searchData,
    isLoading,
    isFetching,
  } = useSearchUsersQuery(
    {
      limit: 50, // Reasonable limit for autocomplete
    },
    {
      // Always keep users loaded for better UX
    },
  );

  // Convert users to autocomplete options
  const options: AutocompleteOption[] = useMemo(() => {
    if (!searchData?.results) return [];

    return searchData.results
      .filter((user: IUser) => {
        // Exclude specific user if provided
        if (excludeId && user._id === excludeId) return false;
        // Filter inactive users if not included
        if (!includeInactive && !user.isActive) return false;
        return true;
      })
      .map((user: IUser) => ({
        id: user._id,
        label: user.name,
        value: user._id,
        description: user.email,
        isActive: user.isActive,
        icon: (
          <Avatar className="h-6 w-6">
            <AvatarImage src={user.avatar?.url} alt={user.avatar?.alt || user.name} />
            <AvatarFallback className="text-xs">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        ),
        metadata: {
          email: user.email,
          avatar: user.avatar,
        },
      }));
  }, [searchData?.results, excludeId, includeInactive]);

  // Handle search (triggered by typing in the autocomplete)
  const handleSearch = useCallback((query: string) => {
    // The search will be handled by RTK Query when we implement dynamic search
    // For now, we're loading all users and filtering client-side
    console.log("Searching users:", query);
  }, []);

  // Default configuration for user selection
  const userConfig = {
    multiple: false, // Single user selection
    showHierarchy: false,
    showDescriptions: true,
    showActiveStatus: true,
    searchLimit: 50,
    debounceMs: 300,
    closeOnSelect: true,
  };

  // Default texts for user selection
  const userTexts = {
    placeholder: "Select user...",
    searchPlaceholder: "Search users by name or email...",
    noResultsText: "No users found.",
    ...texts,
  };

  return (
    <DynamicAutocomplete
      {...props}
      options={options}
      isLoading={isLoading || isFetching}
      onSearch={handleSearch}
      config={userConfig}
      texts={userTexts}
      excludeIds={excludeId ? [excludeId] : undefined}
    />
  );
};

export default UserAutocomplete;