"use client";

import React, { FC, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

type Props = {};

type FormValues = {
  firstName: string;
  lastName: string;
};

const FormLayout: FC<Props> = ({}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const [step, setStep] = useState(1);

  const totalSteps = 2;

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    if (step < totalSteps) {
      setStep((prev) => prev + 1);
    } else {
      console.log(data);
    }
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {step === 1 && (
        <>
          <input
            {...register("firstName", { required: true })}
            placeholder="First Name"
          />
          {errors.firstName && <span>First name is required</span>}
        </>
      )}
      {step === 2 && (
        <>
          <input
            {...register("lastName", { required: true })}
            placeholder="Last Name"
          />
          {errors.lastName && <span>Last name is required</span>}
        </>
      )}

      <div>
        {step > 1 && (
          <button
            type="button"
            onClick={handleBack}
          >
            Back
          </button>
        )}
        <button type="submit">{step === totalSteps ? "Submit" : "Next"}</button>
      </div>
    </form>
  );
};

export default FormLayout;
