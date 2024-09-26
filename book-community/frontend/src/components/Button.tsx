import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

type ButtonProps = {
  text: string;
  className?: string;
} & ComponentProps<"button">

export default function Button({ text, className,...props }: ButtonProps) {
  return (
    <button
      className={twMerge(
        " text-xl bg-orange-400 w-3/4 py-4 mx-auto rounded-md",
        className
      )}
      {...props}
    >
      {text}
    </button>
  );
}
