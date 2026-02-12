import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '@/lib/db';
import type { NextAuthOptions } from 'next-auth';

// Validate environment variables
const requiredEnvVars = {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
};

const missingVars = Object.entries(requiredEnvVars)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.warn(`Missing required environment variables: ${missingVars.join(', ')}`);
}

// Initialize adapter with error handling
let adapter;
try {
  adapter = DrizzleAdapter(db);
} catch (error) {
  console.error('Failed to initialize Drizzle adapter:', error);
  // Create a fallback adapter that handles errors gracefully
  adapter = {
    createUser: () => Promise.reject(new Error('Database not connected')),
    getUser: () => Promise.reject(new Error('Database not connected')),
    getUserByEmail: () => Promise.reject(new Error('Database not connected')),
    createSession: () => Promise.reject(new Error('Database not connected')),
    getSessionAndUser: () => Promise.reject(new Error('Database not connected')),
    updateSession: () => Promise.reject(new Error('Database not connected')),
    deleteSession: () => Promise.reject(new Error('Database not connected')),
    createVerificationToken: () => Promise.reject(new Error('Database not connected')),
    useVerificationToken: () => Promise.reject(new Error('Database not connected')),
    updateUser: () => Promise.reject(new Error('Database not connected')),
    linkAccount: () => Promise.reject(new Error('Database not connected')),
    getUserByAccount: () => Promise.reject(new Error('Database not connected')),
    unlinkAccount: () => Promise.reject(new Error('Database not connected')),
  };
}

export const authOptions: NextAuthOptions = {
  adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    }),
  ],
  session: {
    strategy: 'jwt', // Changed from 'database' to 'jwt' to avoid database session issues
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub || '';
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'secret',
  pages: {
    signIn: '/login',
    error: '/login',
  },
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };