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
                cyber: {
                    cyan: "#06b6d4",
                    emerald: "#10b981",
                    violet: "#8b5cf6",
                    rose: "#f43f5e",
                },
                surface: {
                    dark: "#0f172a",
                    medium: "#1e293b",
                    light: "#334155",
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
            },
            boxShadow: {
                'glow-cyan': '0 0 30px rgba(6, 182, 212, 0.4)',
                'glow-emerald': '0 0 30px rgba(16, 185, 129, 0.4)',
                'glow-violet': '0 0 30px rgba(139, 92, 246, 0.4)',
                'glow-sm-cyan': '0 0 15px rgba(6, 182, 212, 0.3)',
                'glow-lg-cyan': '0 0 50px rgba(6, 182, 212, 0.5)',
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-cyber': 'linear-gradient(135deg, #06b6d4, #10b981)',
                'gradient-accent': 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                'gradient-hero': 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 50%, #10b981 100%)',
            },
            animation: {
                'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
                'float': 'float 3s ease-in-out infinite',
                'shine': 'shine 3s ease-in-out infinite',
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [],
    darkMode: "class",
};
export default config;
