import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/calculator")) {
    const accessCookie = request.cookies.get("ccm_access");

    if (!accessCookie?.value) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    try {
      const data = JSON.parse(
        Buffer.from(accessCookie.value, "base64").toString()
      );
      if (!data.paid || !data.sessionId) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/calculator/:path*"],
};
