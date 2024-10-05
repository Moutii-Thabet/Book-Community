import { useSearchParams, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { login } from "../util/http";

import AuthForm from "../components/AuthForm";
import type { Inputs } from "../components/AuthForm";
import toast, { Toaster } from "react-hot-toast";
import { useEffect } from "react";

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

export default function LoginPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get("message")) {
      const message = searchParams.get("message");
      toast((t) => {
        return (
          <span>
            <p>{message}</p>

            <button onClick={() => toast.dismiss(t.id)}>Dismiss</button>
          </span>
        );
      });
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const { mutateAsync } = useMutation({
    mutationFn: login,
    onSuccess(data) {
      const { token } = data;
      localStorage.setItem("token", token);
      const expiration = Date.now() + 3600 * 1000;
      localStorage.setItem("expiration", expiration.toString());

      navigate("/?loggedin=true");
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
        toastOptions={{ duration: 5000, className: "mt-20 text-2xl" }}
      />
      <AuthForm authType="Login" onSubmit={handleSubmit} />
    </>
  );
}
