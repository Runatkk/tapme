import { NextResponse, type NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { updateSession } from "@/lib/supabase/middleware";
import { SITE_AUTH_COOKIE, getExpectedToken } from "@/lib/site-auth";

const intlMiddleware = createIntlMiddleware(routing);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isSiteLoginRoute = pathname === "/site-login";

  const expectedToken = await getExpectedToken();
  if (expectedToken && !isSiteLoginRoute) {
    const token = request.cookies.get(SITE_AUTH_COOKIE)?.value;
    if (token !== expectedToken) {
      const loginUrl = new URL("/site-login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (isSiteLoginRoute) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    return updateSession(request);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
