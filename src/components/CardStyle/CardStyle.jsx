import React, { useContext, useRef } from "react";
import {Card, CardHeader, CardBody, CardFooter, Avatar, Button, User} from "@heroui/react";
import { ExportSquare, Like1, Message } from "iconsax-reactjs";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContextProvider";
import { useMutation, useQueryClient  } from "@tanstack/react-query";
import toast from "react-hot-toast";





export default function CardStyle({post, comments}) {
  const [isFollowed, setIsFollowed] = React.useState(false)
  ;
    const queryClient = useQueryClient();

const navigate = useNavigate();
const {token} = useContext(AuthContext);
const commentRefs = useRef(null)
async function handleComment() {
  const userComment = commentRefs.current.value;
  console.log(userComment);
 const newform = new FormData();
 newform.append("content", userComment);
 return axios.post(import.meta.env.VITE_API_URL +"/posts/"+ post.id + "/comments", newform , {
  headers: {
    token: token,
  },
 })
 
}
const {isPending , mutate} = useMutation({
  mutationFn: handleComment,
  onSuccess : function(data) {
    commentRefs.current.value = "";
    console.log(data);
    toast.success("Comment added successfully");
    queryClient.invalidateQueries(['commentdata', post.id]);
    
  },
    


})


   
  return <>
  {
    <Card key={post.id} className="max-w-3xl my-4 mx-auto">
      <CardHeader className="justify-between">
        <div className="flex gap-5">
          <Avatar
            isBordered
            radius="full"
            size="md"
            src={post?.user?.photo || ""}
          />
          <div className="flex flex-col gap-1 items-start justify-center">
            <h4 className="text-small font-semibold leading-none text-default-600">{post?.user?.name || ""}</h4>
            <h5 onClick={() => navigate(`/PostDetailes/${post.id}`)} className="text-small tracking-tight text-default-400">{post?.createdAt?.split("T")[0] || ""}</h5>
          </div>
        </div>
        <Button
          className={isFollowed ? "bg-transparent text-foreground border-default-200" : ""}
          color="primary"
          radius="full"
          size="sm"
          variant={isFollowed ? "bordered" : "solid"}
          onPress={() => setIsFollowed(!isFollowed)}
        >
          {isFollowed ? "Unfollow" : "Follow"}
        </Button>
      </CardHeader>
      <CardBody className="px-3 py-0 text-small text-default-400">
        <p>{post.body}</p>
        {post.image && <img src={post.image} alt="post image" className="w-full h-auto rounded-lg" />}
      </CardBody>
<CardFooter className="flex flex-col gap-4">
  {/* Reactions Row */}
        <div className="flex justify-between w-full">
    <div className="flex items-center gap-2">
      <Like1 size="20" className="cursor-pointer" color="#2ccce4" />
      like
    </div>

    <div className="flex items-center gap-2">
      <Message size="20" className="cursor-pointer" color="#2ccce4" variant="Outline" />
      comment
    </div>

    <div className="flex items-center gap-2">
      <ExportSquare size="20" className="cursor-pointer" color="#2ccce4" variant="Outline" />
      share
    </div>
  </div>

        <div   className=" w-full flex justify-center items-center">
          <input type="text" placeholder="write your comment" ref={commentRefs} className="border border-gray-300 rounded-lg p-2 w-full " />
          <Button disabled={isPending} onPress={mutate} className=" justify-center p-5 mx-1" size="sm"  color="primary">{isPending ? "sending" : "Comment"}</Button>
        </div>

  {/* Comments Section (TOP) */}
{ post.topComment && (
  <div className="flex comments w-full">
    <div className="bg-gray-300 p-3 rounded-2xl w-full">
      <User
        avatarProps={{
          src: post.topComment.commentCreator.photo,
        }}
        name={post.topComment.commentCreator.name}
      />
      <p>
        {post.topComment.content}
      </p>
    </div>
  </div>
)}


{ comments?.map((comment)=>
  <div key={comment.id} className="flex comments w-full">
    <div className="bg-gray-300 p-3 rounded-2xl w-full">
      <User
        avatarProps={{
          src: comment.commentCreator.photo,
        }}
        name={  comment.commentCreator.name}
      />
      <p>
        {comment.content}
      </p>
    </div>
  </div>
)}



</CardFooter>
      
    </Card>


}
  
  </>

  ;
}

