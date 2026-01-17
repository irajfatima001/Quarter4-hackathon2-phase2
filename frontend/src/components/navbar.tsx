'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { authApi } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { LogOut, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { ThemeToggle } from '@/components/ui/theme-toggle';

interface NavbarProps {
  showLogout?: boolean;
}

export default function Navbar({ showLogout = true }: NavbarProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const checkAuthStatus = async () => {
      const session = await authApi.getSession();
      setIsLoggedIn(!!session?.data?.user);
    };

    checkAuthStatus();
  }, []);

  const handleLogout = async () => {
    try {
      await authApi.logout();
      setIsLoggedIn(false);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Todo App
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          {showLogout && isLoggedIn && (
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          )}
          
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}