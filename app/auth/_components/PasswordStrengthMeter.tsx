import { Check, X } from "lucide-react";
import React, { FC } from "react";

const PasswordCriteria = ({ password }: { password: string }) => {
  const criteria = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Contains an uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Contains a lowercase letter", met: /[a-z]/.test(password) },
    { label: "Contains a number", met: /\d/.test(password) },
    {
      label: "Contains a special character",
      met: /[^A-Za-z0-9]/.test(password),
    },
  ];

  return (
    <div className="mt-2 space-y-1">
      {criteria.map((item, index) => (
        <div
          key={index}
          className="flex items-center text-xs"
        >
          {item.met ? (
            <Check className="size-4 text-green-500 mr-2" />
          ) : (
            <X className="size-4 text-gray-500 mr-2" />
          )}
          <span className={item?.met ? "text-green-500" : "text-gray-500"}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

type Props = {
  password: string;
};

const PasswordStrengthMeter: FC<Props> = ({ password = "" }) => {
  const getStrength = (pass: string) => {
    let strength = 0;
    if (pass?.length > 7) strength++;
    if (pass?.length > 10) strength++; // New condition for length > 10
    if (pass?.match(/[a-z]/) && pass.match(/[A-Z]/)) strength++;
    if (pass?.match(/\d/)) strength++;
    if (pass?.match(/[^a-zA-Z\d]/)) strength++;
    return strength;
  };

  const strength = getStrength(password);

  const getColor = (strength: number) => {
    // Implementing a gradient based on strength
    switch (strength) {
      case 0:
        return "bg-red-500";
      case 1:
        return "bg-orange-500";
      case 2:
        return "bg-yellow-500";
      case 3:
        return "bg-blue-500";
      case 4:
        return "bg-green-500";
      case 5:
        return "bg-purple-500"; // Updated color for strength 5
      default:
        return "bg-gray-200";
    }
  };

  const strengthText = (strength: number) => {
    switch (strength) {
      case 0:
        return "Very Weak";
      case 1:
        return "Weak";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Strong";
      case 5:
        return "Very Strong"; // New text for strength 5
      default:
        return "Unknown";
    }
  };

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-400">Password Strength</span>
        <span className="text-xs text-gray-400">{strengthText(strength)}</span>
      </div>

      <div className="flex space-x-1">
        {[...Array(5)].map(
          (
            _,
            index, // Changed from Array(4) to Array(5)
          ) => (
            <div
              key={index}
              className={`h-1 w-1/5 rounded-full transition-colors duration-300 ${
                // Changed w-1/4 to w-1/5
                index < strength ? getColor(strength) : "bg-gray-200"
              }`}
            />
          ),
        )}
      </div>
      <PasswordCriteria password={password} />
    </div>
  );
};

export default PasswordStrengthMeter;
