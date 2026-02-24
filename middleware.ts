import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession } from "@/lib/auth";

// Basic In-Memory Rate Limiter (Edge compatible)
// Note: In a heavily distributed serverless environment (like Vercel Edge), 
// memory maps reset per instance. However, this is sufficient for basic spam mitigation.
interface RateLimit {
    count: number;
    resetTime: number;
}
const rateLimitMap = new Map<string, RateLimit>();
const RATE_LIMIT_MAX = 5; // Max 5 requests
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 Minute

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. IP Rate Limiting for API routes (Protection against spam/DDoS on forms)
    if (pathname.startsWith("/api/")) {
        // Extract IP (Next.js automatically sets x-forwarded-for in prod)
        const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";

        // Use a composite key
        const key = `rl_${ip}_${pathname}`;

        const now = Date.now();
        const limitData = rateLimitMap.get(key) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW_MS };

        // Reset if window has passed
        if (now > limitData.resetTime) {
            limitData.count = 0;
            limitData.resetTime = now + RATE_LIMIT_WINDOW_MS;
        }

        limitData.count++;
        rateLimitMap.set(key, limitData);

        if (limitData.count > RATE_LIMIT_MAX) {
            console.warn(`Rate limit exceeded for IP: ${ip} on route: ${pathname}`);
            return new NextResponse(
                JSON.stringify({ success: false, message: "Çok fazla istek yapıldı. Lütfen biraz bekleyip tekrar deneyin." }),
                { status: 429, headers: { 'Content-Type': 'application/json' } }
            );
        }
    }

    // 2. Protect Admin Routes
    if (pathname.startsWith("/wolf-admin-1392a14")) {
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
    matcher: ["/wolf-admin-1392a14/:path*", "/api/:path*"],
};
