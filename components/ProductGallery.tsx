"use client";

import { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, X, ImageIcon } from "lucide-react";

interface ProductGalleryProps {
    images: { url: string; isMain: boolean }[];
    title: string;
}

export default function ProductGallery({ images, title }: ProductGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(() => {
        const mainIndex = images.findIndex((img) => img.isMain);
        return mainIndex >= 0 ? mainIndex : 0;
    });
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);

    const selectedImage = images[selectedIndex]?.url;

    const goToNext = useCallback(() => {
        setSelectedIndex((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const goToPrev = useCallback(() => {
        setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
    }, [images.length]);

    // Handle keyboard navigation in lightbox
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "ArrowRight") goToNext();
        if (e.key === "ArrowLeft") goToPrev();
        if (e.key === "Escape") setIsLightboxOpen(false);
    }, [goToNext, goToPrev]);

    if (!images.length) {
        return (
            <div className="glass-card rounded-3xl overflow-hidden h-[400px] md:h-[600px] flex flex-col items-center justify-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-surface-medium flex items-center justify-center">
                    <ImageIcon className="w-10 h-10 text-gray-600" />
                </div>
                <div className="text-gray-500 font-medium">Görsel Mevcut Değil</div>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-4">
                {/* Main Image Container */}
                <div className="relative group">
                    {/* Decorative Frame */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyber-cyan/20 via-cyber-violet/20 to-cyber-emerald/20 rounded-[28px] blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative glass-card rounded-3xl overflow-hidden">
                        {/* Main Image */}
                        <div
                            className="relative h-[400px] md:h-[550px] flex items-center justify-center p-6 cursor-zoom-in bg-gradient-to-br from-surface-dark to-surface-medium"
                            onClick={() => setIsLightboxOpen(true)}
                        >
                            <img
                                src={selectedImage}
                                alt={title}
                                className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                            />

                            {/* Zoom Hint */}
                            <div className="absolute bottom-6 right-6 flex items-center gap-2 px-4 py-2 glass rounded-full text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ZoomIn className="w-4 h-4" />
                                Büyütmek için tıklayın
                            </div>

                            {/* Image Counter Badge */}
                            {images.length > 1 && (
                                <div className="absolute top-6 left-6 px-4 py-2 glass rounded-full text-sm font-medium">
                                    <span className="text-cyber-cyan">{selectedIndex + 1}</span>
                                    <span className="text-gray-500"> / {images.length}</span>
                                </div>
                            )}
                        </div>

                        {/* Navigation Arrows */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); goToPrev(); }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-cyber-cyan/20 hover:border-cyber-cyan/50 hover:shadow-glow-sm-cyan"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); goToNext(); }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-cyber-cyan/20 hover:border-cyber-cyan/50 hover:shadow-glow-sm-cyan"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                        {images.map((img, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedIndex(index)}
                                className={`relative flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden transition-all duration-300 group/thumb ${selectedIndex === index
                                        ? "ring-2 ring-cyber-cyan ring-offset-2 ring-offset-background shadow-glow-sm-cyan"
                                        : "opacity-50 hover:opacity-100 ring-1 ring-white/10 hover:ring-white/30"
                                    }`}
                            >
                                <img
                                    src={img.url}
                                    alt={`${title} ${index + 1}`}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover/thumb:scale-110"
                                />
                                {/* Overlay on hover */}
                                <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-opacity ${selectedIndex === index ? "opacity-0" : "opacity-0 group-hover/thumb:opacity-100"
                                    }`} />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox Modal */}
            {isLightboxOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center"
                    onClick={() => setIsLightboxOpen(false)}
                    onKeyDown={handleKeyDown}
                    tabIndex={0}
                >
                    {/* Close Button */}
                    <button
                        onClick={() => setIsLightboxOpen(false)}
                        className="absolute top-6 right-6 w-12 h-12 rounded-full glass flex items-center justify-center text-white hover:bg-white/10 transition-colors z-10"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {/* Image Counter */}
                    <div className="absolute top-6 left-6 px-4 py-2 glass rounded-full text-sm font-medium z-10">
                        <span className="text-cyber-cyan">{selectedIndex + 1}</span>
                        <span className="text-gray-500"> / {images.length}</span>
                    </div>

                    {/* Main Lightbox Image */}
                    <div
                        className={`relative max-w-[90vw] max-h-[85vh] transition-transform duration-300 ${isZoomed ? 'cursor-zoom-out scale-150' : 'cursor-zoom-in'}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsZoomed(!isZoomed);
                        }}
                    >
                        <img
                            src={selectedImage}
                            alt={title}
                            className="max-w-full max-h-[85vh] object-contain"
                        />
                    </div>

                    {/* Navigation Arrows */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); goToPrev(); }}
                                className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full glass flex items-center justify-center text-white hover:bg-cyber-cyan/20 hover:border-cyber-cyan/50 hover:shadow-glow-cyan transition-all"
                            >
                                <ChevronLeft className="w-7 h-7" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); goToNext(); }}
                                className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full glass flex items-center justify-center text-white hover:bg-cyber-cyan/20 hover:border-cyber-cyan/50 hover:shadow-glow-cyan transition-all"
                            >
                                <ChevronRight className="w-7 h-7" />
                            </button>
                        </>
                    )}

                    {/* Thumbnail Strip at Bottom */}
                    {images.length > 1 && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 p-3 glass rounded-2xl max-w-[90vw] overflow-x-auto">
                            {images.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={(e) => { e.stopPropagation(); setSelectedIndex(index); }}
                                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all ${selectedIndex === index
                                            ? "ring-2 ring-cyber-cyan scale-110"
                                            : "opacity-50 hover:opacity-100"
                                        }`}
                                >
                                    <img
                                        src={img.url}
                                        alt={`${title} ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
