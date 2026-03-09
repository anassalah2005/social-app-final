import React, { useContext } from "react";
import Navbar from "../Navbar/Navbar";
import { Outlet } from "react-router-dom";
import SideBar from "./SideBar/SideBar";
import { AuthContext } from "../../Context/AuthContextProvider";  

export default function Layout() {
  const { token } = useContext(AuthContext);
  return (
    <div className="min-h-screen bg-slate-100">
      
      <Navbar />

      <div className="flex">
        {token && <SideBar post={{}} />}

        {/* Main Content */}
        <div {...(token ? { className: "flex-1 ml-64 p-6" } : {className: "flex-1 p-6"})}>
          <Outlet />
        </div>
      </div>

      {/* <Footer /> */}
    </div>
  );
}