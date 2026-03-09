import { useContext, useState, useRef } from "react";
import { Button, Avatar } from "@heroui/react";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContextProvider";
import { useQuery } from "@tanstack/react-query";
import CardStyle from "../../components/CardStyle/CardStyle";
export default function ProfilePage()



{


const {token} = useContext(AuthContext)
      const photoRef = useRef(null);

  const [profileImage, setProfileImage] = useState(
    "https://i.pravatar.cc/150?img=12"
  );
  const [coverImage, setCoverImage] = useState(
    "https://images.unsplash.com/photo-1503264116251-35a269479413"
  );

async function updateProfilePhoto() {
  const file = photoRef.current.files[0];

  if (!file) {
    console.log("Please select a photo");
    return;
  }

  const formData = new FormData();
  formData.append("photo", file);

  try {
    const { data } = await axios.put(
      "https://route-posts.routemisr.com/users/upload-photo",
      formData,
      {
        headers: {
          token: token
        }
      }
    );

    console.log(data);

    // preview update
    setProfileImage(URL.createObjectURL(file));

  } catch (error) {
    console.error(error);
  }
}


function openProfilePicker() {
  photoRef.current.click();
}



async function getMyPosts() {
  try {
    const {data} = await axios.get(
      `${import.meta.env.VITE_API_URL}/posts/feed?only=me`,
      {
        headers: {
          token: token
        }
      }
    );

    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
}

const {isLoading, isError, data} = useQuery({
  queryKey: ["myPosts"],
  queryFn: getMyPosts
  
})

  return (
    <div>
    <div className="min-h-[50px] rounded-3xl bg-gray-200 flex justify-center py-10">
      <div className="w-full max-w-5xl">

        {/* Cover */}
        <div className="relative h-[320px] rounded-2xl overflow-hidden">
          <img
            src={coverImage}
            alt="cover"
            className="w-full h-full object-cover"
          />

          <label className="absolute top-5 right-5">
            <input
              type="file"
              className="hidden"
              accept="image/*"
              
            />
            <Button color="primary" radius="full">
              Update Cover
            </Button>
          </label>
        </div>

        {/* Profile Section */}
        <div className="flex flex-col items-center -mt-16">

          <Avatar
            src={data?.data?.posts[0]?.user?.photo || "User Name"}
            className="w-28 h-28 border-4 border-white"
          />

          <label className="mt-3">
            <input
              type="file"
              className="hidden"
              accept="image/*"
              ref={photoRef}  
              onChange={updateProfilePhoto}
            />
            <Button onPress={openProfilePicker} variant="bordered" radius="full">
              Edit
            </Button>
          </label>

          <h2 className="text-2xl font-semibold mt-4">{data?.data?.posts[0]?.user?.name || "User Name"}</h2>
          <p className="text-gray-500 text-lg">Frontend Developer</p>

        </div>
      </div>
    </div>
<div className="max-w-3xl mx-auto">
  {data?.data?.posts?.map((post) => (
    <CardStyle
      key={post.id}
      post={post}
      comments={post.comments}
    />
  ))}
</div>

    </div>
    
  );
}