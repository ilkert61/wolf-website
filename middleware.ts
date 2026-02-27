import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession } from "@/lib/auth";

// ── Rate Limiter (Edge-compatible) ──
interface RateLimit {
    count: number;
    resetTime: number;
}
const rateLimitMap = new Map<string, RateLimit>();
const RATE_LIMIT_MAX = 10; // Max 10 requests per window
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 Minute
const MAX_MAP_SIZE = 10000; // Hard cap on map entries to prevent memory issues

// Sweep stale entries periodically
let sweepCounter = 0;
function sweepStaleEntries() {
    sweepCounter++;
    if (sweepCounter % 50 !== 0) return; // Run every 50 requests
    const now = Date.now();
    for (const [key, data] of rateLimitMap) {
        if (now > data.resetTime) {
            rateLimitMap.delete(key);
        }
    }
    // Hard cap: if map exceeds limit, clear everything
    if (rateLimitMap.size > MAX_MAP_SIZE) {
        rateLimitMap.clear();
    }
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. IP Rate Limiting for API routes
    if (pathname.startsWith("/api/")) {
        sweepStaleEntries();

        const forwarded = request.headers.get("x-forwarded-for");
        const ip = forwarded?.split(",")[0]?.trim() || "127.0.0.1";
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

    // 2. Protect Admin Routes (case-insensitive)
    const normalizedPath = pathname.toLowerCase();
    if (normalizedPath.startsWith("/wolf-admin-1392a14")) {
        if (normalizedPath === "/wolf-admin-1392a14/login") {
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
