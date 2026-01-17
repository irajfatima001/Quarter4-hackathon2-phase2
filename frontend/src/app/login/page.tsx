'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import LoginForm from "@/components/forms/login-form";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();

  const handleLoginSuccess = () => {
    toast.success("Login successful!");
    router.push("/dashboard"); // redirect after "login"
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar showLogout={false} />
      <div className="flex-grow flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      </div>
    </div>
  );
}
