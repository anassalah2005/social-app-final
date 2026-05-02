import React from 'react';

export default function Trending() {
  const trends = [
    { tag: '#ReactJS', posts: '12.5K' },
    { tag: '#TailwindCSS', posts: '8.2K' },
    { tag: '#HeroUI', posts: '4.1K' },
    { tag: '#Vite', posts: '3.9K' },
    { tag: '#SocialHub', posts: '2.4K' },
  ];

  return (
    <div className="glass-card p-6 space-y-4">
      <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
        <span className="w-1.5 h-5 bg-primary rounded-full" />
        Trending Tags
      </h3>
      <div className="space-y-4">
        {trends.map((trend) => (
          <div key={trend.tag} className="group cursor-pointer">
            <p className="text-xs font-black text-primary group-hover:underline">
              {trend.tag}
            </p>
            <p className="text-[10px] text-foreground/40 font-medium">
              {trend.posts} posts today
            </p>
          </div>
        ))}
      </div>
      <button className="text-[10px] font-bold text-primary hover:underline pt-2">
        Show more
      </button>
    </div>
  );
}
