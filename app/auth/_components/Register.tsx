"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LinedInput from "@/components/ui/LinedInput";
import { Loader } from "@/components/ui/loader";
import { useRegisterMutation } from "@/redux/auth/authApi";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { FC, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { InfinitySpin, RotatingLines } from "react-loader-spinner";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { z } from "zod";
import PasswordStrengthMeter from "./PasswordStrengthMeter";

const formSchema = z.object({
  firstName: z.string().nonempty({ message: "required*" }),
  lastName: z.string().nonempty({ message: "required*" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/,
      "Password must contain at least one uppercase, one lowercase, one number, and one special character",
    ),
});

type Inputs = z.infer<typeof formSchema>;

const capitalizeOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  e.target.value = e.target.value.replace(/\b\w/g, (c) => c.toUpperCase());
};

const Register: FC = () => {
  const router = useRouter();
  const { token, page, registerData } = useSelector((state: any) => ({
    token: state.auth.token,
    page: state.auth,
    registerData: state.auth.register,
  }));
  const [registerUser, { isLoading, data, error, isSuccess }] =
    useRegisterMutation();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(formSchema),
  });

  const [toggle, setToggle] = useState(false);

  const togglePassword = () => {
    setToggle(!toggle);
  };

  useEffect(() => {
    if (isSuccess) {
      reset();
      const message = data?.message || "Registration Successful";
      toast.success(message);
      router.push("/account/register/verify");
    }
    if (error) {
      if (typeof error === "object" && error !== null && "data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
      }
    }
  }, [isSuccess, error]);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    registerUser(data);
  };

  return (
    <div className="h-full flex flex-col justify-between gap-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-[90%] grid grid-cols-12 mx-auto justify-center items-center gap-y-4 gap-x-8"
      >
        <div className="col-span-12 flex flex-col gap-1">
          <h1>
            <span className="text-3xl text-title font-semibold font-josefin">
              Create a new account
            </span>
          </h1>
          <p className="text-label text-sm">
            Enter your details below to create an account.
          </p>
        </div>

        <div className="relative col-span-12 md:col-span-6">
          <LinedInput
            placeholder="First Name*"
            error={!!errors.firstName}
            {...register("firstName", {
              required: "required*",
              pattern: {
                value: /^[A-Za-z]+$/i,
                message: "Alphabets only",
              },
              onChange: capitalizeOnChange,
            })}
          />
          {errors.firstName && (
            <span className="absolute text-error-background text-xs">
              {errors.firstName.message}
            </span>
          )}
        </div>

        <div className="relative col-span-12 md:col-span-6">
          <LinedInput
            placeholder="Last Name*"
            error={!!errors.lastName}
            {...register("lastName", {
              required: "required*",
              pattern: {
                value: /^[A-Za-z]+$/i,
                message: "Alphabets only",
              },
              onChange: capitalizeOnChange,
            })}
          />
          {errors.lastName && (
            <span className="absolute text-error-background text-xs">
              {errors.lastName.message}
            </span>
          )}
        </div>

        <div className="relative col-span-12">
          <LinedInput
            placeholder="Email/Mobile Number*"
            error={!!errors.email}
            {...register("email", {
              required: "required*",
              pattern: {
                value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
          />
          {errors.email && (
            <span className="absolute text-error-background text-xs">
              {errors.email.message}
            </span>
          )}
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

        <div className="col-span-12 mt-2">
          <Button
            className="bg-button-1 text-white w-full hover:bg-button-hover"
            disabled={isLoading}
          >
            {isLoading ? <Loader color="white" /> : "Register"}
          </Button>
        </div>
      </form>

      <div className="text-center text-sm text-slate-400">
        Already have an account?{" "}
        <Link href="/auth/login">
          <span className="text-primary font-medium">Login</span>
        </Link>
      </div>
    </div>
  );
};

export default Register;
