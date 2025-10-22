import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const nameInitials = (name: string) => {
  if (!name) return "";
  const [firstName, lastName] = name?.split(" ");
  return firstName.charAt(0) + lastName.charAt(0);
};

export const headersHeight = 69;
export const adminHeadersHeight = 59;
