import React, { useContext, useEffect, useState } from "react";
import { Card, Button, Avatar } from "@heroui/react";
import {
  Home2,
  Profile,
  Message,
  Setting2,
  Logout,
} from "iconsax-reactjs";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../Context/AuthContextProvider";




export default function SideBar(post) {
  const { token , setToken} = useContext(AuthContext);
  const menuItems = [
    { icon: <Home2 size="20" />, label: "Home" },
    { icon: <Profile size="20" />, label: "Profile" },
    { icon: <Message size="20" />, label: "Messages" },
    { icon: <Setting2 size="20" />, label: "Settings" },
  ];
  const [myPosts, setMyPosts] = useState(null);
const navigate = useNavigate();
  function handleLogout() {
     localStorage.removeItem("token");
     setToken(null);
    navigate("/login");
  }
  console.log(post);
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

  return (
    <Card className="fixed top-0 left-0 h-screen w-64 rounded-none border-r bg-white shadow-sm flex flex-col justify-between">
      
      {/* Top */}
      <div>
        <div className="p-6 flex items-center gap-3">
=
          <h1 className="text-lg font-semibold">
            Social App
          </h1>
        </div>

        <div className="px-3">
          {menuItems.map((item) => (
            <Button
              key={item.label}
              variant="light"
              className="w-full justify-start mb-2 text-blue-600"
            >
              <div className="flex items-center gap-3">
                {item.icon}
                {item.label}
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-3 mb-4">
          <Avatar
            src={myPosts?.data?.posts[0]?.user?.photo}
            size="sm"
          />
          <div>
            <p className="text-sm font-medium text-blue-700">
              {myPosts?.data?.posts[0]?.user?.name}
            </p>
            <p className="text-xs text-default-400">
              {myPosts?.data?.posts[0]?.user?.email || "anassalah285@gmail.com"}
            </p>
          </div>
        </div>

        <Button
          variant="light"
          className="w-full justify-start text-red-500"
          onPress={handleLogout}
        >
          <div className="flex items-center gap-3">
            <Logout size="20" />
            Logout
          </div>
        </Button>
      </div>
    </Card>
  );
}