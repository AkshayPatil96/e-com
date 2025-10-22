/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import AutoComplete from "@/components/ui/autoComplete";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowUpLeft, History, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { set, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";

// Define schema for form validation
const formSchema = z.object({
  search: z.string().nonempty("Please enter a search term"),
});

// Define TypeScript types for component props and Redux state
type SearchFormData = z.infer<typeof formSchema>;

const SearchSection = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  // Get user data from Redux
  const { user } = useSelector((state: any) => ({
    user: state.auth.user,
  }));
  console.log("user: ", user);

  const {
    register,
    handleSubmit,
    setValue,
    setFocus,
    formState: { errors },
  } = useForm<SearchFormData>({
    resolver: zodResolver(formSchema),
  });

  // Function to handle clearing all recent searches
  const handleClearAll = () => {
    // Dispatch an action to clear recent searches in Redux
    dispatch({ type: "CLEAR_RECENT_SEARCHES" });
  };

  return (
    <div>
      <div className="py-4">
        <AutoComplete
          // starticon={
          //   <ArrowLeft
          //     className="text-label cursor-pointer"
          //     size={22}
          //     onClick={() => router.back()}
          //   />
          // }
          autoComplete="off"
          type="search"
          {...register("search")}
          placeholder="What are you looking for?"
        />
        {errors.search && (
          <p className="text-xs text-red-500 mt-1">{errors.search.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Recent Searches</h1>
          <button
            className="text-sm text-primary"
            onClick={handleClearAll}
          >
            Clear all
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {user?.recentItems?.recentSearches?.map(
            (item: string, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <History
                    className="text-placholder"
                    size={22}
                  />
                  <p className="text-sm text-label">{item}</p>
                </div>
                <div
                  className="text-sm text-placholder"
                  onClick={(e) => {
                    e.preventDefault();
                    setValue("search", item);
                    setFocus("search");
                  }}
                >
                  <ArrowUpLeft
                    className="text-placholder"
                    size={22}
                  />
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchSection;
