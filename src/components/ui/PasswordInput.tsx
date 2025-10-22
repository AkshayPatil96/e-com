/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, RefreshCw } from "lucide-react";
import { useState } from "react";
import { ControllerRenderProps } from "react-hook-form";

interface PasswordInputProps {
  field: ControllerRenderProps | any;
  label?: string;
  placeholder?: string;
  description?: string;
  disabled?: boolean;
  showGenerateButton?: boolean;
  minLength?: number;
}

export function PasswordInput({
  field,
  label = "Password",
  placeholder = "Enter password",
  description,
  disabled = false,
  showGenerateButton = true,
  minLength = 8,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  // Generate random password between 8 and 12 characters
  const generateRandomPassword = () => {
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const specialChars = "!@#$%^&*";

    // Random length between 8 and 12
    const length = Math.floor(Math.random() * 5) + 8; // 8 to 12

    let password = "";

    // Ensure at least one character from each category
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += specialChars[Math.floor(Math.random() * specialChars.length)];

    // Fill remaining characters
    const allChars = lowercase + uppercase + numbers + specialChars;
    for (let i = 4; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle the password
    return password
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");
  };

  const handleGeneratePassword = () => {
    const newPassword = generateRandomPassword();
    field.onChange(newPassword);
  };

  const defaultDescription = description || 
    `Password must be at least ${minLength} characters with uppercase, numbers, and special characters.`;

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <div className="space-y-2">
        <div className="relative">
          <FormControl>
            <Input
              {...field}
              value={field.value || ""}
              type={showPassword ? "text" : "password"}
              placeholder={placeholder}
              disabled={disabled}
              className={showGenerateButton ? "pr-20" : "pr-10"}
            />
          </FormControl>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowPassword(!showPassword)}
              disabled={disabled}
              className="h-8 w-8 p-0"
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
            {showGenerateButton && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleGeneratePassword}
                disabled={disabled}
                className="h-8 w-8 p-0"
                title="Generate random password"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        <FormDescription className="text-xs text-muted-foreground">
          {defaultDescription}
        </FormDescription>
      </div>
      <FormMessage />
    </FormItem>
  );
}