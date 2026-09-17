import { NextRequest, NextResponse } from "next/server";
import { isValidSubdomain, SUBDOMAIN_ALIASES } from "./lib/certificates/registry";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  // 1. Skip Next.js internals, static files, assets, and portal directory
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/fonts") ||
    pathname.startsWith("/templates") ||
    pathname.startsWith("/portal") ||
    pathname.includes(".") || // static files (e.g., favicon.ico, images, svgs)
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // 2. Handle /c/:subdomain path prefix alias (e.g. /c/mubarackmasjid -> /mubarackmasjid)
  if (pathname.startsWith("/c/")) {
    const remaining = pathname.replace(/^\/c\//, "/");
    url.pathname = remaining;
    return NextResponse.rewrite(url);
  }

  // 3. Extract host & detect subdomain
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
  const hostname = host.split(":")[0].toLowerCase(); // Strip port

  let subdomain: string | null = null;

  if (hostname.includes("localhost")) {
    // E.g., mubarackmasjid.localhost
    const parts = hostname.split(".");
    if (parts.length > 1 && parts[0] !== "localhost" && parts[0] !== "www") {
      subdomain = parts[0];
    }
  } else if (
    !hostname.match(/^(\d{1,3}\.){3}\d{1,3}$/) && // not an IP address
    !hostname.includes("127.0.0.1")
  ) {
    // Production domain (e.g. mubarackmasjid.domain.com)
    const parts = hostname.split(".");
    if (parts.length >= 3 && parts[0] !== "www") {
      subdomain = parts[0];
    }
  }

  // Determine target canonical subdomain (either from host subdomain or from path /[subdomain])
  let targetSubdomain = subdomain;
  if (!targetSubdomain) {
    const pathParts = pathname.split("/").filter(Boolean);
    if (pathParts.length > 0 && isValidSubdomain(pathParts[0])) {
      targetSubdomain = pathParts[0];
    }
  }

  if (targetSubdomain && isValidSubdomain(targetSubdomain)) {
    const canonicalSubdomain = SUBDOMAIN_ALIASES[targetSubdomain] || targetSubdomain;

    // Check if the route is a protected certificate workspace
    const isCertificateRoute =
      pathname.endsWith("/certificate") ||
      pathname === "/certificate" ||
      pathname === `/${canonicalSubdomain}/certificate`;

    const isLoginRoute =
      pathname.endsWith("/login") ||
      pathname === "/login" ||
      pathname === `/${canonicalSubdomain}/login`;

    const authCookie = req.cookies.get(`auth_${canonicalSubdomain}`);
    const isAuthenticated = authCookie && authCookie.value === "true";

    // 4. ROUTE PROTECTION: Redirect unauthenticated requests away from /certificate to /login
    if (isCertificateRoute && !isAuthenticated) {
      if (subdomain) {
        url.pathname = "/login";
        return NextResponse.redirect(url);
      } else {
        url.pathname = `/${canonicalSubdomain}/login`;
        return NextResponse.redirect(url);
      }
    }

    // Redirect already authenticated users from /login to /certificate
    if (isLoginRoute && isAuthenticated) {
      if (subdomain) {
        url.pathname = "/certificate";
        return NextResponse.redirect(url);
      } else {
        url.pathname = `/${canonicalSubdomain}/certificate`;
        return NextResponse.redirect(url);
      }
    }

    // 5. If accessed via subdomain host, rewrite internal path
    if (subdomain) {
      if (!pathname.startsWith(`/${canonicalSubdomain}`)) {
        if (pathname === "/" || pathname === "") {
          url.pathname = `/${canonicalSubdomain}`;
          return NextResponse.rewrite(url);
        } else {
          url.pathname = `/${canonicalSubdomain}${pathname}`;
          return NextResponse.rewrite(url);
        }
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
