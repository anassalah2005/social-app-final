import React from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from '../Navbar/Navbar'
import SideBar from './SideBar/SideBar'
import Background from '../Background/Background'

export default function Layout() {
  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <Background />
      <NavBar />
      
      <div className="max-w-[1400px] mx-auto flex gap-8 px-4 py-6 md:py-10 relative z-10">
        {/* Left Sidebar - FIXED on scroll */}
        <aside className="hidden lg:block w-64 xl:w-72 shrink-0">
          <div className="fixed top-24 w-64 xl:w-72 h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar pr-2">
            <SideBar />
          </div>
        </aside>

        {/* Main Feed - Flexible */}
        <main className="flex-1 min-w-0 max-w-3xl mx-auto lg:mx-0">
          <Outlet />
        </main>

        {/* Right Widgets - XL only */}
        <aside className="hidden xl:block w-80 shrink-0">
          <div className="fixed top-24 w-80">
            <div className="glass-card p-6">
              <h3 className="font-black text-lg mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-primary rounded-full"></span>
                Trending Tags
              </h3>
              <div className="space-y-4 text-sm">
                <p className="text-primary font-bold hover:underline cursor-pointer">#ReactJS</p>
                <p className="text-primary font-bold hover:underline cursor-pointer">#TailwindCSS</p>
                <p className="text-primary font-bold hover:underline cursor-pointer">#HeroUI</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}