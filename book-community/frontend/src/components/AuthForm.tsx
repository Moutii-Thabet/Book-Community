import { useForm } from "react-hook-form";

import { Link } from "react-router-dom";

import Input from "../components/Input";
import Main from "./Main";

import { twMerge } from "tailwind-merge";

export type Inputs = {
  name?: string;
  email: string;
  password: string;
  confirmPassword?: string;
};

type FormProps = {
  onSubmit: (data: Inputs) => void;
  authType: string;
};

export default function AuthForm({ authType, onSubmit }: FormProps) {
  const inputClass = "";
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<Inputs>();

  return (
    <>
      <Main>
        <div
          className={twMerge(
            "w-fit mx-auto pt-10 ",
            authType === "Login" && "pt-[12rem]"
          )}
        >
          <form
            className="bg-orange-300 text-xl flex flex-col gap-6 px-12 py-12 rounded-lg border-2 border-solid border-slate-950 shadow-lg shadow-gray-800"
            onSubmit={handleSubmit(onSubmit)}
          >
            <h1 className="w-fit mx-auto text-3xl font-bold">
              {authType === "Signup" ? "Create an account" : "Login"}
            </h1>
            {authType === "Signup" && (
              <Input
                {...register("name", {
                  required: "The Name field is required.",
                  minLength: {
                    value: 2,
                    message: "Name field must be at least 2 characters long.",
                  },
                })}
                label="Username"
                id="name"
                type="text"
                placeholder="Username"
                className={inputClass}
                error={errors.name}
              />
            )}

            <Input
              {...register("email", {
                required: "The Email field is required.",
              })}
              label="Email"
              id="email"
              type="email"
              placeholder="Email"
              className={inputClass}
              error={errors.email}
            />

            <Input
              {...register("password", {
                required: "The Password field is required.",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters long.",
                },
              })}
              label="Password"
              id="password"
              type="password"
              placeholder="Password"
              className={inputClass}
              error={errors.password}
            />

            {authType === "Signup" && (
              <Input
                {...register("confirmPassword", {
                  required: "The Confirm Password field is required",
                  validate: (value) =>
                    value === getValues("password") || "Passwords must match.",
                })}
                label="Confirm Password"
                id="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                className={inputClass}
                error={errors.confirmPassword}
              />
            )}

            <button
              className={twMerge(
                "bg-orange-400 w-3/4 py-4 mx-auto rounded-md disabled:cursor-not-allowed disabled:bg-gray-500",
                isSubmitting && "bg-gray-400/90"
              )}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : authType}
            </button>
            {authType === "Signup" && (
              <p className="w-fit mx-auto mb-0">
                Already have an account?{" "}
                <Link className="text-sky-700" to="/auth/login">
                  Login
                </Link>{" "}
              </p>
            )}

            {authType === "Login" && (
              <p className="w-fit mx-auto mb-0">
                New here?{" "}
                <Link className="text-sky-700" to="/auth/signup">
                  Signup
                </Link>{" "}
              </p>
            )}
            {authType === "Login" && (
              <p className="w-fit mx-auto mb-0 text-sm">
                Forgot Password? Reset it{" "}
                <Link className="text-sky-700" to="/auth/reset">
                  Here
                </Link>{" "}
              </p>
            )}
          </form>
        </div>
      </Main>
    </>
  );
}
