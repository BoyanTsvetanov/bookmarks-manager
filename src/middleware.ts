import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip webhook path and other static files etc.
    '/((?!api/webhooks/clerk|_next/static|_next/image|favicon.ico|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Match api or trpc routes except /api/webhooks/clerk
    '/api/:path*',
    '/trpc/:path*',
  ],
};
