import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { login } from "@/lib/auth";

// Simple in-memory rate limiter for login attempts
// Note: In a serverless environment, use Redis or similar
const LOGIN_RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_LOGIN_ATTEMPTS = 5;
const loginAttempts: Record<string, { count: number; firstAttempt: number }> = {};

function checkLoginRateLimit(identifier: string): { allowed: boolean; remainingAttempts: number; retryAfter?: number } {
    const now = Date.now();
    const record = loginAttempts[identifier];

    if (!record) {
        loginAttempts[identifier] = { count: 1, firstAttempt: now };
        return { allowed: true, remainingAttempts: MAX_LOGIN_ATTEMPTS - 1 };
    }

    // Reset if window has passed
    if (now - record.firstAttempt > LOGIN_RATE_LIMIT_WINDOW) {
        loginAttempts[identifier] = { count: 1, firstAttempt: now };
        return { allowed: true, remainingAttempts: MAX_LOGIN_ATTEMPTS - 1 };
    }

    // Check if limit exceeded
    if (record.count >= MAX_LOGIN_ATTEMPTS) {
        const retryAfter = Math.ceil((LOGIN_RATE_LIMIT_WINDOW - (now - record.firstAttempt)) / 1000);
        return { allowed: false, remainingAttempts: 0, retryAfter };
    }

    record.count++;
    return { allowed: true, remainingAttempts: MAX_LOGIN_ATTEMPTS - record.count };
}

function resetLoginAttempts(identifier: string) {
    delete loginAttempts[identifier];
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, password } = body;

        if (!username || !password) {
            return NextResponse.json(
                { error: "Username and password are required" },
                { status: 400 }
            );
        }

        // Rate limiting check using username as identifier
        const rateLimit = checkLoginRateLimit(username);
        if (!rateLimit.allowed) {
            return NextResponse.json(
                {
                    error: `Çok fazla başarısız giriş denemesi. ${rateLimit.retryAfter} saniye sonra tekrar deneyin.`,
                    retryAfter: rateLimit.retryAfter
                },
                { status: 429 }
            );
        }

        const admin = await prisma.admin.findUnique({
            where: { username },
        });

        if (!admin) {
            return NextResponse.json(
                { error: "Invalid credentials", remainingAttempts: rateLimit.remainingAttempts },
                { status: 401 }
            );
        }

        const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: "Invalid credentials", remainingAttempts: rateLimit.remainingAttempts },
                { status: 401 }
            );
        }

        // Successful login - reset rate limit for this user
        resetLoginAttempts(username);

        await login({ id: admin.id, username: admin.username });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
