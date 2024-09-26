import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./util/http.ts";

import RootPage from "./pages/Root.tsx";
import SignupPage from "./pages/Signup.tsx";
import LoginPage from "./pages/Login.tsx";
import { action as logoutAction } from "./pages/Logout.tsx";
import {
  loader as authTokenLoader,
  checkAuthLoader,
  authLoader,
} from "./util/auth.ts";
import ResetPasswordPage from "./pages/ResetPassword.tsx";
import NewPasswordPage, {
  loader as newPasswordLoader,
} from "./pages/NewPassword.tsx";
import CommunityPage from "./pages/Community.tsx";
import CollectionPage from "./pages/Collection.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootPage />,
    id: "root",
    loader: authTokenLoader,
    children: [
      {
        index: true,
        element: <CommunityPage />,
      },
      {
        path:"collection",
        element:<CollectionPage/>,
        loader:checkAuthLoader
      },
      {
        path: "/auth",
        children: [
          {
            path: "signup",
            element: <SignupPage />,
            loader: authLoader,
          },
          {
            path: "login",
            element: <LoginPage />,
            loader: authLoader,
          },
          {
            path: "logout",
            action: logoutAction,
            loader: checkAuthLoader,
          },
          {
            path: "reset",
            element: <ResetPasswordPage />,
            loader: authLoader,
          },
          {
            path: "reset/:resetToken",
            id: "new-password",
            element: <NewPasswordPage />,
            loader: newPasswordLoader,
          },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </>
  );
}

export default App;
