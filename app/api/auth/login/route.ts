import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { login } from "@/lib/auth";

// ── Rate Limiter ──
const LOGIN_RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_LOGIN_ATTEMPTS_PER_USER = 5;
const MAX_LOGIN_ATTEMPTS_PER_IP = 20; // Global IP limit (across all usernames)

interface LoginAttemptRecord {
    count: number;
    firstAttempt: number;
}
const loginAttempts: Record<string, LoginAttemptRecord> = {};

function checkRateLimit(key: string, maxAttempts: number): { allowed: boolean; remainingAttempts: number; retryAfter?: number } {
    const now = Date.now();
    const record = loginAttempts[key];

    if (!record) {
        loginAttempts[key] = { count: 1, firstAttempt: now };
        return { allowed: true, remainingAttempts: maxAttempts - 1 };
    }

    // Reset if window has passed
    if (now - record.firstAttempt > LOGIN_RATE_LIMIT_WINDOW) {
        loginAttempts[key] = { count: 1, firstAttempt: now };
        return { allowed: true, remainingAttempts: maxAttempts - 1 };
    }

    // Check if limit exceeded
    if (record.count >= maxAttempts) {
        const retryAfter = Math.ceil((LOGIN_RATE_LIMIT_WINDOW - (now - record.firstAttempt)) / 1000);
        return { allowed: false, remainingAttempts: 0, retryAfter };
    }

    record.count++;
    return { allowed: true, remainingAttempts: maxAttempts - record.count };
}

function resetLoginAttempts(key: string) {
    delete loginAttempts[key];
}

// Cleanup stale entries every 100 requests to prevent memory leak
let requestCounter = 0;
function cleanupStaleEntries() {
    requestCounter++;
    if (requestCounter % 100 !== 0) return;
    const now = Date.now();
    for (const key of Object.keys(loginAttempts)) {
        if (now - loginAttempts[key].firstAttempt > LOGIN_RATE_LIMIT_WINDOW) {
            delete loginAttempts[key];
        }
    }
}

export async function POST(request: Request) {
    try {
        cleanupStaleEntries();

        const body = await request.json();
        const { username, password } = body;

        if (!username || !password) {
            return NextResponse.json(
                { error: "Kullanıcı adı ve şifre gereklidir." },
                { status: 400 }
            );
        }

        // Sanitize inputs
        const cleanUsername = String(username).trim().slice(0, 100);
        const cleanPassword = String(password).slice(0, 200);

        // Extract IP for rate limiting
        const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

        // 1. Global IP rate limit (prevents credential stuffing across usernames)
        const ipLimit = checkRateLimit(`ip_${ip}`, MAX_LOGIN_ATTEMPTS_PER_IP);
        if (!ipLimit.allowed) {
            return NextResponse.json(
                {
                    error: `Çok fazla giriş denemesi. ${ipLimit.retryAfter} saniye sonra tekrar deneyin.`,
                    retryAfter: ipLimit.retryAfter
                },
                { status: 429 }
            );
        }

        // 2. Per-user + IP rate limit (prevents brute-force on a specific account)
        const userIpKey = `user_${ip}_${cleanUsername.toLowerCase()}`;
        const userLimit = checkRateLimit(userIpKey, MAX_LOGIN_ATTEMPTS_PER_USER);
        if (!userLimit.allowed) {
            return NextResponse.json(
                {
                    error: `Çok fazla başarısız giriş denemesi. ${userLimit.retryAfter} saniye sonra tekrar deneyin.`,
                    retryAfter: userLimit.retryAfter
                },
                { status: 429 }
            );
        }

        const admin = await prisma.admin.findUnique({
            where: { username: cleanUsername },
        });

        if (!admin) {
            // Generic error — don't reveal whether username exists
            return NextResponse.json(
                { error: "Kullanıcı adı veya şifre hatalı.", remainingAttempts: userLimit.remainingAttempts },
                { status: 401 }
            );
        }

        const isPasswordValid = await bcrypt.compare(cleanPassword, admin.passwordHash);

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: "Kullanıcı adı veya şifre hatalı.", remainingAttempts: userLimit.remainingAttempts },
                { status: 401 }
            );
        }

        // Successful login - reset rate limits
        resetLoginAttempts(userIpKey);
        resetLoginAttempts(`ip_${ip}`);

        await login({ id: admin.id, username: admin.username });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "Sunucu hatası oluştu." },
            { status: 500 }
        );
    }
}
