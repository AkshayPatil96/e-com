"use client";

import { Button } from "@/components/ui/button";
import LinedInput from "@/components/ui/LinedInput";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { FC, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import PasswordStrengthMeter from "./PasswordStrengthMeter";
import { useResetPasswordMutation } from "@/redux/auth/authApi";

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/,
        "Password must contain at least one uppercase, one lowercase, one number, and one special character",
      ),
    confirmPassword: z.string(),
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
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof formSchema>>({
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
      reset();
    }

    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
      } else {
        toast.error("An error occured: ", error as any);
      }
    }
  }, [isSuccess, error]);

  return (
    <div className="h-full flex flex-col justify-between">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-[90%] grid grid-cols-12 mx-auto justify-center items-center gap-y-6 gap-x-8"
      >
        <div className="col-span-12 flex flex-col gap-1">
          <h1>
            <span className="text-3xl text-title font-semibold font-josefin">
              Reset Password
            </span>
          </h1>
          <p className="text-label text-sm">
            Please enter your new password below.
          </p>
        </div>
        <div className="relative col-span-12">
          <LinedInput
            placeholder="Password*"
            type={toggle ? "text" : "password"}
            togglePassword={togglePassword}
            error={!!errors.password}
            {...register("password", { required: "required*" })}
          />
          {watch("password") ? (
            <PasswordStrengthMeter password={watch("password")} />
          ) : null}
        </div>

        <div className="relative col-span-12">
          <LinedInput
            placeholder="Confirm Password"
            type={toggleConfirm ? "text" : "password"}
            togglePassword={toggleConfirmPassword}
            error={!!errors.confirmPassword}
            {...register("confirmPassword", { required: "required*" })}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="col-span-12">
          <Button
            className="bg-button-1 text-white 
      w-full hover:bg-button-hover"
            // disabled={isLoading}
          >
            {/* {isLoading ? <Loader color="white" /> : "Send Reset Link"} */}
            Reset Password
          </Button>
        </div>
      </form>

      <div className="mt-2">
        <p className="text-center text-sm text-slate-400">
          <span>
            Remember your password?{" "}
            <Link href="/auth/login">
              <span className="text-primary font-medium">Login</span>
            </Link>
          </span>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
