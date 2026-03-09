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
    <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
      <path
        clipRule="evenodd"
        d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export default function NavBar() {
  const {token , setToken} = useContext(AuthContext)
  const [isMenuOpen, setIsMenuOpen] =useState(false);
  const [myPosts, setMyPosts] = useState(null);
  const router = useNavigate()
  
   function logOut(){
    localStorage.removeItem("token")
    setToken(null)
    router("/login")
   }
async function getMyPosts() {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/posts/feed?only=me`,
      {
        headers: {
          token: token
        }
      }
    );

    setMyPosts(response.data);
  } catch (error) {
    console.error(error);
  }
}
useEffect(() => {
  if(token){
    getMyPosts();
  }
}, [token]);
  const menuItems = [
    "Profile",
  ];

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <AcmeLogo />
          <p className="font-bold text-inherit">Social App</p>
        </NavbarBrand>
      </NavbarContent>

    {token &&<> 
          <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" to="/home">
            Home
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link aria-current="page" to="/profile">
            Profile
          </Link>
        </NavbarItem>
      </NavbarContent>
    </>}
      <NavbarContent justify="end">
        
{! token && (<>
        <NavbarItem className="hidden lg:flex">
          <Link color="foreground" to="/login">Login</Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="primary" to="/register" variant="flat">
            Sign Up
          </Button>
          </NavbarItem>
</> )}
        

      </NavbarContent>

{token && (<>     <Dropdown clas placement="bottom-end">
          <DropdownTrigger >
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="secondary"
              name="Jason Hughes"
              size="sm"
              src={myPosts?.data?.posts[0]?.user?.photo}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">{myPosts?.data?.posts[0]?.user?.name}</p>
            </DropdownItem>
            <DropdownItem key="settings">My Settings</DropdownItem>
            <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
            <DropdownItem onClick={logOut} key="logout" color="danger">
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
</>)}




      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full"
              color={
                index === 2 ? "primary" : index === menuItems.length - 1 ? "danger" : "foreground"
              }
              to ="#"
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}

