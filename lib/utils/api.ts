// Utility function to make authenticated API calls
export async function authenticatedFetch(url: string, options: RequestInit = {}) {
  // Get token from localStorage
  const token = localStorage.getItem('token');
  
  // Add authorization header
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,
    ...(options.headers || {})
  };
  
  // Make the request with the auth header
  return fetch(url, {
    ...options,
    headers
  });
}