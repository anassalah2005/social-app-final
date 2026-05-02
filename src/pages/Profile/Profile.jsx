import { useContext, useState, useRef } from "react";
import { Button, Avatar } from "@heroui/react";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContextProvider";
import CardStyle from "../../components/CardStyle/CardStyle";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export default function ProfilePage() {
  const { token } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const photoRef = useRef(null);

  // Follow Mutation
  const followMutation = useMutation({
    mutationFn: async (userId) => {
      return axios.put(`${import.meta.env.VITE_API_URL}/users/follow`, 
        { following: userId },
        { headers: { token } }
      );
    },
    onSuccess: () => {
      toast.success('Followed user');
      queryClient.invalidateQueries(['myPosts']);
    }
  });

  const [profileImage, setProfileImage] = useState(
    "https://i.pravatar.cc/150?img=12"
  );
  const [coverImage, setCoverImage] = useState(
    "https://images.unsplash.com/photo-1503264116251-35a269479413"
  );

async function updateProfilePhoto() {
  const file = photoRef.current.files[0];

  if (!file) return;

  const formData = new FormData();
  formData.append("photo", file);

  try {
    const { data } = await axios.put(
      `${import.meta.env.VITE_API_URL}/users/upload-photo`,
      formData,
      {
        headers: { 
          token: token,
          Authorization: `Bearer ${token}` // Added standard Bearer header just in case
        }
      }
    );

    if (data.message === "success") {
      toast.success("Profile photo updated!");
      // Invalidate everything related to user data to force a global refresh
      await queryClient.invalidateQueries(); 
      setProfileImage(URL.createObjectURL(file));
    }
  } catch (error) {
    console.error(error);
    toast.error("Failed to update photo");
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
    <div className="space-y-10 pb-20">
      <div className="glass-card overflow-hidden border-none shadow-2xl shadow-primary/5">
        <div className="w-full">
          {/* Cover */}
          <div className="relative h-64 md:h-80 group">
            <img
              src={coverImage}
              alt="cover"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
            
            <label className="absolute top-6 right-6">
              <input
                type="file"
                className="hidden"
                accept="image/*"
              />
              <Button 
                color="primary" 
                radius="full" 
                className="font-bold glass border-white/20 shadow-xl"
                size="sm"
              >
                Change Cover
              </Button>
            </label>
          </div>

          {/* Profile Section */}
          <div className="px-8 pb-10">
            <div className="flex flex-col md:flex-row items-end gap-6 -mt-20 md:-mt-24 relative z-10">
              <div className="relative group">
                <Avatar
                  src={data?.user?.photo || profileImage}
                  className="w-32 h-32 md:w-44 md:h-44 border-8 border-background shadow-2xl"
                />
                <button 
                  onClick={openProfilePicker}
                  className="absolute bottom-2 right-2 bg-primary text-white p-3 rounded-full shadow-lg hover:scale-110 transition-all z-20 hover:bg-primary/90 active:scale-95"
                >
                  <svg fill="none" height="22" viewBox="0 0 24 24" width="22" stroke="currentColor" strokeWidth="2.5">
                    <path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  ref={photoRef}  
                  onChange={updateProfilePhoto}
                />
              </div>

              <div className="flex-1 text-center md:text-left mb-4">
                <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
                  {data?.data?.posts[0]?.user?.name || "User Name"}
                </h2>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2">
                  <span className="text-primary font-bold text-sm bg-primary/10 px-3 py-1 rounded-full">
                    @{data?.user?.username || "username"}
                  </span>
                  <span className="text-foreground/50 font-medium text-sm flex items-center gap-1">
                    <svg fill="none" height="16" viewBox="0 0 24 24" width="16" stroke="currentColor" strokeWidth="2">
                      <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Frontend Developer
                  </span>
                </div>
              </div>

              <div className="flex gap-3 mb-4">
                <Button 
                  color="primary" 
                  radius="xl" 
                  className="font-bold px-8 shadow-lg shadow-primary/20"
                  isLoading={followMutation.isPending}
                  onPress={() => followMutation.mutate(data?.data?.posts[0]?.user?._id)}
                >
                  {followMutation.isSuccess ? 'Following' : 'Follow'}
                </Button>
                <Button variant="flat" radius="xl" className="font-bold glass-card border-none">
                  Message
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        <h3 className="text-xl font-bold px-4 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-primary rounded-full" />
          Recent Posts
        </h3>
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