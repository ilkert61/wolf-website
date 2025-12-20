"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, ChevronRight, ChevronDown, GripVertical, Save, X } from "lucide-react";
import { Reorder, useDragControls, AnimatePresence, motion } from "framer-motion";

// Types
interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    imageUrl?: string;
    attributes?: string; // JSON string
    parentId?: number | null;
    order: number;
    children?: Category[];
    _count?: {
        products: number;
    };
}

interface CategoryFormData {
    name: string;
    slug: string;
    description: string;
    imageUrl: string;
    attributes: string; // "Brand, Color" (comma separated for UI)
    parentId: string; // "null" or ID
}

const initialForm: CategoryFormData = {
    name: "",
    slug: "",
    description: "",
    imageUrl: "",
    attributes: "",
    parentId: "null",
};

// Recursive Sortable List Component
const CategoryList = ({
    items,
    parentId,
    level = 0,
    expanded,
    toggleExpand,
    handleOpenModal,
    handleDelete,
    handleReorder
}: {
    items: Category[],
    parentId: number | null,
    level?: number,
    expanded: Set<number>,
    toggleExpand: (id: number) => void,
    handleOpenModal: (c?: Category) => void,
    handleDelete: (id: number) => void,
    handleReorder: (newOrder: Category[], parentId: number | null) => void
}) => {
    // Local state for immediate drag feedback
    const [listItems, setListItems] = useState(items);

    useEffect(() => {
        setListItems(items);
    }, [items]);

    const onReorderLocal = (newOrder: Category[]) => {
        setListItems(newOrder);
        handleReorder(newOrder, parentId);
    };

    return (
        <Reorder.Group axis="y" values={listItems} onReorder={onReorderLocal} className="space-y-2">
            {listItems.map((item) => (
                <CategoryItem
                    key={item.id}
                    item={item}
                    level={level}
                    expanded={expanded}
                    toggleExpand={toggleExpand}
                    handleOpenModal={handleOpenModal}
                    handleDelete={handleDelete}
                    handleReorder={handleReorder}
                />
            ))}
        </Reorder.Group>
    );
};

