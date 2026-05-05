import { useState, useMemo, useRef, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, ShoppingBag, Package, Loader2, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingTelegram from "@/components/FloatingTelegram";
import OrderModal, { type OrderItem } from "@/components/OrderModal";
import { useGroupedProducts } from "@/hooks/useProducts";
import type { GroupedProduct } from "@/data/products";

const CATEGORIES = [
  "Кабельные наконечники",
  "Изолированные наконечники",
  "Низковольтная продукция",
  "Измерительные приборы",
  "Клеммы и шины",
  "Монтажные аксессуары",
  "Термоусадка и изоляция",
  "Инструменты",
];

const catTranslationKeys: Record<string, string> = {
  "Измерительные приборы": "cat.measuring",
  "Изолированные наконечники": "cat.insulated",
  "Инструменты": "cat.tools",
  "Кабельные наконечники": "cat.cable",
  "Клеммы и шины": "cat.terminals",
  "Монтажные аксессуары": "cat.mounting",
  "Низковольтная продукция": "cat.lowvolt",
  "Термоусадка и изоляция": "cat.heatshrink",
};

type SortOption = "name" | "nameDesc" | "new" | "variantsDesc";

const ProductCard = ({
  product,
  onOrder,
}: {
  product: GroupedProduct;
  onOrder: (item: OrderItem) => void;
}) => {
  const { t } = useLang();
  const hasMultiple = product.variants.length > 1;

  return (
    <div className="group flex flex-col rounded-xl border bg-background overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30">
      <Link to={`/product/${product.id}`} className="relative aspect-square overflow-hidden bg-secondary/30">
        <img
          src={product.image}
          alt={product.baseName}
          className="h-full w-full object-contain p-3 sm:p-4 transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder.svg";
          }}
        />
      </Link>

      <div className="flex flex-1 flex-col p-2 sm:p-4 gap-1 sm:gap-2">
        <p className="text-[9px] sm:text-xs text-muted-foreground truncate">{product.brand}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="text-[11px] sm:text-sm font-semibold leading-snug line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] hover:text-primary transition-colors">
            {product.baseName}
          </h3>
        </Link>

        <div className="mt-auto pt-2 sm:pt-3 space-y-1.5 sm:space-y-2">
          <span className="text-[10px] sm:text-sm font-semibold text-muted-foreground block">{t("catalog.negotiable")}</span>
          <button
            onClick={(e) => {
              e.preventDefault();
              onOrder({ product, selectedVariant: product.variants[0].name });
            }}
            className="flex w-full h-7 sm:h-9 items-center justify-center gap-1 sm:gap-1.5 rounded-lg bg-primary px-2 text-[10px] sm:text-xs font-semibold text-primary-foreground transition-all hover:brightness-110 active:scale-[0.95]"
          >
            <ShoppingBag className="h-3 w-3 shrink-0" />
            <span className="truncate">{t("catalog.order")}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const CatalogPage = () => {
  const { t } = useLang();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "";
  const activeBrand = searchParams.get("brand") || "";
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [orderItem, setOrderItem] = useState<OrderItem | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const { grouped, isLoading } = useGroupedProducts();

  // Extract unique brands
  const brands = useMemo(() => {
    const s = new Set<string>();
    grouped.forEach((p) => s.add(p.brand));
    return Array.from(s).sort();
  }, [grouped]);

  // Search suggestions
  const suggestions = useMemo(() => {
    if (searchQuery.trim().length < 2) return [];
    const q = searchQuery.toLowerCase();
    const matches: string[] = [];
    for (const p of grouped) {
      if (p.baseName.toLowerCase().includes(q) && !matches.includes(p.baseName)) {
        matches.push(p.baseName);
      }
      if (matches.length >= 6) break;
    }
    return matches;
  }, [grouped, searchQuery]);

  // Close suggestions on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = useMemo(() => {
    let result = grouped;
    if (activeCategory) {
      result = result.filter((p) => p.category === activeCategory);
    }
    if (activeBrand) {
      result = result.filter((p) => p.brand === activeBrand);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.baseName.toLowerCase().includes(q) ||
          p.variants.some((v) => v.name.toLowerCase().includes(q)) ||
          p.brand.toLowerCase().includes(q)
      );
    }
    // Sort
    switch (sortBy) {
      case "name":
        result = [...result].sort((a, b) => a.baseName.localeCompare(b.baseName));
        break;
      case "nameDesc":
        result = [...result].sort((a, b) => b.baseName.localeCompare(a.baseName));
        break;
      case "new":
        result = [...result].sort((a, b) => b.id - a.id);
        break;
      case "variantsDesc":
        result = [...result].sort((a, b) => b.variants.length - a.variants.length);
        break;
    }
    return result;
  }, [grouped, activeCategory, activeBrand, searchQuery, sortBy]);

  const handleCategoryClick = (cat: string) => {
    const params = new URLSearchParams(searchParams);
    if (cat === activeCategory) {
      params.delete("category");
    } else {
      params.set("category", cat);
    }
    setSearchParams(params);
  };

  const handleBrandClick = (brand: string) => {
    const params = new URLSearchParams(searchParams);
    if (brand === activeBrand) {
      params.delete("brand");
    } else {
      params.set("brand", brand);
    }
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams({});
    setSearchQuery("");
    setSortBy("name");
  };

  const hasActiveFilters = activeCategory || activeBrand || searchQuery;

  const FiltersContent = () => (
    <div className="space-y-4">
      {/* Search */}
      <div ref={searchRef} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder={t("catalog.search")}
          className="w-full rounded-lg border bg-background py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
          </button>
        )}
        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 rounded-lg border bg-background shadow-lg z-20 overflow-hidden">
            {suggestions.map((s, i) => (
              <button
                key={i}
                className="w-full text-left px-3 py-2 text-sm hover:bg-secondary transition-colors truncate"
                onClick={() => {
                  setSearchQuery(s);
                  setShowSuggestions(false);
                }}
              >
                <Search className="inline h-3 w-3 mr-2 text-muted-foreground" />
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Sort */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">{t("catalog.sort")}</label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="w-full rounded-lg border bg-background py-2 px-3 text-sm outline-none focus:border-primary"
        >
          <option value="name">{t("catalog.sort.name")}</option>
          <option value="nameDesc">{t("catalog.sort.nameDesc")}</option>
          <option value="new">{t("catalog.sort.new")}</option>
          <option value="variantsDesc">{t("catalog.sort.variantsDesc")}</option>
        </select>
      </div>

      {/* Categories */}
      <div className="space-y-1">
        <button
          onClick={() => {
            const params = new URLSearchParams(searchParams);
            params.delete("category");
            setSearchParams(params);
          }}
          className={`w-full text-left rounded-lg px-3 py-2 text-sm font-medium transition-colors active:scale-[0.98] ${!activeCategory ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}
        >
          {t("catalog.all")}
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            className={`w-full text-left rounded-lg px-3 py-2 text-sm font-medium transition-colors active:scale-[0.98] ${activeCategory === cat ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}
          >
            {t(catTranslationKeys[cat] || cat)}
          </button>
        ))}
      </div>

      {/* Brands */}
      {brands.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs font-semibold text-muted-foreground mb-1.5">{t("catalog.brands")}</p>
          <button
            onClick={() => {
              const params = new URLSearchParams(searchParams);
              params.delete("brand");
              setSearchParams(params);
            }}
            className={`w-full text-left rounded-lg px-3 py-2 text-sm font-medium transition-colors active:scale-[0.98] ${!activeBrand ? "bg-primary/10 text-primary font-semibold" : "hover:bg-secondary"}`}
          >
            {t("catalog.allBrands")}
          </button>
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => handleBrandClick(brand)}
              className={`w-full text-left rounded-lg px-3 py-2 text-sm font-medium transition-colors active:scale-[0.98] ${activeBrand === brand ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}
            >
              {brand}
            </button>
          ))}
        </div>
      )}

      {/* Clear filters */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-destructive/30 py-2 text-sm font-medium text-destructive hover:bg-destructive/5 transition-colors"
        >
          <X className="h-3.5 w-3.5" />
          {t("catalog.clear")}
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <Navbar />
      <main className="flex-1">
      <div className="bg-section-alt border-b">
  <div className="container py-6 sm:py-10">
    
    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1 sm:mb-2">
      {t("catalog.title")}
    </h1>

    <p className="text-muted-foreground text-xs sm:text-sm">
      {filtered.length} {t("catalog.items")}
    </p>

    {/* 🔥 ВСТАВЛЯЕШЬ ВОТ ЭТО */}
    <div className="mt-4 p-4 rounded-xl border border-dashed bg-gray-50 text-center">
      <p className="text-sm text-gray-600 mb-2">
        Не нашли нужный товар?
      </p>

      <a
        href="/price-list-2026.pdf"
        download
        className="inline-block px-5 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg transition"
      >
        📥 Скачать полный каталог
      </a>
    </div>

  </div>
</div>

        <div className="container py-4 sm:py-8">
          {/* Mobile filter toggle */}
          <div className="lg:hidden mb-4 flex gap-2">
            <div ref={searchRef} className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder={t("catalog.search")}
                className="w-full rounded-lg border bg-background py-2.5 pl-10 pr-8 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              )}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 rounded-lg border bg-background shadow-lg z-20 overflow-hidden">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-secondary transition-colors truncate"
                      onClick={() => {
                        setSearchQuery(s);
                        setShowSuggestions(false);
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors shrink-0 ${mobileFiltersOpen ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <ChevronDown className={`h-3 w-3 transition-transform ${mobileFiltersOpen ? "rotate-180" : ""}`} />
            </button>
          </div>

          {/* Mobile filters panel */}
          {mobileFiltersOpen && (
            <div className="lg:hidden mb-4 rounded-xl border bg-background p-4 animate-fade-in">
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">{t("catalog.sort")}</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="w-full rounded-lg border bg-background py-2 px-3 text-sm outline-none focus:border-primary"
                  >
                    <option value="name">{t("catalog.sort.name")}</option>
                    <option value="nameDesc">{t("catalog.sort.nameDesc")}</option>
                    <option value="new">{t("catalog.sort.new")}</option>
                    <option value="variantsDesc">{t("catalog.sort.variantsDesc")}</option>
                  </select>
                </div>
                {/* Category chips */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1.5">{t("catalog.all")}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => handleCategoryClick(cat)}
                        className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${activeCategory === cat ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/80"}`}
                      >
                        {t(catTranslationKeys[cat] || cat)}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Brand chips */}
                {brands.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1.5">{t("catalog.brands")}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {brands.map((brand) => (
                        <button
                          key={brand}
                          onClick={() => handleBrandClick(brand)}
                          className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${activeBrand === brand ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/80"}`}
                        >
                          {brand}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-destructive/30 py-2 text-sm font-medium text-destructive hover:bg-destructive/5 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                    {t("catalog.clear")}
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Desktop sidebar */}
            <aside className="hidden lg:block lg:w-64 shrink-0">
              <FiltersContent />
            </aside>

            <div className="flex-1">
              {isLoading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : filtered.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4">
                  {filtered.map((p) => (
                    <ProductCard key={p.id} product={p} onOrder={setOrderItem} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Package className="h-12 w-12 text-muted-foreground/40 mb-4" />
                  <p className="font-semibold">{t("catalog.notfound")}</p>
                  <p className="text-sm text-muted-foreground mt-1">{t("catalog.notfound.desc")}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingTelegram />
      {orderItem && <OrderModal item={orderItem} onClose={() => setOrderItem(null)} />}
    </div>
  );
};

export default CatalogPage;
