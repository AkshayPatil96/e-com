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
import { useRegisterMutation } from "@/redux/auth/authApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";
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
  firstName: z.string("Required*"),
  lastName: z.string("Required*"),
  email: z.string("Required*").email({ message: "Invalid email address" }),
  password: z
    .string("Required*")
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

  const form = useForm<Inputs>({
    resolver: zodResolver(formSchema),
  });

  const [toggle, setToggle] = useState(false);

  const togglePassword = () => {
    setToggle(!toggle);
  };

  useEffect(() => {
    if (isSuccess) {
      form.reset();
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
      <div className="col-span-12 flex flex-col gap-1">
        <h1 className="text-3xl text-title font-semibold">
          Create a new account
        </h1>
        <p className="text-label text-sm">
          Enter your details below to create an account.
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-[90%] grid grid-cols-12 justify-center items-center gap-y-2 gap-x-2"
        >
          <div className="relative col-span-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="First Name*"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="relative col-span-6">
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Last Name*"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="relative col-span-12">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Email*"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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

          <div className="col-span-12">
            <Button
              className="w-full"
              disabled={isLoading}
              effect={"ringHover"}
            >
              {isLoading ? <Loader color="white" /> : "Login"}
            </Button>
          </div>
        </form>
      </Form>

      <div className="-mt-2">
        <p className="text-center text-xs text-slate-400">
          {`Already have an account?`}{" "}
          <Link
            href="/auth/login"
            className="text-primary font-medium"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
