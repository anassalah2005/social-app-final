import React, { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { AuthContext } from '../../Context/AuthContextProvider';
import Loading from '../../components/Loading/Loading';
import { Avatar } from '@heroui/react';

export default function Notifications() {
  const { token } = useContext(AuthContext);

  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/notifications?limit=20`, {
        headers: { token }
      });
      const result = response.data.data || response.data;
      return Array.isArray(result) ? result : (result.notifications || result.data?.notifications || []);
    },
    enabled: !!token
  });

  if (isLoading) return <Loading />;

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-8 pb-20">
      <div className="space-y-8 w-full">
        <div className="glass-card p-8 rounded-[2.5rem] flex items-center justify-between border-none shadow-2xl shadow-accent/5">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-linear-to-tr from-accent to-primary rounded-3xl flex items-center justify-center text-white shadow-xl shadow-accent/20 -rotate-3">
              <svg fill="none" height="32" viewBox="0 0 24 24" width="32" stroke="currentColor" strokeWidth="2.5">
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tighter text-foreground">Notifications</h2>
              <p className="text-foreground/50 font-medium">Stay updated with your community</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {data?.length === 0 ? (
            <div className="glass-card p-20 text-center space-y-6 rounded-[3rem] border-none shadow-2xl">
              <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center text-accent/30 mx-auto">
                <svg fill="none" height="48" viewBox="0 0 24 24" width="48" stroke="currentColor" strokeWidth="1.5">
                  <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-tight text-foreground/80">All caught up!</h3>
                <p className="text-foreground/40 font-medium max-w-xs mx-auto">No new activities to show you right now. Check back later!</p>
              </div>
            </div>
          ) : (
            data?.map((notification, index) => (
              <div key={notification.id || notification._id || index} className="glass-card p-5 flex items-center gap-5 hover:bg-white/40 dark:hover:bg-white/10 transition-all cursor-pointer group border-none shadow-lg hover:shadow-xl hover:-translate-y-0.5 rounded-[2rem]">
                <Avatar 
                  src={notification.fromUser?.photo || `https://avatar.iran.liara.run/public/${index}`} 
                  size="lg" 
                  className="ring-4 ring-primary/10"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    <span className="font-black text-foreground">{notification.fromUser?.name || "Someone"}</span>
                    <span className="text-foreground/60 ml-2">
                      {notification.type === 'like' && 'liked your post'}
                      {notification.type === 'comment' && 'commented on your post'}
                      {notification.type === 'follow' && 'started following you'}
                    </span>
                  </p>
                  <p className="text-xs text-foreground/30 mt-1 font-bold uppercase tracking-wider">
                    {notification.createdAt ? new Date(notification.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                  </p>
                </div>
                <div className="w-3 h-3 rounded-full bg-accent shadow-lg shadow-accent/50 scale-0 group-hover:scale-100 transition-transform" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
