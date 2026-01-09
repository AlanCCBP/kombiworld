export const config = {
  matcher: [
    "/dashboard/:path*",
    "/booking/:path*",
    "/admin/:path*",
    "/((?!_next|favicon.ico|assets).*)",
  ],
};
