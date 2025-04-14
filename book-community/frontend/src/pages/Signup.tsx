import AuthForm from "../components/AuthForm";
import { useNavigate } from "react-router-dom";
import type { Inputs } from "../components/AuthForm";
import { useMutation } from "@tanstack/react-query";
import { createUser } from "../util/http";

import toast, { Toaster } from "react-hot-toast";

type CustomError = {
  message: string;
  errorData: {
    type: string;
    value: string | undefined;
    msg: string;
    path: string;
    location: string;
  } | null;
};

export default function SignupPage() {
  const navigate = useNavigate();
  const { mutateAsync } = useMutation({
    mutationFn: createUser,
    onSuccess: (data: string) => {
      console.log(data);
      const message = data.replace(" ", "+");

      navigate("/auth/login?message=" + message);
    },
    onError: (error: CustomError) => {
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
  async function handleSubmit(data: Inputs) {
    await mutateAsync(data);
  }

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{ duration: 5000, className: "text-lg" }}
      />
      <AuthForm authType="Signup" onSubmit={handleSubmit} />
    </>
  );
}
