import type { ComponentProps } from "react";
import { forwardRef } from "react";

import type { FieldError } from "react-hook-form";

import { twMerge } from "tailwind-merge";

type InputProps = {
  className?: string;
  type: string;
  label?: string;
  id?: string;
  error?: FieldError | undefined;
} & ComponentProps<"input">;

export default forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, type, id, className, error, ...props },
  ref
) {
  return (
    <div className="w-fit flex flex-col gap-4 bg-orange-400/20 px-5 py-5 rounded-lg ">
      {label && (
        <label htmlFor={id} className="font-bold">
          {label}
        </label>
      )}
      <div className="w-[29rem] flex focus-within:outline-none  focus-within:ring focus-within:ring-orange-400/70 rounded-md">
        <input
          ref={ref}
          type={type}
          id={id}
          {...props}
          className={twMerge(
            "bg-gray-300 w-[30rem] px-6 py-2 rounded-md focus:outline-none focus:ring focus:ring-orange-400/70  ",
            className,
            type === "password" && "w-[27rem] rounded-l-md rounded-r-none"
          )}
        />
      </div>
      {error && <p className="text-red-500">{`${error.message}`}</p>}
    </div>
  );
});
