import React from 'react';
import { Button, Input, Card } from '@heroui/react';
import { Key, Lock, Eye, EyeSlash } from 'iconsax-reactjs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useContext, useState } from 'react';
import { AuthContext } from '../../Context/AuthContextProvider';

const passwordSchema = z.object({
  password: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function Settings() {
  const { token } = useContext(AuthContext);
  const [isVisible, setIsVisible] = useState(false);
  const [isNewVisible, setIsNewVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (values) => {
    setIsLoading(true);
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/users/change-password`,
        values,
        { headers: { token } }
      );
      toast.success("Password changed successfully!");
      reset();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-8 pb-20">
      <div className="glass-card p-8 rounded-[2.5rem] flex items-center justify-between border-none shadow-2xl shadow-primary/5">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-linear-to-tr from-primary to-purple-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-primary/20 rotate-3">
            <Lock size="32" variant="Bold" />
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tighter text-foreground">Settings</h2>
            <p className="text-foreground/50 font-medium">Manage your account security</p>
          </div>
        </div>
      </div>

      <Card className="glass-card p-8 rounded-[3rem] border-none shadow-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-2">
            <h3 className="text-xl font-black flex items-center gap-2">
              <Key size="20" className="text-primary" />
              Change Password
            </h3>
            <p className="text-sm text-foreground/40 font-medium">Update your password to keep your account secure.</p>
          </div>

          <div className="space-y-6">
            <Input
              type={isVisible ? "text" : "password"}
              label="Current Password"
              placeholder="••••••••"
              labelPlacement="outside"
              variant="bordered"
              size="lg"
              {...register('password')}
              isInvalid={!!errors.password}
              errorMessage={errors.password?.message}
              endContent={
                <button className="focus:outline-none" type="button" onClick={() => setIsVisible(!isVisible)}>
                  {isVisible ? <EyeSlash size="22" className="text-foreground/40" /> : <Eye size="22" className="text-foreground/40" />}
                </button>
              }
              classNames={{
                inputWrapper: "h-14 rounded-2xl border-white/10 hover:border-primary/50 focus-within:border-primary transition-all bg-white/5",
                label: "font-bold text-foreground/70 ml-1"
              }}
            />

            <Input
              type={isNewVisible ? "text" : "password"}
              label="New Password"
              placeholder="••••••••"
              labelPlacement="outside"
              variant="bordered"
              size="lg"
              {...register('newPassword')}
              isInvalid={!!errors.newPassword}
              errorMessage={errors.newPassword?.message}
              endContent={
                <button className="focus:outline-none" type="button" onClick={() => setIsNewVisible(!isNewVisible)}>
                  {isNewVisible ? <EyeSlash size="22" className="text-foreground/40" /> : <Eye size="22" className="text-foreground/40" />}
                </button>
              }
              classNames={{
                inputWrapper: "h-14 rounded-2xl border-white/10 hover:border-primary/50 focus-within:border-primary transition-all bg-white/5",
                label: "font-bold text-foreground/70 ml-1"
              }}
            />
          </div>

          <Button
            type="submit"
            color="primary"
            size="lg"
            className="w-full h-14 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            isLoading={isLoading}
          >
            Update Password
          </Button>
        </form>
      </Card>
    </div>
  );
}
