import { NextRequest, NextResponse } from "next/server";

function hasValidCookie(
  request: NextRequest,
  cookieName: string
): boolean {
  // Preview bypass for owner review
  const preview = request.nextUrl.searchParams.get("preview");
  if (preview === "augeo2026") return true;

  const cookie = request.cookies.get(cookieName);
  if (!cookie?.value) return false;

  try {
    const data = JSON.parse(
      Buffer.from(cookie.value, "base64").toString()
    );
    return !!(data.paid && data.sessionId);
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path.startsWith("/calculator")) {
    if (!hasValidCookie(request, "ccm_access")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (path.startsWith("/rpm-calculator")) {
    if (!hasValidCookie(request, "rpm_access")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (path.startsWith("/dashboard")) {
    // Dashboard requires at least one valid access
    const hasCCM = hasValidCookie(request, "ccm_access");
    const hasRPM = hasValidCookie(request, "rpm_access");
    if (!hasCCM && !hasRPM) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/calculator/:path*", "/rpm-calculator/:path*", "/dashboard/:path*"],
};