const CategoryItem = ({
    item,
    level,
    expanded,
    toggleExpand,
    handleOpenModal,
    handleDelete,
    handleReorder
}: {
    item: Category,
    level: number,
    expanded: Set<number>,
    toggleExpand: (id: number) => void,
    handleOpenModal: (c?: Category) => void,
    handleDelete: (id: number) => void,
    handleReorder: (newOrder: Category[], parentId: number | null) => void
}) => {
    const isExpanded = expanded.has(item.id);
    const hasChildren = item.children && item.children.length > 0;
    const dragControls = useDragControls();

    return (
        <Reorder.Item value={item} dragListener={false} dragControls={dragControls}>
            <div
                className={`bg-[#0f1115] border border-white/5 rounded-xl transition-all ${isExpanded ? 'border-cyber-cyan/30' : 'hover:border-white/20'}`}
                style={{ marginLeft: `${level * 24}px` }}
            >
                <div className="flex items-center p-3 gap-3">
                    {/* Drag Handle */}
                    <div
                        onPointerDown={(e) => dragControls.start(e)}
                        className="p-2 cursor-grab active:cursor-grabbing text-gray-500 hover:text-white transition-colors touch-none"
                    >
                        <GripVertical className="w-5 h-5" />
                    </div>

                    {/* Expand Toggle */}
                    <div className="flex-shrink-0">
                        {hasChildren ? (
                            <button
                                onClick={() => toggleExpand(item.id)}
                                className="p-1 rounded-lg hover:bg-white/5 text-cyber-cyan transition-colors"
                            >
                                {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                            </button>
                        ) : (
                            <div className="w-7 h-7" /> // Spacer
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white flex items-center gap-2 truncate">
                            <span className="truncate">{item.name}</span>
                            <span className="text-xs font-normal text-gray-500 hidden sm:inline-block">/{item.slug}</span>
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span>{item._count?.products || 0} Ürün</span>
                            {item.parentId === null && (
                                <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs border border-blue-500/20 whitespace-nowrap">Ana Kategori</span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                            onClick={() => handleOpenModal(item)}
                            className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors"
                        >
                            <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Nested Children */}
            <AnimatePresence>
                {isExpanded && hasChildren && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mt-2"
                    >
                        <CategoryList
                            items={item.children!}
                            parentId={item.id}
                            level={0}
                            expanded={expanded}
                            toggleExpand={toggleExpand}
                            handleOpenModal={handleOpenModal}
                            handleDelete={handleDelete}
                            handleReorder={handleReorder}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </Reorder.Item>
    );
};

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [flatCategories, setFlatCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState<CategoryFormData>(initialForm);
    const [expanded, setExpanded] = useState<Set<number>>(new Set());
    const [isSavingOrder, setIsSavingOrder] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch("/api/categories");
            const data = await res.json();
            if (Array.isArray(data)) {
                setFlatCategories(data); // Keep flat for dropdowns
                setCategories(buildTree(data));
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    };

    // Helper to build tree from flat list
    const buildTree = (items: Category[]): Category[] => {
        const itemMap = new Map<number, Category>();
        const rootItems: Category[] = [];

        // Clone and map
        items.forEach(item => {
            // @ts-ignore
            itemMap.set(item.id, { ...item, children: [] });
        });

        // Link
        // Sort by order first
        const sortedItems = items.sort((a, b) => (a.order || 0) - (b.order || 0));

        sortedItems.forEach(originalItem => {
            const item = itemMap.get(originalItem.id)!;
            if (item.parentId) {
                const parent = itemMap.get(item.parentId);
                if (parent) {
                    parent.children?.push(item);
                } else {
                    // Parent not found (orphan), treat as root
                    rootItems.push(item);
                }
            } else {
                rootItems.push(item);
            }
        });

        return rootItems;
    };

    const toggleExpand = (id: number) => {
        const newExpanded = new Set(expanded);
        if (newExpanded.has(id)) newExpanded.delete(id);
        else newExpanded.add(id);
        setExpanded(newExpanded);
    };

    const handleOpenModal = (category?: Category) => {
        if (category) {
            setEditingId(category.id);
            setFormData({
                name: category.name,
                slug: category.slug,
                description: category.description || "",
                imageUrl: category.imageUrl || "",
                attributes: category.attributes ? JSON.parse(category.attributes).join(", ") : "",
                parentId: category.parentId ? String(category.parentId) : "null",
            });
        } else {
            setEditingId(null);
            setFormData(initialForm);
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Convert comma-separated attributes to array
        const attributesArray = formData.attributes
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s.length > 0);

        const payload = {
            ...formData,
            attributes: attributesArray.length > 0 ? attributesArray : null,
            parentId: formData.parentId === "null" ? null : Number(formData.parentId),
        };

        try {
            const url = editingId ? `/api/categories/${editingId}` : "/api/categories";
            const method = editingId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const err = await res.json();
                alert(err.error || "İşlem başarısız");
                return;
            }

            setIsModalOpen(false);
            fetchCategories();
        } catch (error) {
            console.error("Submit error:", error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Bu kategoriyi silmek istediğinize emin misiniz?")) return;

        try {
            const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
            if (!res.ok) {
                const err = await res.json();
                alert(err.error || "Silme başarısız");
                return;
            }
            fetchCategories();
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    const handleReorder = async (newOrder: Category[], parentId: number | null = null) => {
        setIsSavingOrder(true);
        const updates = newOrder.map((cat, index) => ({
            id: cat.id,
            order: index,
            parentId: parentId // Keep parent same
        }));

        try {
            await fetch("/api/categories", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates),
            });
            // Re-fetch to ensure sync with server
            // fetchCategories(); 
        } catch (error) {
            console.error("Reorder error:", error);
        } finally {
            setIsSavingOrder(false);
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Kategoriler</h1>
                    <p className="text-gray-400">Ürün kategorilerini ve hiyerarşisini düzenleyin.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-6 py-3 bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/20 rounded-xl hover:bg-cyber-cyan hover:text-surface-dark transition-all font-bold shadow-glow-sm-cyan"
                >
                    <Plus className="w-5 h-5" />
                    Yeni Kategori
                </button>
            </div>

            {/* Content */}
            {loading ? (
                <div className="text-center py-20 text-gray-400">Yükleniyor...</div>
            ) : categories.length === 0 ? (
                <div className="text-center py-20 bg-[#0f1115] rounded-3xl border border-white/5">
                    <p className="text-gray-400 mb-4">Henüz hiç kategori bulunmuyor.</p>
                    <button onClick={() => handleOpenModal()} className="text-cyber-cyan hover:underline">İlk kategoriyi ekle</button>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="p-4 bg-cyber-blue/5 border border-blue-500/20 rounded-xl flex items-center gap-3 text-blue-400 text-sm">
                        <GripVertical className="w-4 h-4" />
                        Kategorileri sürükleyerek sıralarını değiştirebilirsiniz.
                        {isSavingOrder && <span className="ml-auto flex items-center gap-2 text-white"><Save className="w-4 h-4 animate-bounce" /> Kaydediliyor...</span>}
                    </div>

                    {/* Root List */}
                    <CategoryList
                        items={categories}
                        parentId={null}
                        expanded={expanded}
                        toggleExpand={toggleExpand}
                        handleOpenModal={handleOpenModal}
                        handleDelete={handleDelete}
                        handleReorder={handleReorder}
                    />
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-lg bg-[#0f1115] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <h2 className="text-xl font-bold text-white">
                                {editingId ? "Kategoriyi Düzenle" : "Yeni Kategori Ekle"}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1.5">Kategori Adı</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '') })}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyber-cyan transition-colors"
                                    placeholder="Örn: Telefonlar"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1.5">Slug (URL)</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyber-cyan transition-colors font-mono text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1.5">Üst Kategori</label>
                                <select
                                    value={formData.parentId}
                                    onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyber-cyan transition-colors"
                                >
                                    <option value="null">-- Ana Kategori --</option>
                                    {flatCategories
                                        .filter(c => c.id !== editingId) // Prevent selecting self as parent
                                        .map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1.5">Özellikler (Virgül ile ayırın)</label>
                                <input
                                    type="text"
                                    value={formData.attributes}
                                    onChange={(e) => setFormData({ ...formData, attributes: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyber-cyan transition-colors"
                                    placeholder="Örn: Marka, Renk, Hafıza"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1.5">Görsel URL (Opsiyonel)</label>
                                <input
                                    type="text"
                                    value={formData.imageUrl}
                                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyber-cyan transition-colors"
                                    placeholder="https://..."
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors font-medium"
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 rounded-xl bg-cyber-cyan text-surface-dark hover:bg-cyan-400 transition-colors font-bold"
                                >
                                    Kaydet
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
