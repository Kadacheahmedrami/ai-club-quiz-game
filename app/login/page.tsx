'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import GoogleLoginButton from '@/components/auth/google-login-button';
import GithubLoginButton from '@/components/auth/github-login-button';

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Still loading
    
    if (session) {
      // If user is already logged in, redirect to quiz page
      router.push('/quiz');
    }
  }, [session, status, router]);

  // Show loading state while checking session
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Only show login form if user is not logged in
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-white mb-8">AI Club Quiz Game</h1>

        <div className="space-y-4">
          <GoogleLoginButton />
          <GithubLoginButton />
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            By signing in, you agree to our terms and privacy policy.
          </p>
        </div>
      </div>
    </div>
  );
}