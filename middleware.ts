import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function protects routes by checking if the user is authenticated
export default function middleware(req: NextRequest) {
  // Define protected routes
  const protectedPaths = [
    '/api/quiz/questions',
    '/api/quiz/submit'
  ];

  // Check if the current path matches any protected route
  const isProtectedRoute = protectedPaths.some(path =>
    req.nextUrl.pathname.startsWith(path)
  );

  // If it's a protected route, check authentication
  if (isProtectedRoute) {
    // Use NextAuth's getToken helper to check if user is authenticated
    const token = req.cookies.get('__Secure-next-auth.session-token') ||
                  req.cookies.get('next-auth.session-token');

    if (!token) {
      // Return a 401 response for API routes
      if (req.nextUrl.pathname.startsWith('/api/')) {
        return new NextResponse(JSON.stringify({ error: 'Authentication required' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      } else {
        // Redirect to login page for page routes
        const url = req.nextUrl.clone();
        url.pathname = '/login';
        url.search = `callbackUrl=${encodeURIComponent(req.nextUrl.pathname)}`;
        return NextResponse.redirect(url);
      }
    }
  }

  // Check if user is trying to access the quiz page
  if (req.nextUrl.pathname === '/quiz') {
    // For page routes, we can't check the database here, so we'll let the page handle it
    // But we still need to ensure the user is authenticated
    const token = req.cookies.get('__Secure-next-auth.session-token') ||
                  req.cookies.get('next-auth.session-token');

    if (!token) {
      // Redirect to login page for page routes
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      url.search = `callbackUrl=${encodeURIComponent(req.nextUrl.pathname)}`;
      return NextResponse.redirect(url);
    }
  }

  // Continue to the next middleware/route
  return NextResponse.next();
}

// Define which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    '/api/quiz/:path*' // Protect quiz API routes
  ]
};