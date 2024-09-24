import { NavLink, useRouteLoaderData, Form } from "react-router-dom";
import { twMerge } from "tailwind-merge";
type Token = string | null;

export default function MainNavigation() {
  const token = useRouteLoaderData("root") as Token;
  const ulClass = "flex my-auto gap-8";
  const navClass = "text-xl text-orange-800 hover:text-red-600";
  return (
    <>
      <header className="sticky top-0">
        <nav className="bg-orange-300 flex w-full justify-between h-20 px-40 ">
          <ul className={ulClass}>
            <li>
              <NavLink
                className={({ isActive }) => {
                  return twMerge(navClass, isActive && "text-red-600");
                }}
                to="/"
              >
                Community
              </NavLink>
            </li>
            {token && (
              <li>
                <NavLink
                  className={({ isActive }) => {
                    return twMerge(navClass, isActive && "text-red-600");
                  }}
                  to="/collection"
                >
                  My Collection
                </NavLink>
              </li>
            )}
          </ul>
          <ul className={ulClass}>
            {!token && (
              <>
                <li>
                  <NavLink
                    className={({ isActive }) => {
                      return twMerge(navClass, isActive && "text-red-600");
                    }}
                    to="/auth/signup"
                  >
                    Signup
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className={({ isActive }) => {
                      return twMerge(navClass, isActive && "text-red-600");
                    }}
                    to="/auth/login"
                  >
                    Login
                  </NavLink>
                </li>
              </>
            )}
            {token && (
              <li>
                <Form action="/auth/logout" method="post">
                  <button className={navClass}>Logout</button>
                </Form>
              </li>
            )}
          </ul>
        </nav>
      </header>
    </>
  );
}
