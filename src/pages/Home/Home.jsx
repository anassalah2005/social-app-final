import React, { useState } from "react";
import CreatePostDesign from "../../components/createPostDesign/CreatePostDesign";
import CardStyle from "../../components/CardStyle/CardStyle";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContextProvider";
import Loading from "../../components/Loading/Loading";
import { Button, Pagination } from "@heroui/react";

export default function Home() {
  const { token } = useContext(AuthContext);
  const [page, setPage] = useState(1);

  async function getPosts({ queryKey }) {
    const [_, currentPage] = queryKey;
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts?page=${currentPage}&limit=20`, {
      headers: { token }
    });
    return response.data;
  }

  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: ["posts", page],
    queryFn: getPosts,
    placeholderData: (previousData) => previousData,
  });

  if (isLoading && !data) {
    return <Loading />
  }

  const posts = data?.data?.data?.posts || data?.data?.posts || data?.posts || [];
  // Calculate total pages more robustly
  const totalPages = data?.metadata?.numberOfPages || data?.paginationInfo?.numberOfPages || data?.total_pages || 1;

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-8 pb-20">
      {/* Main Feed */}
      <div className="space-y-8 w-full">
        <CreatePostDesign />
        
        <div className="space-y-8">
          {posts.map((post) => (
            <CardStyle key={post.id || post._id} post={post} />
          ))}
          
          {posts.length === 0 && !isLoading && (
             <div className="text-center py-20 glass-card">
               <p className="text-foreground/50 font-bold">No posts found or end of feed.</p>
             </div>
          )}
        </div>

        {/* Pagination UI */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12 mb-8 glass-card p-4 rounded-3xl">
            <Pagination
              total={totalPages}
              initialPage={1}
              page={page}
              onChange={(newPage) => {
                setPage(newPage);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              color="primary"
              variant="flat"
              size="lg"
              showControls
              classNames={{
                wrapper: "gap-2",
                item: "w-10 h-10 text-sm font-bold rounded-xl",
                cursor: "bg-primary text-white font-black shadow-lg shadow-primary/20",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
