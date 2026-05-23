import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory store for rate limiting (for demo purposes)
// In production, use a distributed store like Redis
const requestCounts = new Map<string, { count: number; timestamp: number }>();

// Bot detection patterns
const BOT_PATTERNS = [
  /bot/i,
  /crawler/i,
  /spider/i,
  /slurp/i,
  /wget/i,
  /curl/i,
  /python/i,
  /node/i,
  /go-http-client/i,
  /java/i,
  /php/i,
  /perl/i,
  /scrapy/i,
  /axios/i,
  /httpclient/i,
  /postman/i,
  /insomnia/i,
  /python-requests/i,
  /fasthttp/i,
  /aiohttp/i,
  /http\.rb/i,
  /faraday/i,
  /mechanize/i,
  /selenium/i,
  /phantomjs/i,
  /headless/i,
  /puppeteer/i,
  /playwright/i,
  /undici/i,
  /node-fetch/i,
  /got/i,
  /request-promise/i,
  /superagent/i,
  /ky/i,
  /ofetch/i,
  /axios-fetch/i,
  /fetch-ponyfill/i,
  /cross-fetch/i,
  /isomorphic-fetch/i,
  /node-libcurl/i,
  /request/i,
  /restify/i,
  /frisbee/i,
  /ky-universal/i,
  /make-fetch-happen/i,
  /simple-get/i,
  /got-fetch/i,
  /node-fetch-h2/i,
  /fetch-blob/i,
  /form-data/i,
  /formdata-node/i,
  /undici-fetch/i,
  /minipass-fetch/i,
  /minipass-flush/i,
  /minipass-pipeline/i,
  /minipass-collect/i,
  /minipass-json-stream/i
];

// Rate limiting configuration
const RATE_LIMIT = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 100, // Max 100 requests per window
};

// Function to check if user agent is a bot
function isBot(userAgent: string | null): boolean {
  if (!userAgent) return false;
  
  return BOT_PATTERNS.some(pattern => pattern.test(userAgent));
}

// Function to check rate limit
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT.WINDOW_MS;
  
  // Clean up old entries
  for (const [key, value] of requestCounts.entries()) {
    if (value.timestamp < windowStart) {
      requestCounts.delete(key);
    }
  }
  
  // Get current count for IP
  const ipRecord = requestCounts.get(ip);
  
  if (!ipRecord) {
    // First request from this IP
    requestCounts.set(ip, { count: 1, timestamp: now });
    return false;
  }
  
  // Check if rate limit exceeded
  if (ipRecord.count >= RATE_LIMIT.MAX_REQUESTS) {
    return true;
  }
  
  // Increment count
  requestCounts.set(ip, { 
    count: ipRecord.count + 1, 
    timestamp: now 
  });
  
  return false;
}

// Function to get client IP
function getClientIp(req: NextRequest): string {
  // Try to get IP from various headers
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    // Handle multiple IPs in the header
    const ips = forwardedFor.split(',').map(ip => ip.trim());
    return ips[0]; // Take the first IP
  }
  
  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }
  
  // Fallback to default
  return req.ip || 'unknown';
}

export default function middleware(req: NextRequest) {
  const ip = getClientIp(req);
  const userAgent = req.headers.get('user-agent');
  
  // Bot detection
  if (isBot(userAgent)) {
    console.warn(`Blocked bot request from IP: ${ip}, User-Agent: ${userAgent}`);
    return new NextResponse('Forbidden', { status: 403 });
  }
  
  // Rate limiting
  if (isRateLimited(ip)) {
    console.warn(`Rate limited request from IP: ${ip}`);
    return new NextResponse('Too Many Requests', { status: 429 });
  }
  
  // Define protected routes
  const protectedPaths = [
    '/api/quiz/questions',
    '/api/quiz/submit'
  ];

  // Check if the current path matches any protected route
  const isProtectedRoute = protectedPaths.some(path =>
    req.nextUrl.pathname.startsWith(path)
  );

  // Check if user is trying to access the dashboard (special protection)
  const isDashboardRoute = req.nextUrl.pathname.startsWith('/dashboard');

  // If it's a protected route, check authentication
  if (isProtectedRoute || isDashboardRoute) {
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

  // Special handling for dashboard route - only allow specific user
  if (isDashboardRoute) {
    // In a real implementation, you would decode and verify the JWT token
    // For this example, we'll assume the token is valid and check the user in the page component
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
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ]
};