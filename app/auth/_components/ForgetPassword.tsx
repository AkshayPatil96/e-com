"use client";

import { Button } from "@/components/ui/button";
import LinedInput from "@/components/ui/LinedInput";
import { Loader } from "@/components/ui/loader";
import { useForgotPasswordMutation } from "@/redux/auth/authApi";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email(),
});

type Props = {};

const ForgetPassword: FC<Props> = ({}) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof formSchema>>({
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
              Forget Password
            </span>
          </h1>
          <p className="text-label text-sm">
            Enter your email to receive a password reset link.
          </p>
        </div>
        <div className="relative col-span-12">
          <LinedInput
            placeholder="Email*"
            error={errors.email ? true : false}
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
              {errors?.email?.message}
            </span>
          )}
        </div>
        <div className="col-span-12">
          <Button
            className="bg-button-1 text-white 
          w-full hover:bg-button-hover"
            disabled={isLoading}
          >
            {isLoading ? <Loader color="white" /> : "Send Reset Link"}
          </Button>
        </div>
      </form>

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
