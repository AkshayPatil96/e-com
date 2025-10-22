/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LinedInput from "@/components/ui/LinedInput";
import { Loader } from "@/components/ui/loader";
import { useLoginMutation } from "@/redux/auth/authApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  email: z.string("Required*").email("Invalid email address"),
  password: z
    .string("Required*")
    .min(8, "Password must be at least 8 characters"),
});

const Login = () => {
  const [login, { isSuccess, error, isLoading, data }] = useLoginMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const [toggle, setToggle] = useState(false);

  const togglePassword = () => {
    setToggle(!toggle);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Login Successful");
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

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = (data) =>
    login(data);

  return (
    <div className="h-full flex flex-col justify-between gap-4">
      <div className="col-span-12 flex flex-col gap-1">
        <h1 className="text-3xl text-title font-semibold font-josefin">
          Login
        </h1>
        <p className="text-label text-sm">Enter your details below.</p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-[90%] grid grid-cols-12 mx-auto justify-center items-center gap-y-2 gap-x-8"
        >
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
                      className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
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

            <div className="flex justify-end mt-1">
              <Link
                href="/auth/forgot-password"
                className="text-xs text-label hover:text-primary font-medium hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <div className="col-span-12">
            <Button
              className="w-full"
              effect={"ringHover"}
              disabled={isLoading}
            >
              {isLoading ? <Loader color="white" /> : "Login"}
            </Button>
          </div>
        </form>
      </Form>

      <div className="-mt-2">
        <p className="text-center text-xs text-slate-400">
          {`Don't have an account?`}{" "}
          <Link href="/auth/register">
            <span className="text-primary font-medium">Register</span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
