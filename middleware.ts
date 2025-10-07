import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/sell(.*)',
  '/dashboard(.*)',
  '/profile(.*)',
  '/my-items(.*)',
  '/admin(.*)',
  '/api/items/my-items(.*)',
  '/api/profile(.*)',
  '/api/admin(.*)',
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    auth.protect();
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
