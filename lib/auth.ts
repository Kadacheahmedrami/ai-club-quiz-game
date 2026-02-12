import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

interface DecodedToken {
  userId: number;
  email: string;
  iat: number;
  exp: number;
}

export async function authenticateUser(): Promise<DecodedToken | null> {
  try {
    // Get token from cookies or Authorization header
    const cookieStore = cookies();
    let token = cookieStore.get('auth-token')?.value;

    // If not in cookies, check for Authorization header
    if (!token) {
      // For API routes, we'll need to get the token differently
      // This function is meant to be called from server components or middleware
      return null;
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key') as DecodedToken;
    return decoded;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

// Alternative function to verify token from request headers (for API routes)
export async function verifyTokenFromHeader(authHeader?: string): Promise<DecodedToken | null> {
  try {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key') as DecodedToken;
    return decoded;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}