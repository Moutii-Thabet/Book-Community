import { twMerge } from "tailwind-merge";

type MainProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Main({ children, className }: MainProps) {
  return (
    <main
      className={twMerge(
        "h-dvh bg-gradient-to-b from-orange-200 to-orange-400 text-black pb-10 ",
        className
      )}
    >
      {children}
    </main>
  );
}
