import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession } from "@/lib/auth";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Protect /wolf-admin-1392a14 routes
    if (pathname.startsWith("/wolf-admin-1392a14")) {
        // Allow access to login page
        if (pathname === "/wolf-admin-1392a14/login") {
            return NextResponse.next();
        }

        const token = request.cookies.get("session")?.value;
        const session = token ? await verifySession(token) : null;

        if (!session) {
            return NextResponse.redirect(new URL("/wolf-admin-1392a14/login", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/wolf-admin-1392a14/:path*"],
};
