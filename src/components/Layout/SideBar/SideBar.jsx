import React, { useContext, useEffect, useState } from "react";
import { Card, Button, Avatar } from "@heroui/react";
import {
  Home2,
  Profile,
  Message,
  Setting2,
  Logout,
  Notification,
  Bookmark
} from "iconsax-reactjs";

import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../Context/AuthContextProvider";
import axios from "axios";

import { useQuery } from "@tanstack/react-query";

export default function SideBar(post) {
  const { token , setToken} = useContext(AuthContext);
  const navigate = useNavigate();
  
  const menuItems = [
    { icon: <Home2 size="20" />, label: "Home", path: "/home" },
    { icon: <Notification size="20" />, label: "Notifications", path: "/notifications" },
    { icon: <Bookmark size="20" />, label: "Bookmarks", path: "/bookmarks" },
    { icon: <Profile size="20" />, label: "Profile", path: "/profile" },
    { icon: <Message size="20" />, label: "Messages", path: "#" },
    { icon: <Setting2 size="20" />, label: "Settings", path: "/settings" },
  ];

  // Fetch current user data consistently with Navbar
  const { data: userData } = useQuery({
    queryKey: ['currentUser', token],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/profile-data`, {
        headers: { token }
      });
      return response.data.user || response.data.data?.user || response.data.data;
    },
    enabled: !!token
  });

  function handleLogout() {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  }

  return (
    <div className="h-full flex flex-col justify-between py-2">
      {/* Top Section */}
      <div>
        <div className="space-y-1 mb-6">
          {menuItems.map((item) => (
            <Button
              key={item.label}
              variant="light"
              className="w-full justify-start h-12 px-4 rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-300 group"
              onPress={() => navigate(item.path)}
            >
              <div className="flex items-center gap-4">
                <div className="text-foreground/60 group-hover:text-primary transition-colors">
                  {item.icon}
                </div>
                <span className="font-bold text-sm tracking-tight">{item.label}</span>
              </div>
            </Button>
          ))}
        </div>

        {/* Decorative Divider */}
        <div className="px-4 py-2">
          <div className="h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="space-y-4">
        <div className="p-3 glass bg-white/5 rounded-2xl flex items-center gap-3 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer" onClick={() => navigate("/profile")}>
          <Avatar
            src={userData?.photo || "https://avatar.iran.liara.run/public/30"}
            size="sm"
            className="ring-2 ring-primary/20"
          />
          <div className="overflow-hidden">
            <p className="text-sm font-black truncate">
              {userData?.name || "User"}
            </p>
            <p className="text-[10px] text-foreground/40 truncate font-medium">
              @{userData?.username || "online"}
            </p>
          </div>
        </div>

        <Button
          variant="light"
          className="w-full justify-start h-12 px-4 rounded-xl text-danger hover:bg-danger/10 transition-all group"
          onPress={handleLogout}
        >
          <div className="flex items-center gap-4">
            <Logout size="20" className="group-hover:translate-x-1 transition-transform" />
            <span className="font-bold text-sm">Logout</span>
          </div>
        </Button>
      </div>
    </div>
  );
}