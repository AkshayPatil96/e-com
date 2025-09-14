"use client";

import { Button } from "@/components/ui/button";
import LinedInput from "@/components/ui/LinedInput";
import { Loader } from "@/components/ui/loader";
import { useLoginMutation } from "@/redux/auth/authApi";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type Inputs = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

type Props = {};

const Login: FC<Props> = ({}) => {
  const [login, { isSuccess, error, isLoading, data }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const [toggle, setToggle] = useState(false);

  const togglePassword = () => {
    setToggle(!toggle);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Login Successful");
      reset();
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
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-[90%] grid grid-cols-12 mx-auto justify-center items-center gap-y-6 gap-x-8"
      >
        <div className="col-span-12 flex flex-col gap-1">
          <h1>
            <span className="text-3xl text-title font-semibold font-josefin">
              Login
            </span>
          </h1>
          <p className="text-label text-sm">Enter your details below.</p>
        </div>
        <div className="relative col-span-12">
          <LinedInput
            placeholder="Email/Mobile Number*"
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
        <div className="relative col-span-12">
          <LinedInput
            placeholder="Password*"
            type={toggle ? "text" : "password"}
            togglePassword={togglePassword}
            error={errors.password ? true : false}
            {...register("password", { required: "required*" })}
          />
          {errors.password && (
            <span className="absolute text-error-background text-xs">
              {errors?.password?.message}
            </span>
          )}
          <div className="text-right">
            <Link
              href={"/auth/forgot-password"}
              passHref
              className="text-xs text-button-hover"
            >
              Forgot Password?
            </Link>
          </div>
        </div>
        <div className="col-span-12">
          <Button
            className="bg-button-1 text-white w-full hover:bg-button-hover"
            disabled={isLoading}
          >
            {isLoading ? <Loader color="white" /> : "Login"}
          </Button>
        </div>
      </form>

      <div className="">
        <p className="text-center text-sm text-slate-400">
          <span>
            Don't have an account?{" "}
            <Link href="/auth/register">
              <span className="text-primary font-medium">Register</span>
            </Link>
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
