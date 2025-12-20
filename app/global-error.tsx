"use client";

import { useEffect } from "react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <html>
            <body className="bg-black text-white flex items-center justify-center min-h-screen">
                <div className="text-center p-8 bg-white/10 rounded-xl border border-white/20">
                    <h2 className="text-2xl font-bold mb-4 text-red-500">Bir şeyler ters gitti!</h2>
                    <p className="mb-4 text-gray-300">{error.message}</p>
                    <button
                        onClick={() => reset()}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    >
                        Tekrar Dene
                    </button>
                </div>
            </body>
        </html>
    );
}
