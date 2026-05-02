import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Layout from "./components/Layout/Layout";
import Notfound from "./components/Notfound/Notfound";
import Profile from "./pages/Profile/Profile";
import Gard from "./components/Gard/Gard";
import AuthGard from "./components/Gard/AuthGard";
import PostData from "./pages/PostData/PostData";

import Bookmarks from "./pages/Bookmarks/Bookmarks";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import { Toaster } from "react-hot-toast";
import Notifications from "./pages/Notifications/Notifications";
import Settings from "./pages/Settings/Settings";
import Background from "./components/Background/Background";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Gard><Home></Home></Gard> },      // default page "/"
      { path: "/home", element: <Gard><Home></Home></Gard> },     // "/home"
      { path: "/login", element:  <AuthGard><Login></Login></AuthGard> },   // "/login"
      { path: "/register", element: <AuthGard><Register></Register></AuthGard> }, // "/register"
      { path: "/forgot-password", element: <ForgotPassword /> },
      { path: "/profile", element: <Gard><Profile></Profile></Gard> }, // "/profile"
      { path: "/notifications", element: <Gard><Notifications /></Gard> },
      { path: "/bookmarks", element: <Gard><Bookmarks /></Gard> },
      { path: "/settings", element: <Gard><Settings /></Gard> },
      { path: "/PostDetailes/:id", element: <PostData></PostData> },
      { path: '/profile/:id', element: <Gard><Profile></Profile></Gard> },
      { path: '*', element: <Notfound /> } /// 4o4
    ],
  },
]);

export default function App() {
  return (
    <>
      <Background />
      <RouterProvider router={routes} />
      <Toaster position="bottom-right" reverseOrder={false} />
    </>
  );
}
