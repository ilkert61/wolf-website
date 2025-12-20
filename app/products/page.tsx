"use client";

import { useState, useEffect, Suspense, memo, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { Filter, SlidersHorizontal, Loader2, Package, Sparkles, Grid3X3, LayoutGrid, X, ChevronDown, ChevronRight } from "lucide-react";

// Helper to debounce function calls
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}

// Standalone Price Range Filter Component - Memoized to prevent re-renders
const PriceRangeFilter = memo(function PriceRangeFilter({
    initialMin,
    initialMax,
    onApply
}: {
    initialMin: string;
    initialMax: string;
    onApply: (min: string, max: string) => void;
}) {
    const minRef = useRef<HTMLInputElement>(null);
    const maxRef = useRef<HTMLInputElement>(null);

    // Initialize refs with initial values on mount
    useEffect(() => {
        if (minRef.current && initialMin) {
            minRef.current.value = initialMin;
        }
        if (maxRef.current && initialMax) {
            maxRef.current.value = initialMax;
        }
    }, []);

    const handleApply = () => {
        const min = minRef.current?.value || "";
        const max = maxRef.current?.value || "";
        onApply(min, max);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleApply();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Only allow numeric input
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
    };

    return (
        <div className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-5 flex items-center gap-2 text-white">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/30 to-emerald-500/10 flex items-center justify-center">
                    <span className="text-cyber-emerald font-bold text-sm">₺</span>
                </div>
                Fiyat Aralığı
            </h2>
            <div className="space-y-3">
                <div className="flex gap-3 items-center">
                    <div className="flex-1">
                        <label className="text-xs text-gray-500 mb-1 block">Minimum</label>
                        <input
                            ref={minRef}
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            placeholder="0"
                            defaultValue={initialMin}
                            onChange={handleInputChange}
                            onBlur={handleApply}
                            onKeyDown={handleKeyDown}
                            className="w-full glass bg-surface-dark/50 border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyber-cyan focus:shadow-glow-sm-cyan transition-all"
                        />
                    </div>
                    <span className="text-gray-600 mt-5">—</span>
                    <div className="flex-1">
                        <label className="text-xs text-gray-500 mb-1 block">Maksimum</label>
                        <input
                            ref={maxRef}
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            placeholder="∞"
                            defaultValue={initialMax}
                            onChange={handleInputChange}
                            onBlur={handleApply}
                            onKeyDown={handleKeyDown}
                            className="w-full glass bg-surface-dark/50 border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyber-cyan focus:shadow-glow-sm-cyan transition-all"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
});

function ProductsContent() {
    // ... (State remain same)
    const router = useRouter();
    const searchParams = useSearchParams();

    // State
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [availableAttributes, setAvailableAttributes] = useState<Record<string, Set<string>>>({});
    const [gridSize, setGridSize] = useState<2 | 3>(3);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    // Filters State
    const [categoryId, setCategoryId] = useState(searchParams.get("categoryId") || "");
    const [sort, setSort] = useState(searchParams.get("sort") || "");
    const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
    const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
    const [isDeal, setIsDeal] = useState(searchParams.get("isDeal") === "true");

    const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});

    // Initial Load
    useEffect(() => {
        fetchCategories();
    }, []);

    // Fetch products when filters change
    useEffect(() => {
        fetchProducts();
        const params = new URLSearchParams();
        if (categoryId) params.set("categoryId", categoryId);
        if (sort) params.set("sort", sort);
        if (minPrice) params.set("minPrice", minPrice);
        if (maxPrice) params.set("maxPrice", maxPrice);
        if (isDeal) params.set("isDeal", "true");
        Object.entries(selectedAttributes).forEach(([key, value]) => {
            params.set(`attr_${key}`, value);
        });
        router.push(`/products?${params.toString()}`, { scroll: false });
    }, [categoryId, sort, minPrice, maxPrice, isDeal, selectedAttributes]);

    const buildTree = (items: any[]) => {
        const itemMap = new Map<number, any>();
        const rootItems: any[] = [];

        // Clone and map
        items.forEach(item => {
            itemMap.set(item.id, { ...item, children: [] });
        });

        // Link
        items.forEach(originalItem => {
            const item = itemMap.get(originalItem.id);
            if (item.parentId) {
                const parent = itemMap.get(item.parentId);
                if (parent) {
                    parent.children.push(item);
                    // Add child counts to parent recursively (optional, or just rely on API)
                } else {
                    rootItems.push(item);
                }
            } else {
                rootItems.push(item);
            }
        });

        return rootItems;
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch("/api/categories");
            if (!res.ok) throw new Error("Failed to fetch categories");
            const data = await res.json();
            if (Array.isArray(data)) {
                // Determine if we need to build tree or if API already returns tree
                // Our API returns flat list ordered by order.
                setCategories(buildTree(data));
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (categoryId) params.set("categoryId", categoryId);
            if (sort) params.set("sort", sort);
            if (minPrice) params.set("minPrice", minPrice);
            if (maxPrice) params.set("maxPrice", maxPrice);
            if (isDeal) params.set("isDeal", "true");
            Object.entries(selectedAttributes).forEach(([key, value]) => {
                params.set(`attr_${key}`, value);
            });

            const res = await fetch(`/api/products?${params.toString()}`);
            if (!res.ok) {
                console.error("Failed to fetch products");
                setProducts([]);
                setLoading(false);
                return;
            }

            const data = await res.json();

            if (Array.isArray(data)) {
                setProducts(data);

                if (categoryId) {
                    const attrs: Record<string, Set<string>> = {};
                    data.forEach((p: any) => {
                        if (p.attributes) {
                            try {
                                const pAttrs = JSON.parse(p.attributes);
                                Object.entries(pAttrs).forEach(([key, value]) => {
                                    if (!attrs[key]) attrs[key] = new Set();
                                    attrs[key].add(String(value));
                                });
                            } catch (e) { }
                        }
                    });
                    setAvailableAttributes(attrs);
                } else {
                    setAvailableAttributes({});
                }
            } else {
                setProducts([]);
                setAvailableAttributes({});
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (id: string) => {
        setCategoryId(id);
        setSelectedAttributes({});
    };

    const handleAttributeChange = (attrName: string, value: string) => {
        setSelectedAttributes(prev => {
            const newAttrs = { ...prev };
            if (newAttrs[attrName] === value) {
                delete newAttrs[attrName];
            } else {
                newAttrs[attrName] = value;
            }
            return newAttrs;
        });
    };

    const clearAllFilters = () => {
        setCategoryId("");
        setMinPrice("");
        setMaxPrice("");
        setSelectedAttributes({});
        setSort("");
        setIsDeal(false);
    };

    const selectedCategory = categories.find(c => c.id === Number(categoryId));
    const hasActiveFilters = categoryId || minPrice || maxPrice || isDeal || Object.keys(selectedAttributes).length > 0;

    // Recursive Sidebar Category Item
    const SidebarCategoryItem = ({
        category,
        categoryId,
        level = 0
    }: {
        category: any,
        categoryId: string,
        level?: number
    }) => {
        const [isExpanded, setIsExpanded] = useState(false);
        const hasChildren = category.children && category.children.length > 0;
        const isSelected = Number(categoryId) === category.id;

        // Auto expand if selected or child is selected
        useEffect(() => {
            const isChildSelected = (cat: any): boolean => {
                if (Number(categoryId) === cat.id) return true;
                return cat.children?.some(isChildSelected) || false;
            };

            if (isSelected || (hasChildren && isChildSelected(category))) {
                setIsExpanded(true);
            }
        }, [categoryId, category, hasChildren, isSelected]);

        return (
            <li>
                <div className="flex items-center gap-1 group">
                    <button
                        onClick={() => handleCategoryChange(String(category.id))}
                        className={`flex-1 text-left flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-200 text-sm ${isSelected
                            ? "bg-gradient-cyber text-surface-dark font-semibold shadow-glow-sm-cyan"
                            : "hover:bg-white/5 text-gray-400 hover:text-white"
                            }`}
                        style={{ marginLeft: `${level * 16}px` }}
                    >
                        <span className="truncate">{category.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ml-2 ${isSelected ? "bg-surface-dark/30" : "bg-surface-medium text-gray-500"
                            }`}>
                            {category._count?.products || 0}
                        </span>
                    </button>

                    {hasChildren && (
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                            className={`p-2 rounded-lg transition-colors ${isSelected ? "text-cyber-cyan bg-white/10" : "text-gray-500 hover:text-white hover:bg-white/5"}`}
                        >
                            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                        </button>
                    )}
                </div>

                {hasChildren && isExpanded && (
                    <ul className="space-y-1 mt-1 block animate-in slide-in-from-top-1 duration-200">
                        {category.children.map((child: any) => (
                            <SidebarCategoryItem
                                key={child.id}
                                category={child}
                                categoryId={categoryId}
                                level={level + 1}
                            />
                        ))}
                    </ul>
                )}
            </li>
        );
    };

    // Filter Sidebar Component - Extracted to prevent re-renders
    const FilterSidebar = ({
        categories,
        categoryId,
        handleCategoryChange,
        minPrice,
        maxPrice,
        setMinPrice,
        setMaxPrice,
        availableAttributes,
        selectedAttributes,
        handleAttributeChange,
        sort,
        setSort,
        hasActiveFilters,
        clearAllFilters,
        isDeal,
        setIsDeal
    }: any) => (
        <div className="space-y-6">
            {/* Categories */}
            <div className="glass-card rounded-2xl p-6">
                <h2 className="text-lg font-bold mb-5 flex items-center gap-2 text-white">
                    <div className="w-8 h-8 rounded-lg bg-gradient-cyber flex items-center justify-center">
                        <Filter className="w-4 h-4 text-surface-dark" />
                    </div>
                    Kategoriler
                </h2>
                <ul className="space-y-1.5">
                    <li>
                        <button
                            onClick={() => handleCategoryChange("")}
                            className={`w-full text-left flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${!categoryId
                                ? "bg-gradient-cyber text-surface-dark font-semibold shadow-glow-sm-cyan"
                                : "hover:bg-white/5 text-gray-400 hover:text-white"
                                }`}
                        >
                            <span className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                Tüm Ürünler
                            </span>
                        </button>
                    </li>
                    {categories.map((cat: any) => (
                        <SidebarCategoryItem key={cat.id} category={cat} categoryId={categoryId} />
                    ))}
                </ul>
            </div>

            {/* Price Filter - Using memoized component to prevent focus loss */}
            <PriceRangeFilter
                initialMin={minPrice}
                initialMax={maxPrice}
                onApply={(min, max) => {
                    setMinPrice(min);
                    setMaxPrice(max);
                }}
            />

            {/* Deal of the Week Filter */}
            <div className="glass-card rounded-2xl p-6">
                <h2 className="text-lg font-bold mb-5 flex items-center gap-2 text-white">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500/30 to-red-500/10 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-orange-400" />
                    </div>
                    Kampanyalar
                </h2>
                <label className="flex items-center justify-between cursor-pointer group">
                    <span className="flex items-center gap-2 text-gray-300 group-hover:text-white transition-colors">
                        Haftanın Fırsatları
                        {isDeal && <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />}
                    </span>
                    <div className="relative">
                        <input
                            type="checkbox"
                            checked={isDeal}
                            onChange={(e) => setIsDeal(e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-orange-500 peer-checked:to-red-500"></div>
                    </div>
                </label>
            </div>

            {/* Dynamic Attributes Filter */}
            {categoryId && Object.keys(availableAttributes).length > 0 && (
                <div className="glass-card rounded-2xl p-6 space-y-5">
                    <h2 className="text-lg font-bold flex items-center gap-2 text-white">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/30 to-violet-500/10 flex items-center justify-center">
                            <SlidersHorizontal className="w-4 h-4 text-cyber-violet" />
                        </div>
                        Özellikler
                    </h2>
                    {Object.entries(availableAttributes).map(([attrName, values]: [string, any]) => (
                        <div key={attrName}>
                            <h3 className="text-sm font-semibold text-cyber-cyan mb-3 uppercase tracking-wider">{attrName}</h3>
                            <div className="space-y-2">
                                {Array.from(values as Set<string>).map((val) => (
                                    <label key={val} className="flex items-center gap-3 cursor-pointer group p-2 -mx-2 rounded-lg hover:bg-white/5 transition-colors">
                                        <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${selectedAttributes[attrName] === val
                                            ? "bg-gradient-cyber border-transparent shadow-glow-sm-cyan"
                                            : "border-gray-600 group-hover:border-gray-400"
                                            }`}>
                                            {selectedAttributes[attrName] === val && (
                                                <svg className="w-3 h-3 text-surface-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={selectedAttributes[attrName] === val}
                                            onChange={() => handleAttributeChange(attrName, val)}
                                        />
                                        <span className={`text-sm transition-colors ${selectedAttributes[attrName] === val ? "text-white font-medium" : "text-gray-400"}`}>
                                            {val}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Sort */}
            <div className="glass-card rounded-2xl p-6">
                <h2 className="text-lg font-bold mb-5 flex items-center gap-2 text-white">
                    <div className="w-8 h-8 rounded-lg bg-gradient-accent flex items-center justify-center">
                        <SlidersHorizontal className="w-4 h-4 text-white" />
                    </div>
                    Sıralama
                </h2>
                <div className="space-y-1.5">
                    {[
                        { label: "En Yeniler", value: "", icon: "🆕" },
                        { label: "Fiyat: Düşükten Yükseğe", value: "price_asc", icon: "📈" },
                        { label: "Fiyat: Yüksekten Düşüğe", value: "price_desc", icon: "📉" },
                    ].map((option) => (
                        <button
                            key={option.label}
                            onClick={() => setSort(option.value)}
                            className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 ${sort === option.value
                                ? "bg-gradient-accent text-white shadow-glow-sm-cyan font-medium"
                                : "hover:bg-white/5 text-gray-400 hover:text-white"
                                }`}
                        >
                            <span>{option.icon}</span>
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
                <button
                    onClick={clearAllFilters}
                    className="w-full py-3 px-4 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all flex items-center justify-center gap-2"
                >
                    <X className="w-4 h-4" />
                    Filtreleri Temizle
                </button>
            )}
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8 pt-28 min-h-screen">
            {/* Hero Header */}
            <div className="relative mb-8 p-6 md:p-8 rounded-3xl glass-card overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyber-cyan/10 rounded-full blur-[80px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyber-violet/10 rounded-full blur-[80px] pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black mb-2">
                            <span className="text-white">{selectedCategory ? selectedCategory.name : "Tüm "}</span>
                            <span className="gradient-text">{selectedCategory ? "" : "Ürünler"}</span>
                        </h1>
                        <p className="text-gray-400 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-cyber-emerald pulse-glow" />
                            {products.length} ürün listeleniyor
                        </p>
                    </div>

                    {/* View Controls */}
                    <div className="flex items-center gap-3">
                        {/* Grid Size Toggle */}
                        <div className="glass rounded-xl p-1 flex gap-1">
                            <button
                                onClick={() => setGridSize(2)}
                                className={`p-2.5 rounded-lg transition-all ${gridSize === 2 ? 'bg-gradient-cyber text-surface-dark' : 'text-gray-400 hover:text-white'}`}
                            >
                                <Grid3X3 className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setGridSize(3)}
                                className={`p-2.5 rounded-lg transition-all ${gridSize === 3 ? 'bg-gradient-cyber text-surface-dark' : 'text-gray-400 hover:text-white'}`}
                            >
                                <LayoutGrid className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Mobile Filter Button */}
                        <button
                            onClick={() => setMobileFiltersOpen(true)}
                            className="lg:hidden glass px-4 py-2.5 rounded-xl flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                        >
                            <Filter className="w-5 h-5" />
                            Filtreler
                            {hasActiveFilters && (
                                <span className="w-2 h-2 rounded-full bg-cyber-cyan" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Desktop Sidebar */}
                <aside className="hidden lg:block w-80 flex-shrink-0">
                    <div className="sticky top-28">
                        <FilterSidebar
                            categories={categories}
                            categoryId={categoryId}
                            handleCategoryChange={handleCategoryChange}
                            minPrice={minPrice}
                            maxPrice={maxPrice}
                            setMinPrice={setMinPrice}
                            setMaxPrice={setMaxPrice}
                            availableAttributes={availableAttributes}
                            selectedAttributes={selectedAttributes}
                            handleAttributeChange={handleAttributeChange}
                            sort={sort}
                            setSort={setSort}
                            hasActiveFilters={hasActiveFilters}
                            clearAllFilters={clearAllFilters}
                            isDeal={isDeal}
                            setIsDeal={setIsDeal}
                        />
                    </div>
                </aside>

                {/* Mobile Filters Modal */}
                {mobileFiltersOpen && (
                    <div className="fixed inset-0 z-50 lg:hidden">
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMobileFiltersOpen(false)} />
                        <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-surface-dark border-l border-white/10 overflow-y-auto">
                            <div className="sticky top-0 bg-surface-dark/95 backdrop-blur-xl z-10 p-4 border-b border-white/10 flex items-center justify-between">
                                <h2 className="text-lg font-bold text-white">Filtreler</h2>
                                <button
                                    onClick={() => setMobileFiltersOpen(false)}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="p-4">
                                <FilterSidebar
                                    categories={categories}
                                    categoryId={categoryId}
                                    handleCategoryChange={handleCategoryChange}
                                    minPrice={minPrice}
                                    maxPrice={maxPrice}
                                    setMinPrice={setMinPrice}
                                    setMaxPrice={setMaxPrice}
                                    availableAttributes={availableAttributes}
                                    selectedAttributes={selectedAttributes}
                                    handleAttributeChange={handleAttributeChange}
                                    sort={sort}
                                    setSort={setSort}
                                    hasActiveFilters={hasActiveFilters}
                                    clearAllFilters={clearAllFilters}
                                    isDeal={isDeal}
                                    setIsDeal={setIsDeal}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Product Grid */}
                <div className="flex-grow">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24 glass-card rounded-3xl">
                            <div className="relative">
                                <Loader2 className="w-16 h-16 animate-spin text-cyber-cyan" />
                                <div className="absolute inset-0 bg-cyber-cyan/20 blur-xl" />
                            </div>
                            <p className="text-gray-400 mt-6">Ürünler yükleniyor...</p>
                        </div>
                    ) : products.length > 0 ? (
                        <div className={`grid gap-6 ${gridSize === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
                            {products.map((product, index) => (
                                <div
                                    key={product.id}
                                    style={{ animationDelay: `${index * 50}ms` }}
                                    className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                                >
                                    <ProductCard
                                        product={{
                                            ...product,
                                            price: Number(product.price),
                                            images: product.images,
                                            category: product.category
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-24 glass-card rounded-3xl">
                            <div className="relative inline-block mb-6">
                                <div className="w-24 h-24 bg-gradient-to-br from-cyber-cyan/20 to-cyber-violet/20 rounded-full flex items-center justify-center">
                                    <Package className="w-12 h-12 text-gray-500" />
                                </div>
                                <div className="absolute inset-0 bg-cyber-cyan/10 blur-2xl" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">Ürün Bulunamadı</h3>
                            <p className="text-gray-400 mb-6">Bu kriterlere uygun ürün bulunmamaktadır.</p>
                            <button
                                onClick={clearAllFilters}
                                className="cyber-button inline-flex items-center gap-2"
                            >
                                <X className="w-4 h-4" />
                                <span>Filtreleri Temizle</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex flex-col items-center justify-center pt-28">
                <div className="relative">
                    <Loader2 className="w-16 h-16 animate-spin text-cyber-cyan" />
                    <div className="absolute inset-0 bg-cyber-cyan/20 blur-xl" />
                </div>
                <p className="text-gray-400 mt-6">Yükleniyor...</p>
            </div>
        }>
            <ProductsContent />
        </Suspense>
    );
}
