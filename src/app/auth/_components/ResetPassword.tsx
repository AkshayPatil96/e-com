/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LinedInput from "@/components/ui/LinedInput";
import { Loader } from "@/components/ui/loader";
import { useResetPasswordMutation } from "@/redux/auth/authApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { FC, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import PasswordStrengthMeter from "./PasswordStrengthMeter";

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/,
        "Password must contain at least one uppercase, one lowercase, one number, and one special character",
      ),
    confirmPassword: z.string().min(8, "Required*"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type Props = {
  resetToken: string;
};

const ResetPassword: FC<Props> = ({ resetToken }) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const [resetPassword, { isError, isLoading, isSuccess, error }] =
    useResetPasswordMutation();

  const [toggle, setToggle] = useState<boolean>(false);
  const [toggleConfirm, setToggleConfirm] = useState<boolean>(false);

  const togglePassword = () => {
    setToggle(!toggle);
  };

  const toggleConfirmPassword = () => {
    setToggleConfirm(!toggleConfirm);
  };

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = (data) => {
    console.log(data);
    resetPassword({ ...data, token: resetToken });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Password reset successfully");
      router.push("/auth/login");
      form.reset();
    }

    if (error) {
      if (typeof error === "object" && error !== null && "data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
      } else {
        toast.error("An error occured: ", error as any);
      }
    }
  }, [isSuccess, error]);

  return (
    <div className="h-full flex flex-col justify-between gap-4">
      <div className="col-span-12 flex flex-col gap-1">
        <h1 className="text-3xl text-title font-semibold font-josefin">
          Reset Password
        </h1>
        <p className="text-label text-sm">Enter your new password below.</p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-[90%] grid grid-cols-12 mx-auto justify-center items-center gap-y-2 gap-x-8"
        >
          <div className="relative col-span-12">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <FormControl>
                      <Input
                        placeholder="Password*"
                        type={toggle ? "text" : "password"}
                        {...field}
                      />
                    </FormControl>
                    <button
                      className="text-placeholder focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                      type="button"
                      onClick={togglePassword}
                      aria-label={toggle ? "Hide password" : "Show password"}
                      aria-pressed={toggle}
                      aria-controls="password"
                    >
                      {toggle ? (
                        <EyeOffIcon
                          size={16}
                          aria-hidden="true"
                        />
                      ) : (
                        <EyeIcon
                          size={16}
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.watch("password") && (
              <PasswordStrengthMeter password={form.watch("password")} />
            )}
          </div>

          <div className="relative col-span-12">
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <FormControl>
                      <Input
                        placeholder="Confirm Password*"
                        type={toggle ? "text" : "password"}
                        {...field}
                      />
                    </FormControl>
                    <button
                      className="text-placeholder focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                      type="button"
                      onClick={toggleConfirmPassword}
                      aria-label={
                        toggle
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                      aria-pressed={toggle}
                      aria-controls="confirm-password"
                    >
                      {toggle ? (
                        <EyeOffIcon
                          size={16}
                          aria-hidden="true"
                        />
                      ) : (
                        <EyeIcon
                          size={16}
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-12">
            <Button
              className="w-full"
              effect={"ringHover"}
              disabled={isLoading}
            >
              {isLoading ? <Loader color="white" /> : "Reset Password"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ResetPassword;
