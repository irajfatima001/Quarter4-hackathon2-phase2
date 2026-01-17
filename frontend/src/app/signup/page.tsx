'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Navbar from "@/components/navbar";
import SignupForm from "@/components/forms/signup-form";

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignupSuccess = () => {
    toast.success("Signup successful!");
    router.push("/login"); // redirect to login after "signup"
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar showLogout={false} />
      <div className="flex-grow flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <SignupForm onSignupSuccess={handleSignupSuccess} />
      </div>
    </div>
  );
}
