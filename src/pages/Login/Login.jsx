import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeSlash } from 'iconsax-reactjs'
import React, { useState, useContext } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useNavigate, Link } from "react-router-dom";
import ErrorMessege from '../../components/ErrorMessege/ErrorMessege'
import axios from 'axios'
import { AuthContext } from '../../Context/AuthContextProvider'
import { Button } from "@heroui/react";
import { motion } from 'framer-motion'
import toast from 'react-hot-toast';

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export default function Login() {
  let { setToken } = useContext(AuthContext)
  const [isshown, setisShown] = useState(false)
  const { handleSubmit, register, formState } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
    mode: 'onTouched',
  })
  const [Error, setError] = useState(null)
  const [Confrim, setConfirm] = useState(null)
  const router = useNavigate()
  
  function ChangeEye() {
    setisShown(!isshown)
  }

  async function sendTheDataToApi(values) {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/signin`, values)
      
      // The token is nested inside a 'data' object based on the network trace
      const token = response.data.data?.token || response.data.token;

      if (token) {
        setToken(token)
        localStorage.setItem("token", token)
        setConfirm(response.data.message)
        toast.success("Welcome back! Login successful.");
        router("/home", { replace: true })
      } else {
        setError("Token not found in response");
        toast.error("Login failed: Token not received");
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.error || "Login failed";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center p-4 relative overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="glass-card w-full max-w-md p-10 border-none shadow-2xl relative z-10"
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-linear-to-br from-primary to-accent rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-primary/30 rotate-3">
            <svg fill="none" height="40" viewBox="0 0 24 24" width="40" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="text-4xl font-black text-foreground tracking-tighter">Welcome back!</h2>
          <p className="text-foreground/50 font-medium mt-2">Enter your credentials to access SocialHub</p>
        </div>

        <form onSubmit={handleSubmit(sendTheDataToApi)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-foreground/40 ml-1">Email Address</label>
            <input 
              {...register('email')} 
              type="text" 
              className="m-0 h-12 bg-white/5 border-white/10 focus:border-primary transition-all font-bold" 
              placeholder="name@example.com"
            />
            <ErrorMessege title={formState.errors.email?.message || ''} />
          </div>

          <div className="space-y-2 relative">
            <label className="text-xs font-black uppercase tracking-widest text-foreground/40 ml-1">Password</label>
            <div className="relative">
              <input 
                {...register('password')} 
                type={isshown ? 'text' : 'password'} 
                className="m-0 h-12 pr-12 bg-white/5 border-white/10 focus:border-primary transition-all font-bold" 
                placeholder="••••••••"
              />
              <button 
                type="button"
                onClick={ChangeEye} 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-primary transition-colors"
              >
                {isshown ? <Eye size="20" /> : <EyeSlash size="20" />}
              </button>
            </div>
            <div className="flex justify-end mt-1">
              <Link to="/forgot-password" class="text-xs font-black text-primary hover:underline">Forgot Password?</Link>
            </div>
            <ErrorMessege title={formState.errors.password?.message || ''} />
          </div>

          <div className="space-y-4 pt-4">
            <ErrorMessege title={Error || ''} />
            <ErrorMessege title={Confrim || ''} />

            <Button 
              type="submit"
              className="w-full bg-linear-to-r from-primary to-accent text-white font-black h-14 shadow-xl shadow-primary/20 text-lg group"
              radius="2xl"
            >
              Sign In
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Button>
            
            <p className="text-center text-sm font-bold text-foreground/40">
              New to the platform? 
              <Link to="/register" className="text-primary font-black hover:underline ml-2">Create Account</Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
