import React, { useRef, useState, useContext, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Button,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Textarea,
  Divider,
  ScrollShadow
} from "@heroui/react";
import {
  Heart,
  MessageText,
  ExportSquare,
  More,
  Edit,
  Trash,
  TickCircle,
  Send,
  MessageAdd
} from "iconsax-reactjs";
import axios from "axios";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../Context/AuthContextProvider";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";

export default function CardStyle({ post, comments: propComments }) {
  const { token } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const commentRefs = useRef();
  const replyRef = useRef();
  const [activeReplyId, setActiveReplyId] = useState(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [editBody, setEditBody] = useState(post?.body || "");

  const postId = post?._id || post?.id;
  const isPostDetailsPage = location.pathname.includes("/PostDetailes");

  // Get current user data
  const { data: currentUser } = useQuery({
    queryKey: ['currentUser', token],
    queryFn: async () => {
      if (!token) return null;
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/profile-data`, {
        headers: { token: token }
      });
      return response.data.user || response.data.data?.user || response.data.data;
    },
    enabled: !!token
  });

  // Fetch Comments
  const { data: fetchedComments, isLoading: isLoadingComments } = useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      if (!postId) return [];
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${postId}/comments?page=1&limit=10`, {
        headers: { token: token }
      });
      return response.data.comments || response.data.data || [];
    },
    enabled: !!token && !!postId && !propComments
  });

  const commentsList = propComments || fetchedComments || [];
  const firstComment = commentsList[0];
  const isOwnPost = currentUser?._id === (post?.user?._id || post?.user?.id || post?.user);

  // Mutations
  const likeMutation = useMutation({
    mutationFn: async () => {
      return axios.put(`${import.meta.env.VITE_API_URL}/posts/${postId}/like`, {}, {
        headers: { token: token }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
      queryClient.invalidateQueries(['postdata', postId]);
      toast.success("Action Done!");
    }
  });

  const bookmarkMutation = useMutation({
    mutationFn: async () => {
      return axios.put(`${import.meta.env.VITE_API_URL}/posts/${postId}/bookmark`, {}, {
        headers: { token: token }
      });
    },
    onSuccess: () => {
      toast.success("Saved!");
      queryClient.invalidateQueries(['bookmarks']);
    }
  });

  const commentMutation = useMutation({
    mutationFn: async (content) => {
      return axios.post(`${import.meta.env.VITE_API_URL}/posts/${postId}/comments`, 
        { content },
        { headers: { token: token } }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', postId]);
      queryClient.invalidateQueries(['commentdata', postId]);
      queryClient.invalidateQueries(['posts']);
      toast.success("Commented!");
      if (commentRefs.current) commentRefs.current.value = "";
    }
  });

  // Reply Mutation - Pattern: POST /posts/comments/${commentId}/replies
  const replyMutation = useMutation({
    mutationFn: async ({ commentId, content }) => {
      // Using FormData as requested in the screenshot
      const formData = new FormData();
      formData.append("content", content);
      
      return axios.post(`${import.meta.env.VITE_API_URL}/posts/comments/${commentId}/replies`, 
        formData,
        { headers: { token: token } }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', postId]);
      toast.success("Reply added!");
      setActiveReplyId(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || "Reply failed")
  });

  async function handleComment() {
    const userComment = commentRefs.current.value;
    if (!userComment || !token || !postId) return;
    commentMutation.mutate(userComment);
  }

  async function handleReply(commentId) {
    const replyText = replyRef.current.value;
    if (!replyText || !token) return;
    replyMutation.mutate({ commentId, content: replyText });
  }

  return (
    <Card className="w-full glass-card border-none shadow-2xl shadow-primary/5 rounded-[2.5rem] overflow-hidden mb-6">
      <CardHeader className="justify-between px-6 pt-6">
        <div className="flex gap-4">
          <Avatar
            isBordered radius="full" size="md"
            src={post?.user?.photo || `https://avatar.iran.liara.run/username?username=${post?.user?.name}`}
            className="ring-2 ring-primary/30"
          />
          <div className="flex flex-col gap-0.5 items-start justify-center">
            <h4 className="text-sm font-black leading-none text-foreground flex items-center gap-1">
              {post?.user?.name}
              <TickCircle size="14" variant="Bold" className="text-primary" />
            </h4>
            <h5 className="text-[10px] tracking-tight font-bold text-foreground/40 italic">
              {post?.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Just now'}
            </h5>
          </div>
        </div>
      </CardHeader>

      <CardBody className="px-6 py-4 text-sm font-medium text-foreground/80 leading-relaxed">
        <p className="whitespace-pre-wrap">{post?.body}</p>
        {post?.image && (
          <div className="mt-4 rounded-[2rem] overflow-hidden border border-white/10">
            <img src={post.image} alt="post" className="w-full object-cover max-h-[500px]" />
          </div>
        )}
      </CardBody>

      <CardFooter className="flex-col gap-4 px-6 pb-6 pt-2">
        <div className="flex items-center justify-between w-full">
          <div className="flex gap-4">
            <Button variant="light" startContent={<Heart size="22" color="#ff4d4d" variant="Bold" />} className="font-black text-sm" onPress={() => likeMutation.mutate()}>
              {post?.likesCount || 0}
            </Button>
            <Button variant="light" startContent={<MessageText size="22" className="text-primary" />} className="font-black text-sm" onPress={() => !isPostDetailsPage && navigate(`/PostDetailes/${postId}`)}>
              {post?.commentsCount || 0}
            </Button>
          </div>
          <Button variant="light" isIconOnly isLoading={bookmarkMutation.isPending} onPress={() => bookmarkMutation.mutate()}>
            <svg fill="none" height="20" viewBox="0 0 24 24" width="20" stroke="currentColor" strokeWidth="2">
              <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Button>
        </div>

        {/* Featured Comment Preview */}
        {!isPostDetailsPage && firstComment && (
          <div className="w-full mt-2">
            <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none border border-white/5 flex gap-2 items-center">
              <p className="text-xs font-black text-foreground/90">{firstComment?.commentCreator?.name}:</p>
              <p className="text-xs text-foreground/60 font-medium truncate">{firstComment?.content}</p>
            </div>
          </div>
        )}

        {/* Full Conversation on Details Page */}
        {isPostDetailsPage && (
          <div className="w-full mt-4 space-y-4">
            <Divider className="opacity-10" />
            <ScrollShadow className="max-h-[500px] space-y-6 px-1">
              {commentsList.map((comment, index) => (
                <div key={comment._id || index} className="space-y-3">
                  <div className="flex gap-3 items-start group">
                    <Avatar src={comment?.commentCreator?.photo} size="sm" />
                    <div className="flex-1">
                      <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none border border-white/5">
                        <p className="text-xs font-black text-primary mb-1">{comment?.commentCreator?.name}</p>
                        <p className="text-xs text-foreground/70 font-medium leading-relaxed">{comment?.content}</p>
                      </div>
                      <div className="flex items-center gap-4 mt-2 ml-1">
                        <button 
                          className="text-[10px] font-black text-foreground/30 hover:text-primary uppercase tracking-tighter"
                          onClick={() => setActiveReplyId(activeReplyId === comment._id ? null : comment._id)}
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Reply Input */}
                  {activeReplyId === comment._id && (
                    <div className="ml-10 flex items-center gap-2 animate-in slide-in-from-left-2 duration-300">
                      <Input 
                        ref={replyRef} 
                        placeholder={`Reply to ${comment?.commentCreator?.name}...`} 
                        variant="flat" size="sm" className="flex-1" autoFocus
                      />
                      <Button isIconOnly size="sm" color="primary" radius="full" onPress={() => handleReply(comment._id)} isLoading={replyMutation.isPending}>
                        <Send size="16" variant="Bold" />
                      </Button>
                    </div>
                  )}

                  {/* Replies List */}
                  {comment?.replies?.map((reply, rid) => (
                    <div key={reply._id || rid} className="ml-10 flex gap-2 items-start opacity-80 scale-95 origin-left">
                      <Avatar src={reply?.replyCreator?.photo} size="xs" />
                      <div className="bg-white/5 p-2 rounded-xl rounded-tl-none border border-white/5 flex-1">
                        <p className="text-[10px] font-black text-accent mb-0.5">{reply?.replyCreator?.name}</p>
                        <p className="text-[11px] text-foreground/60 leading-tight">{reply?.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </ScrollShadow>
          </div>
        )}

        {/* Post Comment Input */}
        <div className="w-full flex items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/5 mt-4">
          <Avatar src={currentUser?.photo} size="sm" />
          <Input ref={commentRefs} placeholder="Write a comment..." variant="flat" size="sm" className="flex-1" />
          <Button isIconOnly size="sm" color="primary" radius="xl" onPress={handleComment} isLoading={commentMutation.isPending}>
            <Send size="18" variant="Bold" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
