import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Eye, EyeSlash } from 'iconsax-reactjs'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import * as z from 'zod'
import ErrorMessege from '../../components/ErrorMessege/ErrorMessege'
import { Button } from "@heroui/react";
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

const schema = z.object({
  name: z.string().min(3, "Username must be at least 3 characters").max(12, "Username must be at most 12 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password must be at least 8 characters and include uppercase, lowercase, number and special character"),
  rePassword: z.string(),
  dateOfBirth: z.string().refine((date) => {
    const today = new Date();
    const birthDate = new Date(date);
    return birthDate < today;
  }, "Birth date must be in the past"),
  gender: z.enum(['male', 'female'], { errorMap: () => ({ message: "Please select a gender" }) })
}).refine((data) => data.password === data.rePassword, {
  message: "Passwords don't match",
  path: ["rePassword"],
})

export default function Register() {
  const [isshown, setisShown] = useState(false)
  const { handleSubmit, register, formState } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      rePassword: '',
      dateOfBirth: '',
      gender: '',
    },
    mode: 'onTouched',
  })

  const [Error, setError] = useState(null)
  const [Confrim, setConfirm] = useState(null)
  const router = useNavigate()
  
  function ChangeEye() {
    setisShown(!isshown)
  }

  async function sendTheDataToApi(data) {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/signup`, data);
      setConfirm(response.data.message);
      toast.success("Account created successfully!");
      setTimeout(() => {
        router("/login");
      }, 2000);
    } catch (error) {
      setError(error?.response?.data?.error || "Registration failed");
      toast.error(error?.response?.data?.error || "Registration failed");
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center p-4 relative py-12 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-card w-full max-w-2xl p-10 border-none shadow-2xl relative z-10"
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-linear-to-tr from-accent to-primary rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-accent/30 -rotate-3">
            <svg fill="none" height="40" viewBox="0 0 24 24" width="40" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="text-4xl font-black text-foreground tracking-tighter">Create Account</h2>
          <p className="text-foreground/50 font-medium mt-2">Join thousands of creators on SocialHub</p>
        </div>

        <form onSubmit={handleSubmit(sendTheDataToApi)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-foreground/40 ml-1">Username</label>
              <input {...register('name')} type="text" className="m-0 h-12 bg-white/5 border-white/10 font-bold" placeholder="johndoe" />
              <ErrorMessege title={formState.errors.name?.message || ''} />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-foreground/40 ml-1">Email Address</label>
              <input {...register('email')} type="text" className="m-0 h-12 bg-white/5 border-white/10 font-bold" placeholder="name@example.com" />
              <ErrorMessege title={formState.errors.email?.message || ''} />
            </div>

            <div className="space-y-2 relative">
              <label className="text-xs font-black uppercase tracking-widest text-foreground/40 ml-1">Password</label>
              <div className="relative">
                <input 
                  {...register('password')} 
                  type={isshown ? 'text' : 'password'} 
                  className="m-0 h-12 pr-12 bg-white/5 border-white/10 font-bold" 
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
              <ErrorMessege title={formState.errors.password?.message || ''} />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-foreground/40 ml-1">Confirm Password</label>
              <input {...register('rePassword')} type="password" className="m-0 h-12 bg-white/5 border-white/10 font-bold" placeholder="••••••••" />
              <ErrorMessege title={formState.errors.rePassword?.message || ''} />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-foreground/40 ml-1">Birth Date</label>
              <input {...register('dateOfBirth')} type="date" className="m-0 h-12 bg-white/5 border-white/10 font-bold" />
              <ErrorMessege title={formState.errors.dateOfBirth?.message || ''} />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-foreground/40 ml-1">Gender</label>
              <div className="flex gap-4 p-1.5 bg-white/5 rounded-2xl border border-white/10">
                <label className="flex-1 flex items-center justify-center gap-2 cursor-pointer p-2 rounded-xl hover:bg-primary/10 transition-all group">
                  <input {...register('gender')} type="radio" value="male" className="w-4 h-4 accent-primary" />
                  <span className="text-sm font-black opacity-60 group-hover:opacity-100">Male</span>
                </label>
                <label className="flex-1 flex items-center justify-center gap-2 cursor-pointer p-2 rounded-xl hover:bg-accent/10 transition-all group">
                  <input {...register('gender')} type="radio" value="female" className="w-4 h-4 accent-accent" />
                  <span className="text-sm font-black opacity-60 group-hover:opacity-100">Female</span>
                </label>
              </div>
              <ErrorMessege title={formState.errors.gender?.message || ''} />
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-white/10">
            <ErrorMessege title={Error || ''} />
            <ErrorMessege title={Confrim || ''} />

            <Button 
              type="submit"
              className="w-full bg-linear-to-r from-accent to-primary text-white font-black h-14 shadow-xl shadow-accent/20 text-lg group"
              radius="2xl"
            >
              Create Account
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M18 9v3m0 0v3m0-3h3" />
              </svg>
            </Button>
            
            <p className="text-center text-sm font-bold text-foreground/40">
              Already a member? 
              <Link to="/login" className="text-primary font-black hover:underline ml-2">Sign In</Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
