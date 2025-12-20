"use client";

import { useEffect } from "react";

export default function Error({
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
        <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center p-8 bg-white/5 rounded-xl border border-white/10">
                <h2 className="text-2xl font-bold mb-4 text-red-400">Bir hata oluştu</h2>
                <p className="mb-6 text-gray-300">Sayfa yüklenirken bir sorunla karşılaştık.</p>
                <div className="bg-black/30 p-4 rounded mb-6 text-left text-sm font-mono text-red-300 overflow-auto max-w-md">
                    {error.message}
                </div>
                <button
                    onClick={() => reset()}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-semibold"
                >
                    Tekrar Dene
                </button>
            </div>
        </div>
    );
}
