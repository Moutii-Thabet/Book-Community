import { useEffect } from "react";

import { Outlet, useLoaderData, useSubmit } from "react-router-dom";
import MainNavigation from "../components/MainNavigation";

import { getTokenDuration } from "../util/auth";

export default function RootPage() {
  const token = useLoaderData();
  const submit = useSubmit();
  useEffect(() => {
    if (!token) {
      return;
    }
    if (token === "EXPIRED") {
      console.log("root");
      submit(null);
      return;
    }

    const remainingTime = getTokenDuration();
    console.log(remainingTime);
    setTimeout(() => {
      submit(null);
    }, remainingTime);
  }, [token, submit]);
  return (
    <>
      <MainNavigation />
      <Outlet />
    </>
  );
}
