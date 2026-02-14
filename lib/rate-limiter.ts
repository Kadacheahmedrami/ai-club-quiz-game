// lib/rate-limiter.ts
const userRequests = new Map<string, { count: number; timestamp: number }>();

export function isUserRateLimited(userId: string, maxRequests: number = 5, windowMs: number = 300000): boolean {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  // Clean up old entries
  for (const [key, value] of userRequests.entries()) {
    if (value.timestamp < windowStart) {
      userRequests.delete(key);
    }
  }
  
  const userRecord = userRequests.get(userId);
  
  if (!userRecord) {
    userRequests.set(userId, { count: 1, timestamp: now });
    return false;
  }
  
  if (userRecord.count >= maxRequests) {
    return true;
  }
  
  userRequests.set(userId, { 
    count: userRecord.count + 1, 
    timestamp: now 
  });
  
  return false;
}
