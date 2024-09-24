import { twMerge } from "tailwind-merge";

type ButtonProps = {
  text: string;
  className?: string;
};

export default function Button({ text, className }: ButtonProps) {
  return (
    <button
      className={twMerge(
        " text-xl bg-orange-400 w-3/4 py-4 mx-auto rounded-md",
        className
      )}
    >
      {text}
    </button>
  );
}
