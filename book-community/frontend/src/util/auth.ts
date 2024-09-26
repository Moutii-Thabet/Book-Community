import { redirect } from "react-router-dom";

export function getTokenDuration() {
  const expiration: string | null = localStorage.getItem("expiration");
  console.log(expiration);
  const now = Date.now();
  console.log(now);
  const remaining = +expiration! - now;
  return remaining;
}

export function getAuthToken() {
  const token = localStorage.getItem("token");
  if (!token) {
    return null;
  }
  const remaining = getTokenDuration();
  if (remaining < 0) {
    return "EXPIRED";
  }

  return token;
}

export function loader() {
  return getAuthToken();
}

export function checkAuthLoader() {
  const token = getAuthToken();
  if (!token) {
    return redirect("/auth/login");
  }

  return token;
}

export function authLoader() {
  const token = getAuthToken();
  if (token && token !== "EXPIRED") {
    return redirect("/");
  }
  return null;
}
