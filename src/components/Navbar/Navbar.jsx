import React, { useEffect } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,

  Button,
  Dropdown,
  DropdownTrigger,
  Avatar,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContextProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export const AcmeLogo = () => {
  return (
    <svg fill="none" height="36" viewBox="0 0 24 24" width="36" stroke="currentColor" strokeWidth="2.5">
      <path d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9s2.015-9 4.5-9m0 18c-5.035 0-9.117-3.676-9.332-8.462a9 9 0 0118.664 0C21.117 17.324 17.035 21 12 21zm0-18c5.035 0 9.117 3.676 9.332 8.462a9 9 0 01-18.664 0C2.883 6.676 6.965 3 12 3z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

export default function NavBar() {
  const {token , setToken} = useContext(AuthContext)
  // Fetch current user data for navbar
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

  const menuItems = [
    { name: "Home", path: "/home" },
    { name: "Profile", path: "/profile" },
    { name: "Notifications", path: "/notifications" },
    { name: "Bookmarks", path: "/bookmarks" },
  ];

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useNavigate();

  function logOut() {
    localStorage.removeItem("token");
    setToken(null);
    router("/login");
  }

  return (
    <Navbar 
      onMenuOpenChange={setIsMenuOpen} 
      maxWidth="xl" 
      className="glass border-b border-white/10 py-2 sticky top-0 z-50"
      isBlurred={true}
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand className="gap-2 cursor-pointer" onClick={() => router("/home")}>
          <div className="w-10 h-10 bg-linear-to-tr from-primary to-accent rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30 rotate-3 group-hover:rotate-0 transition-transform">
            <AcmeLogo />
          </div>
          <p className="font-black text-2xl tracking-tighter text-foreground hidden sm:block">
            SOCIAL<span className="text-primary">HUB</span>
          </p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden md:flex gap-4" justify="center">
        <div className="relative w-full max-w-sm group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-foreground/30 group-focus-within:text-primary transition-colors">
            <svg fill="none" height="18" viewBox="0 0 24 24" width="18" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <input 
            type="text" 
            placeholder="Search creators, posts..." 
            className="m-0 bg-white/10 dark:bg-black/20 border-white/10 pl-10 pr-4 py-2 w-full text-sm font-medium hover:bg-white/20 transition-all rounded-xl focus:ring-2 focus:ring-primary/40 focus:bg-background"
          />
        </div>
      </NavbarContent>

      <NavbarContent justify="end" className="gap-4">
        {!token ? (
          <>
            <NavbarItem className="hidden lg:flex">
              <Link className="text-sm font-bold text-foreground/70 hover:text-primary transition-colors" to="/login">Login</Link>
            </NavbarItem>
            <NavbarItem>
              <Button 
                as={Link} 
                className="bg-linear-to-r from-primary to-accent text-white font-black shadow-xl shadow-primary/20" 
                to="/register" 
                variant="solid"
                radius="xl"
              >
                Join Now
              </Button>
            </NavbarItem>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <Button isIconOnly variant="light" radius="full" className="text-foreground/60 hover:text-primary">
               <svg fill="none" height="24" viewBox="0 0 24 24" width="24" stroke="currentColor" strokeWidth="2">
                 <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeLinecap="round" strokeLinejoin="round"/>
               </svg>
            </Button>
            
            <Dropdown placement="bottom-end" className="glass-card border-none min-w-[240px]">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform ring-2 ring-primary/20 hover:scale-105"
                  color="primary"
                  size="md"
                  src={userData?.photo || "https://avatar.iran.liara.run/public/30"}
                  name={userData?.name}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat" className="p-2">
                <DropdownItem key="profile_header" className="h-16 gap-2 opacity-100 cursor-default bg-primary/5 rounded-2xl mb-2">
                  <div className="flex flex-col">
                    <p className="font-black text-sm text-primary">{userData?.name}</p>
                    <p className="text-xs text-foreground/50">@{userData?.username || 'user'}</p>
                  </div>
                </DropdownItem>
                <DropdownItem key="profile" onClick={() => router("/profile")} className="rounded-xl font-bold py-3">
                  View Profile
                </DropdownItem>
                <DropdownItem key="settings" className="rounded-xl font-medium">Account Settings</DropdownItem>
                <DropdownItem key="help" className="rounded-xl font-medium">Help Center</DropdownItem>
                <DropdownItem 
                  onClick={logOut} 
                  key="logout" 
                  className="text-danger rounded-xl bg-danger/5 hover:bg-danger/10 font-bold mt-2"
                >
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        )}
      </NavbarContent>

      <NavbarMenu className="glass pt-6">
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.name}-${index}`}>
            <Link
              className="w-full text-xl font-bold py-2 text-foreground hover:text-primary transition-colors"
              to={item.path}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}

