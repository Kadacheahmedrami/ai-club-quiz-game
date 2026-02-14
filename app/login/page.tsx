import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import GoogleLoginButton from '@/components/auth/google-login-button';
import GithubLoginButton from '@/components/auth/github-login-button';
export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    // If user is already logged in, redirect to quiz page
    redirect('/quiz');
  }

  return (
    <div className="min-h-screen mx-2 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-white mb-8">AI Club Quiz Game</h1>

        <div className="space-y-4">
           <GoogleLoginButton />
     

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