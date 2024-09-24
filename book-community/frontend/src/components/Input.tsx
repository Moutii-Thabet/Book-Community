import type { ComponentProps } from "react";
import { useState, forwardRef } from "react";

import { Icon } from "react-icons-kit";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { eye } from "react-icons-kit/feather/eye";
import type { FieldError } from "react-hook-form";

import { twMerge } from "tailwind-merge";

type InputProps = {
  className?: string;
  type: string;
  label: string;
  id: string;
  error?: FieldError | undefined;
} & ComponentProps<"input">;

export default forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, type, id, className, error, ...props },
  ref
) {
  const [inputType, setInputType] = useState(type);
  const [icon, setIcon] = useState<typeof Icon>(eyeOff);

  function handleToggle() {
    setInputType((prevType) => (prevType === "password" ? "text" : "password"));
    setIcon((prevIcon: typeof Icon) => (prevIcon === eyeOff ? eye : eyeOff));
  }
  return (
    <div className="w-fit flex flex-col gap-4 bg-orange-400/20 px-5 py-5 rounded-lg ">
      <label htmlFor={id} className="font-bold">
        {label}
      </label>
      <div className="w-[29rem] flex focus-within:outline-none  focus-within:ring focus-within:ring-orange-400/70 rounded-md">
        <input
          ref={ref}
          type={inputType}
          id={id}
          {...props}
          className={twMerge(
            "bg-gray-300 w-[30rem] px-6 py-2 rounded-md focus:outline-none focus:ring focus:ring-orange-400/70  ",
            className,
            type === "password" && "w-[27rem] rounded-l-md rounded-r-none"
          )}
        />
        {type === "password" && (
          <span
            className="flex justify-around items-center text-center"
            onClick={handleToggle}
          >
            <Icon
              className="bg-gray-400/85 py-2 px-4 rounded-r-md mx-auto w-fit cursor-pointer"
              size={25}
              icon={icon}
            />
          </span>
        )}
      </div>
      {error && <p className="text-red-500">{`${error.message}`}</p>}
    </div>
  );
});
