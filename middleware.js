import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware()

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}



// utils/tenant.js
export function getSubdomain(req) {
  const host = req.headers.host; // e.g., org1.holbox.ai
  const parts = host.split('.');
  if (parts.length > 2) {
    return parts[0]; // org1
  }
  return null;
}
