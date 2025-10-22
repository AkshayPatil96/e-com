"use client";

import { IUser } from "@/app/admin/(routes)/sellers/_types/seller.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useSearchUsersForSellerQuery } from "@/redux/adminDashboard/seller/sellerApi";
import { Check, Mail, Search, User, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface UserAutocompleteProps {
  value?: IUser | null;
  onChange: (user: IUser | null) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  description?: string;
  className?: string;
}

export function UserAutocomplete({
  value,
  onChange,
  onBlur,
  placeholder = "Search for a user...",
  error,
  disabled = false,
  required = false,
  label,
  description,
  className,
}: UserAutocompleteProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // API call with debouncing
  const {
    data: searchResults,
    isLoading,
    error: searchError,
  } = useSearchUsersForSellerQuery(
    {
      q: query,
      limit: 10,
      excludeExistingSellers: true,
    },
    {
      skip: query.length < 2, // Don't search for less than 2 characters
    }
  );

  const users = searchResults?.data?.results || [];

  // Debounced search
  const debouncedSearch = useCallback((searchQuery: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      setQuery(searchQuery);
    }, 300);
  }, []);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    debouncedSearch(newValue);
    setIsOpen(newValue.length >= 2);
    setSelectedIndex(-1);
    
    // Clear selection if user starts typing and current value doesn't match
    if (value && !newValue) {
      onChange(null);
    }
  };

  // Handle user selection
  const handleSelectUser = (user: IUser) => {
    onChange(user);
    setIsOpen(false);
    setQuery("");
    setSelectedIndex(-1);
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.blur();
    }
  };

  // Handle clear selection
  const handleClearSelection = () => {
    onChange(null);
    setQuery("");
    setSelectedIndex(-1);
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || users.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => 
          prev < users.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => 
          prev > 0 ? prev - 1 : users.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < users.length) {
          handleSelectUser(users[selectedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setSelectedIndex(-1);
        if (inputRef.current) {
          inputRef.current.blur();
        }
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // Handle blur
  const handleBlur = () => {
    setTimeout(() => {
      setIsOpen(false);
      setSelectedIndex(-1);
      onBlur?.();
    }, 150); // Small delay to allow click events
  };

  return (
    <div className={cn("relative", className)}>
      {label && (
        <Label className="mb-2 block">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      
      {description && (
        <p className="text-sm text-muted-foreground mb-2">{description}</p>
      )}

      {/* Selected User Display */}
      {value && (
        <div className="mb-2 p-3 border rounded-lg bg-muted/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={value.avatar?.url} alt={value.name} />
              <AvatarFallback>
                {value.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium truncate">{value.name}</p>
                {value.isActive && (
                  <Badge variant="default" className="text-xs">
                    Active
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground truncate flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {value.email}
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClearSelection}
            disabled={disabled}
            className="text-muted-foreground hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            placeholder={value ? "Search to change user..." : placeholder}
            className={cn(
              "pl-10 pr-4",
              error && "border-red-500 focus-visible:ring-red-500"
            )}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            onFocus={() => {
              if (inputRef.current?.value && inputRef.current.value.length >= 2) {
                setIsOpen(true);
              }
            }}
            disabled={disabled}
            autoComplete="off"
          />
        </div>

        {/* Dropdown */}
        {isOpen && (
          <div
            ref={dropdownRef}
            className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto"
          >
            {isLoading && (
              <div className="p-3 text-center text-sm text-muted-foreground">
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                  Searching users...
                </div>
              </div>
            )}

            {Boolean(searchError) && (
              <div className="p-3 text-center text-sm text-red-600">
                Error searching users. Please try again.
              </div>
            )}

            {!isLoading && !searchError && users.length === 0 && query.length >= 2 && (
              <div className="p-3 text-center text-sm text-muted-foreground">
                <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
                No users found for &quot;{query}&quot;
              </div>
            )}

            {!isLoading && users.length > 0 && (
              <div className="py-1">
                {users.map((user, index) => (
                  <button
                    key={user._id}
                    type="button"
                    className={cn(
                      "w-full text-left px-3 py-2 hover:bg-muted transition-colors flex items-center gap-3",
                      index === selectedIndex && "bg-muted",
                      value?._id === user._id && "bg-blue-50 border-l-2 border-l-blue-500"
                    )}
                    onClick={() => handleSelectUser(user)}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar?.url} alt={user.name} />
                      <AvatarFallback>
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate">{user.name}</p>
                        {user.isActive && (
                          <Badge variant="default" className="text-xs">
                            Active
                          </Badge>
                        )}
                        {value?._id === user._id && (
                          <Check className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {!isLoading && users.length > 0 && (
              <div className="border-t p-2 text-xs text-muted-foreground text-center">
                Use arrow keys to navigate, Enter to select, Esc to close
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {/* Helper Text */}
      {!error && !value && (
        <p className="mt-1 text-xs text-muted-foreground">
          Type at least 2 characters to search for users
        </p>
      )}
    </div>
  );
}