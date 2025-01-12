import React, { FC } from "react";

type IStep = {
  id: number;
  title: string;
  description: string;
};
const stepData: IStep[] = [
  { id: 1, title: "Step 1", description: "Basic Information" },
  { id: 2, title: "Step 2", description: "Product Details" },
  { id: 3, title: "Step 3", description: "Media" },
  { id: 4, title: "Step 4", description: "Pricing" },
  { id: 5, title: "Step 5", description: "Inventory" },
  { id: 6, title: "Step 6", description: "Shipping" },
  { id: 7, title: "Step 7", description: "SEO" },
  { id: 8, title: "Step 8", description: "Review" },
];

type Props = {};

const ProductAddForm: FC<Props> = ({}) => {
  return (
    <div className="my-8 border rounded-sm">
      <div className="">
        <StepBar data={stepData} />
      </div>
    </div>
  );
};

type IStepBar = {
  data: IStep[];
};

const StepBar: FC<IStepBar> = ({ data }) => {
  return (
    <div className="flex items-center overflow-x-auto">
      {data.map((step) => (
        <div
          key={step.id}
          className="flex-none w-1/6 relative text-center py-2.5 border-r last:border-r-0 after:border-2 after:border-red-500 after:absolute after:bottom-0 after:left-0 after:w-full"
        >
          <div className="text-sm font-semibold">{step.title}</div>
          <div className="text-xs text-gray-500">{step.description}</div>
        </div>
      ))}
    </div>
  );
};

export default ProductAddForm;
