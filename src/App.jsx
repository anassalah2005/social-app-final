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

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Gard><Home></Home></Gard> },      // default page "/"
      { path: "/home", element: <Gard><Home></Home></Gard> },     // "/home"
      { path: "/login", element:  <AuthGard><Login></Login></AuthGard> },   // "/login"
      { path: "/register", element: <AuthGard><Register></Register></AuthGard> }, // "/register"
      { path: "/profile", element: <Gard><Profile></Profile></Gard> }, // "/profile"
      {path:"/PostDetailes/:id", element: <PostData></PostData>},
      {path: '/profile/:id', element: <Gard><Profile></Profile></Gard>},
      {path:'*',element:<Notfound/>} /// 4o4
    ],
  },
]);

export default function App() {
  return <RouterProvider router={routes} />;
}
