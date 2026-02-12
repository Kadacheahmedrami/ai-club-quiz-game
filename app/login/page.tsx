import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import GithubLoginButton from '@/components/auth/github-login-button';
import GoogleLoginButton from '@/components/auth/google-login-button';


export default async function Login() {
  const session = await getServerSession(authOptions);

  // If already signed in, redirect to home
  if (session) {
    redirect('/');  
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
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