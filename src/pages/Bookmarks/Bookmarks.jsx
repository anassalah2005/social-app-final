import React, { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { AuthContext } from '../../Context/AuthContextProvider';
import CardStyle from '../../components/CardStyle/CardStyle';
import Loading from '../../components/Loading/Loading';

export default function Bookmarks() {
  const { token } = useContext(AuthContext);

  // First, get the current user ID because some endpoints need it
  const { data: currentUser } = useQuery({
    queryKey: ['currentUser', token],
    queryFn: async () => {
      if (!token) return null;
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/profile-data`, {
        headers: { token }
      });
      return response.data.user || response.data.data?.user || response.data.data;
    },
    enabled: !!token
  });

  const userId = currentUser?._id || currentUser?.id;

  const { data, isLoading } = useQuery({
    queryKey: ['bookmarks', userId],
    queryFn: async () => {
      // Trying the dynamic ID URL as requested: users/:id/bookmarks
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/${userId}/bookmarks`, {
          headers: { token }
        });
        const posts = response.data.posts || response.data.data || response.data.bookmarkedPosts || response.data;
        return Array.isArray(posts) ? posts : [];
      } catch (err) {
        // Fallback to the generic URL if the ID one fails
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/bookmarks`, {
          headers: { token }
        });
        const posts = response.data.posts || response.data.data || response.data.bookmarkedPosts || response.data;
        return Array.isArray(posts) ? posts : [];
      }
    },
    enabled: !!token && !!userId
  });

  if (isLoading || !userId) return <Loading />;

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-8 pb-20">
      <div className="space-y-8 w-full">
        {/* Header Section */}
        <div className="glass-card p-8 rounded-[2.5rem] flex items-center justify-between border-none shadow-2xl shadow-primary/5">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-linear-to-tr from-primary to-accent rounded-3xl flex items-center justify-center text-white shadow-xl shadow-primary/20 rotate-3">
              <svg fill="none" height="32" viewBox="0 0 24 24" width="32" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tighter text-foreground">My Library</h2>
              <p className="text-foreground/50 font-medium italic">Saved by {currentUser?.name || 'me'}</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-white/5 px-4 py-2 rounded-2xl border border-white/10">
            <span className="text-primary font-black text-xl">{data?.length || 0}</span>
            <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Items</span>
          </div>
        </div>
        
        {/* Content Section */}
        {data?.length === 0 ? (
          <div className="glass-card p-20 text-center space-y-6 rounded-[3rem] border-none shadow-2xl">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary/30 mx-auto animate-pulse">
              <svg fill="none" height="48" viewBox="0 0 24 24" width="48" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black tracking-tight text-foreground/80">Nothing saved yet</h3>
              <p className="text-foreground/40 font-medium max-w-xs mx-auto">Click the bookmark icon on any post to keep it safe here for later.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {data?.map((post) => (
              <CardStyle key={post._id || post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
