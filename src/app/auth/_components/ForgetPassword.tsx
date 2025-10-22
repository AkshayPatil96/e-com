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
import { useForgotPasswordMutation } from "@/redux/auth/authApi";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  email: z.string("Required*").email("Invalid email address"),
});

const ForgetPassword = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const [forgotPassword, { isError, isLoading, isSuccess, error }] =
    useForgotPasswordMutation();
  console.log("error: ", error);

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = (data) => {
    console.log(data);
    forgotPassword(data);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Reset link sent successfully");
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
          Forget Password
        </h1>
        <p className="text-label text-sm">
          Enter your email to receive a password reset link.
        </p>
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
      <div className="">
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

export default ForgetPassword;
