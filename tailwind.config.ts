import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                brand: {
                    cyan: "#06b6d4",
                    "cyan-dark": "#0891b2",
                    accent: "#3b82f6",
                    violet: "#6366f1",
                    emerald: "#10b981",
                    dark: "#0f172a",
                    navy: "#020617"
                },
                surface: {
                    dark: "#0a0a0a",
                    light: "#ffffff",
                    muted: "#f8fafc",
                    border: "rgba(255, 255, 255, 0.1)"
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
            },
            animation: {
                'gradient-x': 'gradient-x 15s ease infinite',
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'glow': 'glow 3s ease-in-out infinite alternate',
            },
            keyframes: {
                'gradient-x': {
                    '0%, 100%': {
                        'background-size': '200% 200%',
                        'background-position': 'left center'
                    },
                    '50%': {
                        'background-size': '200% 200%',
                        'background-position': 'right center'
                    },
                },
                'float': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                'glow': {
                    '0%': { opacity: '0.8', transform: 'scale(1)' },
                    '100%': { opacity: '1', transform: 'scale(1.05)' }
                }
            },
            backgroundImage: {
                'mesh-dark': 'radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.15) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(6, 182, 212, 0.15) 0px, transparent 50%)',
                'mesh-light': 'radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.08) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(6, 182, 212, 0.08) 0px, transparent 50%)',
                'mesh-emerald': 'radial-gradient(at 0% 100%, rgba(16, 185, 129, 0.15) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(6, 182, 212, 0.15) 0px, transparent 50%)',
            }
        },
    },
    plugins: [],
    darkMode: "class",
};
export default config;
