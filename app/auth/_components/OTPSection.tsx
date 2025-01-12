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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import LinedInput from "@/components/ui/LinedInput";
import { Loader } from "@/components/ui/loader";
import { useActivationMutation } from "@/redux/auth/authApi";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { FC, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { z } from "zod";

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

type Props = {};

const OTPSection: FC<Props> = ({}) => {
  const router = useRouter();
  const { token, page, registerData } = useSelector((state: any) => ({
    token: state.auth.token,
    page: state.auth.page,
    registerData: state.auth.register,
  }));
  console.log("page: ", page);
  console.log("registerData: ", registerData);
  const [activation, { isSuccess, error, isLoading }] = useActivationMutation();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const [invalidError, setInvalidError] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Account Verified Successfully");
      router.push("/");
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
        setInvalidError(false);
      } else {
        toast.error("An error occured: ", error as any);
        setInvalidError(false);
      }
    }
  }, [isSuccess, error]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    await activation({
      activationCode: data?.pin,
      activationToken: token,
    });
  }

  const handleChange = () => {
    router.push("/auth/register");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-[90%] grid grid-cols-12 mx-auto justify-center items-center gap-y-6 gap-x-8"
      >
        <div className="col-span-12 flex flex-col gap-1">
          <h1>
            <span className="text-3xl text-title font-semibold font-josefin">
              One-Time Password
            </span>
          </h1>
          <p className="text-label text-sm">
            Please enter the one-time password sent to {registerData?.email}.{" "}
            <Button
              type="button"
              variant={"link"}
              onClick={handleChange}
              className="text-primary font-medium p-0"
            >
              Change
            </Button>
          </p>
        </div>
        <div className="relative col-span-12">
          <FormField
            control={form.control}
            name="pin"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <InputOTP
                    maxLength={6}
                    {...field}
                    containerClassName="w-full justify-center"
                  >
                    <InputOTPGroup>
                      <InputOTPSlot
                        index={0}
                        autoFocus
                      />
                    </InputOTPGroup>
                    <InputOTPSeparator> </InputOTPSeparator>
                    <InputOTPGroup>
                      <InputOTPSlot index={1} />
                    </InputOTPGroup>
                    <InputOTPSeparator> </InputOTPSeparator>
                    <InputOTPGroup>
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator> </InputOTPSeparator>
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                    </InputOTPGroup>
                    <InputOTPSeparator> </InputOTPSeparator>
                    <InputOTPGroup>
                      <InputOTPSlot index={4} />
                    </InputOTPGroup>
                    <InputOTPSeparator> </InputOTPSeparator>
                    <InputOTPGroup>
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage className="text-center" />
              </FormItem>
            )}
          />
        </div>

        <div className="col-span-12">
          <Button
            type="submit"
            className="bg-button-1 text-white w-full hover:bg-button-hover"
            disabled={isLoading}
          >
            {isLoading ? <Loader color="white" /> : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default OTPSection;
