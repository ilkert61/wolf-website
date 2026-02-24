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
    }, [initialMin, initialMax]);

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
        <div className="premium-card p-6">
            <h2 className="text-lg font-bold mb-5 flex items-center gap-2 text-slate-900 dark:text-white">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <span className="text-emerald-500 dark:text-emerald-400 font-bold text-sm">₺</span>
                </div>
                Fiyat Aralığı
            </h2>
            <div className="space-y-3">
                <div className="flex gap-3 items-center">
                    <div className="flex-1">
                        <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block font-bold uppercase tracking-wider">Minimum</label>
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
                            className="premium-input py-2 text-sm"
                        />
                    </div>
                    <span className="text-slate-400 mt-5 font-bold">—</span>
                    <div className="flex-1">
                        <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block font-bold uppercase tracking-wider">Maksimum</label>
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
                            className="premium-input py-2 text-sm"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
});

function ProductsContent() {
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
                            ? "bg-brand-cyan text-white font-bold shadow-sm shadow-brand-cyan/20"
                            : "hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-white"
                            }`}
                        style={{ marginLeft: `${level * 16}px` }}
                    >
                        <span className="truncate">{category.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ml-2 ${isSelected ? "bg-white/20 text-white" : "bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-slate-400"
                            }`}>
                            {category._count?.products || 0}
                        </span>
                    </button>

                    {hasChildren && (
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                            className={`p-2 rounded-lg transition-colors ${isSelected ? "text-brand-cyan bg-brand-cyan/10" : "text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"}`}
                        >
                            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
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
            <div className="premium-card p-6">
                <h2 className="text-lg font-bold mb-5 flex items-center gap-2 text-slate-900 dark:text-white">
                    <div className="w-8 h-8 rounded-lg bg-brand-cyan/10 flex items-center justify-center">
                        <Filter className="w-4 h-4 text-brand-cyan" />
                    </div>
                    Kategoriler
                </h2>
                <ul className="space-y-1.5">
                    <li>
                        <button
                            onClick={() => handleCategoryChange("")}
                            className={`w-full text-left flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${!categoryId
                                ? "bg-brand-cyan text-white font-bold shadow-sm shadow-brand-cyan/20"
                                : "hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-white"
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
            <div className="premium-card p-6">
                <h2 className="text-lg font-bold mb-5 flex items-center gap-2 text-slate-900 dark:text-white">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-orange-500" />
                    </div>
                    Kampanyalar
                </h2>
                <label className="flex items-center justify-between cursor-pointer group">
                    <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                        Haftanın Fırsatları
                        {isDeal && <span className="flex h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />}
                    </span>
                    <div className="relative">
                        <input
                            type="checkbox"
                            checked={isDeal}
                            onChange={(e) => setIsDeal(e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-orange-500 peer-checked:to-red-500 shadow-inner"></div>
                    </div>
                </label>
            </div>

            {/* Dynamic Attributes Filter */}
            {categoryId && Object.keys(availableAttributes).length > 0 && (
                <div className="premium-card p-6 space-y-5">
                    <h2 className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                        <div className="w-8 h-8 rounded-lg bg-brand-violet/10 flex items-center justify-center">
                            <SlidersHorizontal className="w-4 h-4 text-brand-violet" />
                        </div>
                        Özellikler
                    </h2>
                    {Object.entries(availableAttributes).map(([attrName, values]: [string, any]) => (
                        <div key={attrName}>
                            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-widest">{attrName}</h3>
                            <div className="space-y-2">
                                {Array.from(values as Set<string>).map((val) => (
                                    <label key={val} className="flex items-center gap-3 cursor-pointer group p-2 mx-1 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${selectedAttributes[attrName] === val
                                            ? "bg-brand-cyan border-brand-cyan shadow-sm shadow-brand-cyan/30"
                                            : "border-slate-300 dark:border-slate-600 group-hover:border-slate-400 dark:group-hover:border-slate-400"
                                            }`}>
                                            {selectedAttributes[attrName] === val && (
                                                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
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
                                        <span className={`text-sm font-medium transition-colors ${selectedAttributes[attrName] === val ? "text-slate-900 dark:text-white font-bold" : "text-slate-600 dark:text-slate-400"}`}>
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
            <div className="premium-card p-6">
                <h2 className="text-lg font-bold mb-5 flex items-center gap-2 text-slate-900 dark:text-white">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <SlidersHorizontal className="w-4 h-4 text-blue-500" />
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
                                ? "bg-slate-900 text-white dark:bg-white dark:text-black font-bold shadow-md"
                                : "hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium"
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
                    className="w-full py-3 px-4 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 font-bold transition-all flex items-center justify-center gap-2"
                >
                    <X className="w-5 h-5" />
                    Filtreleri Temizle
                </button>
            )}
        </div>
    );

    return (
        <div className="bg-slate-50 dark:bg-[#020202] text-slate-900 dark:text-slate-200 min-h-screen relative overflow-hidden pb-12">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-mesh-light dark:bg-mesh-dark opacity-30 mix-blend-screen pointer-events-none" />

            <div className="container mx-auto px-4 py-8 pt-28 relative z-10">
                {/* Hero Header */}
                <div className="relative mb-8 p-6 md:p-8 rounded-3xl premium-card overflow-hidden bg-white/50 dark:bg-black/20 backdrop-blur-xl">
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-6">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tight line-clamp-1">
                                <span className="text-slate-900 dark:text-white">{selectedCategory ? selectedCategory.name : "Tüm "}</span>
                                <span className="gradient-text">{selectedCategory ? "" : "Ürünler"}</span>
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 flex items-center gap-2 font-medium">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                {products.length} ürün listeleniyor
                            </p>
                        </div>

                        {/* View Controls */}
                        <div className="flex items-center gap-3">
                            {/* Grid Size Toggle */}
                            <div className="bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-xl p-1 flex gap-1">
                                <button
                                    onClick={() => setGridSize(2)}
                                    className={`p-2 rounded-lg transition-all ${gridSize === 2 ? 'bg-white dark:bg-[#0a0a0a] shadow-sm text-slate-900 dark:text-white' : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'}`}
                                >
                                    <Grid3X3 className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setGridSize(3)}
                                    className={`p-2 rounded-lg transition-all ${gridSize === 3 ? 'bg-white dark:bg-[#0a0a0a] shadow-sm text-slate-900 dark:text-white' : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'}`}
                                >
                                    <LayoutGrid className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Mobile Filter Button */}
                            <button
                                onClick={() => setMobileFiltersOpen(true)}
                                className="lg:hidden bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 px-4 py-2 rounded-xl flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-white/10 transition-colors shadow-sm"
                            >
                                <Filter className="w-5 h-5" />
                                Filtreler
                                {hasActiveFilters && (
                                    <span className="w-2.5 h-2.5 rounded-full bg-brand-cyan shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Desktop Sidebar */}
                    <aside className="hidden lg:block w-72 lg:w-80 flex-shrink-0">
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
                        <div className="fixed inset-0 z-[100] lg:hidden">
                            <div className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md" onClick={() => setMobileFiltersOpen(false)} />
                            <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-slate-50 dark:bg-[#0a0a0a] border-l border-slate-200 dark:border-white/10 overflow-y-auto shadow-2xl">
                                <div className="sticky top-0 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-xl z-20 p-5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Filtreler</h2>
                                    <button
                                        onClick={() => setMobileFiltersOpen(false)}
                                        className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors"
                                    >
                                        <X className="w-6 h-6 text-slate-500" />
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
                            <div className="flex flex-col items-center justify-center py-24 premium-card rounded-3xl bg-white/50 dark:bg-black/20">
                                <div className="relative">
                                    <Loader2 className="w-16 h-16 animate-spin text-brand-cyan" />
                                    <div className="absolute inset-0 bg-brand-cyan/20 blur-xl" />
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 font-medium mt-6">Ürünler yükleniyor...</p>
                            </div>
                        ) : products.length > 0 ? (
                            <div className={`grid gap-6 ${gridSize === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'}`}>
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
                            <div className="text-center py-24 premium-card rounded-3xl bg-white/50 dark:bg-black/20">
                                <div className="relative inline-block mb-8">
                                    <div className="w-24 h-24 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full flex items-center justify-center shadow-sm">
                                        <Package className="w-10 h-10 text-slate-400" />
                                    </div>
                                    <div className="absolute inset-0 bg-brand-cyan/5 blur-2xl" />
                                </div>
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">Ürün Bulunamadı</h3>
                                <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">Bu kriterlere uygun ürün bulunmamaktadır.</p>
                                <button
                                    onClick={clearAllFilters}
                                    className="premium-button text-sm inline-flex items-center gap-2 px-8"
                                >
                                    <X className="w-4 h-4" />
                                    <span>Filtreleri Temizle</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex flex-col items-center justify-center pt-28 bg-slate-50 dark:bg-[#020202]">
                <div className="relative">
                    <Loader2 className="w-16 h-16 animate-spin text-brand-cyan" />
                    <div className="absolute inset-0 bg-brand-cyan/20 blur-xl" />
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-bold mt-6">Yükleniyor...</p>
            </div>
        }>
            <ProductsContent />
        </Suspense>
    );
}
