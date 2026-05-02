import React, { useContext } from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from '../Navbar/Navbar'
import SideBar from './SideBar/SideBar'
import Background from '../Background/Background'
import { AuthContext } from '../../Context/AuthContextProvider'

export default function Layout() {
  const { token } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <Background />
      <NavBar />
      
      <div className={`max-w-[1400px] mx-auto flex gap-8 px-4 py-6 md:py-10 relative z-10 ${!token ? 'justify-center' : ''}`}>
        {/* Left Sidebar - FIXED on scroll - Only show if logged in */}
        {token && (
          <aside className="hidden lg:block w-64 xl:w-72 shrink-0">
            <div className="fixed top-24 w-64 xl:w-72 h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar pr-2">
              <SideBar />
            </div>
          </aside>
        )}

        {/* Main Feed - Flexible */}
        <main className={`flex-1 min-w-0 max-w-3xl ${!token ? 'mx-auto' : 'lg:mx-0'}`}>
          <Outlet />
        </main>

        {/* Right Widgets - XL only - Only show if logged in */}
        {token && (
          <aside className="hidden xl:block w-80 shrink-0">
            <div className="fixed top-24 w-80">
              <div className="glass-card p-6">
                <h3 className="font-black text-lg mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-primary rounded-full"></span>
                  Trending Now
                </h3>
                <div className="space-y-4">
                  <div className="p-3 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest">Trending</p>
                    <p className="text-sm font-bold mt-1">#ModernUI</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest">Tech</p>
                    <p className="text-sm font-bold mt-1">#React2026</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}