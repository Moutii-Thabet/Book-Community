import Input from "../components/Input";
import Main from "../components/Main";
import { twMerge } from "tailwind-merge";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "../util/http";

type CustomError = {
  message: string;
  errorData:
    | {
        type: string;
        value: string | undefined;
        msg: string;
        path: string;
        location: string;
      }[]
    | null;
};

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<{ email: string }>();

  const { mutateAsync } = useMutation({
    mutationFn: resetPassword,
    onSuccess: (data: string) => {
      const message = data.replace(" ", "+");
      navigate("/auth/login?message=" + message);
    },
    onError(error: CustomError) {
      if (error.errorData) {
        toast((t) => {
          return (
            <span className="flex flex-col gap-2">
              {error.errorData!.map((error) => (
                <p className="text-red-600">{error.msg}</p>
              ))}

              <button onClick={() => toast.dismiss(t.id)}>Dismiss</button>
            </span>
          );
        });
      } else {
        toast((t) => {
          return (
            <span>
              <p className="text-red-600">{error.message}</p>

              <button onClick={() => toast.dismiss(t.id)}>Dismiss</button>
            </span>
          );
        });
      }
    },
  });

  async function onSubmit(data: { email: string }) {
    console.log(data);
    await mutateAsync(data);
  }
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{ duration: 5000, className: "text-lg" }}
      />
      <Main>
        <div className={twMerge("w-fit mx-auto pt-16  h-fit")}>
          <form
            className="bg-orange-300 text-xl flex flex-col gap-6 px-12 py-16 rounded-lg border-2 border-solid border-slate-950 shadow-lg shadow-gray-800"
            onSubmit={handleSubmit(onSubmit)}
          >
            <h2 className="w-fit mx-auto font-bold">
              Enter you Email to reset password
            </h2>
            <Input
              {...register("email", {
                required: "The Email field is required.",
              })}
              label="Email"
              id="email"
              type="email"
              placeholder="Email"
            />
            {errors.email && (
              <p className="text-red-500">{`${errors.email.message}`}</p>
            )}
            <button
              className={twMerge(
                "bg-orange-400 w-3/4 py-4 mx-auto rounded-md disabled:cursor-not-allowed disabled:bg-gray-500",
                isSubmitting && "bg-gray-400/90"
              )}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Send Email"}
            </button>
          </form>
        </div>
      </Main>
    </>
  );
}
