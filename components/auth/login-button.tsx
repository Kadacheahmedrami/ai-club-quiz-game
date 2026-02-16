'use client';

import { signIn, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export const LoginLink = ({ children }: { children: React.ReactNode }) => {
  return (
    <button onClick={() => signIn()} className="w-full">
      {children}
    </button>
  );
};

export const LogoutButton = () => {
  return (
    <Button 
      variant="outline" 
      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
      onClick={() => signOut()}
    >
      Sign Out
    </Button>
  );
};