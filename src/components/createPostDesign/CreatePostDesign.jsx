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
      <Button
        className=" w-8/12 bg-gray-200 flex justify-self-center items-center hover:bg-gray-300 cursor-pointer hover:scale-105 transition-transform duration-200 text-lg font-semibold "
        onPress={onOpen}
      >
        Create Post
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create Post
              </ModalHeader>

              <ModalBody>
                <div>
                  <textarea
                    ref={textRef}
                    name="post"
                    id="post"
                    placeholder="What's on your mind?"
                    className="w-full h-24 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  ></textarea>

                  <input
                    ref={fileRef}
                    onChange={imageVlaue}
                    className="mt-2 hidden"
                    id="postImage"
                    type="file"
                  />

                  <label
                    htmlFor="postImage"
                    className="cursor-pointer text-blue-500 hover:text-2xl transition-all duration-200"
                  >
                    Add Image
                  </label>
                </div>

                {postImage && (
                  <div className="relative">
                    <button
                      className=" bg-red-500 text-white px-2 py-1 rounded-full absolute top-2 right-2 cursor-pointer"
                      onClick={clearImage}
                    >
                      X
                    </button>

                    <img
                      className="w-full rounded-3xl mt-2"
                      src={postImage}
                      alt=""
                    />
                  </div>
                )}
              </ModalBody>

              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>

                <Button color="primary" onClick={() => mutate()} isLoading={isPending}>
                  {isPending ? "Creating..." : "Create"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}