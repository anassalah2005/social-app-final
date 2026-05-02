import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import { useContext, useRef, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContextProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export default function CreatePostDesign() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { token } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const textRef = useRef(null);
  const fileRef = useRef(null);

  const [postImage, setPostImage] = useState(null);

  function imageVlaue() {
    const imageData = fileRef.current.files[0];

    if (!imageData) return;

    console.log(imageData);
    const imageUrl = URL.createObjectURL(imageData);
    console.log(imageUrl);
    setPostImage(imageUrl);
  }

  function clearImage() {
    setPostImage(null);
    fileRef.current.value = "";
  }

  function createPost() {
    const postImageFile = fileRef.current.files[0];
    const createdpost = textRef.current.value;

    const formData = new FormData();
    

    if (createdpost) {
      formData.append("body", createdpost);
    }

    if (postImageFile) {
      formData.append("image", postImageFile);
    }

    return axios.post(import.meta.env.VITE_API_URL + "/posts", formData, {
      headers: {
        token: token,
      },
    });
  }

  const { isPending, mutate } = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      console.log("Post created successfully");
      onOpenChange(false)
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success("Post created successfully");
    },
    onError: (error) => {
      console.log("Error creating post", error);
      toast.error("Error creating post");
    },
  });

  return (
    <>
      <div className="flex justify-center w-full mb-8">
        <Button
          className="w-full max-w-3xl glass-card h-16 flex justify-start items-center px-6 hover:bg-white/40 dark:hover:bg-white/10 transition-all duration-300 group border-none"
          onPress={onOpen}
          variant="flat"
        >
          <div className="flex items-center gap-4 w-full">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <svg fill="none" height="20" viewBox="0 0 24 24" width="20" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 5v14m-7-7h14" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-foreground/60 font-medium text-base">What's on your mind?</span>
          </div>
        </Button>
      </div>

      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        className="glass-card border-none"
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-xl font-bold">
                Create Post
              </ModalHeader>

              <ModalBody className="py-4">
                <div className="space-y-4">
                  <textarea
                    ref={textRef}
                    name="post"
                    id="post"
                    placeholder="Share something with the world..."
                    className="w-full h-32 p-4 bg-white/5 dark:bg-black/10 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none text-base"
                  ></textarea>

                  <input
                    ref={fileRef}
                    onChange={imageVlaue}
                    className="hidden"
                    id="postImage"
                    type="file"
                    accept="image/*"
                  />

                  <label
                    htmlFor="postImage"
                    className="flex items-center gap-2 cursor-pointer text-primary font-bold hover:text-primary/80 transition-colors p-2 rounded-xl hover:bg-primary/10 w-fit"
                  >
                    <svg fill="none" height="20" viewBox="0 0 24 24" width="20" stroke="currentColor" strokeWidth="2">
                      <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Add Photos
                  </label>
                </div>

                {postImage && (
                  <div className="relative mt-4 rounded-2xl overflow-hidden group">
                    <button
                      className="bg-black/50 hover:bg-red-500 text-white p-1.5 rounded-full absolute top-2 right-2 z-10 backdrop-blur-md transition-colors"
                      onClick={clearImage}
                    >
                      <svg fill="none" height="16" viewBox="0 0 24 24" width="16" stroke="currentColor" strokeWidth="3">
                        <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>

                    <img
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-700"
                      src={postImage}
                      alt="Preview"
                    />
                  </div>
                )}
              </ModalBody>

              <ModalFooter className="border-t border-white/10 mt-2">
                <Button variant="light" onPress={onClose} className="font-bold">
                  Cancel
                </Button>

                <Button 
                  color="primary" 
                  onClick={() => mutate()} 
                  isLoading={isPending}
                  className="font-bold px-8 shadow-lg shadow-primary/30"
                  radius="xl"
                >
                  {isPending ? "Sharing..." : "Share Post"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}