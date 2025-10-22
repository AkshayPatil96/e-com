"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PhoneInputField } from "@/components/ui/phoneInput";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ProfileUploader } from "@/components/ui/profileUploader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useLoadUserQuery, useUpdateUserMutation } from "@/redux/user/userApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const profileSchema = z.object({
  profilePic: z
    .any()
    .refine(
      (file) =>
        !file ||
        (file instanceof File &&
          ["image/jpeg", "image/png", "image/webp"].includes(file.type)),
      { message: "Only jpg, png, or webp images are allowed" },
    )
    .optional(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^\+?[0-9\-\s]{7,15}$/.test(val), {
      message: "Invalid phone number format",
    }),
  alternatePhone: z.string().optional(),
  gender: z.enum(["male", "female"]).optional(),
  dob: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const Profile = () => {
  const {
    data: { data: user },
  } = useLoadUserQuery();

  const [updateUser, { isLoading, isSuccess, isError }] =
    useUpdateUserMutation();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      gender: undefined,
      dob: undefined,
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        ...user,
      });
    }
  }, [user, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    console.log("data: ", data);
    await updateUser(data);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Profile updated successfully!");
    } else if (isError) {
      toast.error("Failed to update profile. Please try again.");
    }
  }, [isSuccess, isError]);

  return (
    <div className="">
      <h2 className="text-lg md:text-2xl font-medium text-center">
        Your Profile
      </h2>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-4 gap-y-6 justify-center"
        >
          <div className="col-span-2">
            <FormField
              control={form.control}
              name="profilePic"
              render={({ field, fieldState }) => (
                <FormItem className="pt-2 md:pt-4">
                  <FormControl>
                    <ProfileUploader
                      value={field.value || null}
                      onChange={field.onChange}
                      error={fieldState.error?.message}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-2 md:col-span-1">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your first name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-2 md:col-span-1">
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your last name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-2 md:col-span-1">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your username"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-2 md:col-span-1">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      disabled
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-2 md:col-span-1">
            <FormField
              control={form.control}
              name="phone"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <PhoneInputField
                      value={field.value || ""}
                      onChange={field.onChange}
                      name={field.name}
                      error={fieldState.error?.message}
                      disabled={field.disabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-2 md:col-span-1">
            <FormField
              control={form.control}
              name="alternatePhone"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Alternate Phone Number</FormLabel>
                  <FormControl>
                    <PhoneInputField
                      value={field.value || ""}
                      onChange={field.onChange}
                      name={field.name}
                      error={fieldState.error?.message}
                      disabled={field.disabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-2 md:col-span-1">
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <Select
                      {...field}
                      onValueChange={(value) => value && field.onChange(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select your gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-2 md:col-span-1">
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of Birth</FormLabel>
                  <Popover>
                    <PopoverTrigger
                      asChild
                      className="bg-white"
                    >
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span className="text-placeholder">
                              Date of Birth
                            </span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 text-placeholder" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(date) => {
                          if (date) field.onChange(date?.toISOString());
                        }}
                        // disabled={(date) =>
                        //   date > new Date() || date < new Date("1900-01-01")
                        // }
                        captionLayout="dropdown"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-2 flex justify-center mt-2">
            <Button
              type="submit"
              effect={"ringHover"}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Profile;
