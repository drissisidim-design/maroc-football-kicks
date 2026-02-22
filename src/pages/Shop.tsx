import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { products, brands, sizes as allSizes } from "@/data/products";
import { SlidersHorizontal, X } from "lucide-react";

const Shop = () => {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<string>("default");
  const [showFilters, setShowFilters] = useState(false);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.brand));
    }
    if (selectedSize) {
      result = result.filter((p) => p.sizes.includes(selectedSize));
    }
    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);
    return result;
  }, [selectedBrands, selectedSize, sortBy]);

  const hasFilters = selectedBrands.length > 0 || selectedSize !== null;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <p className="text-primary font-display tracking-[0.3em] uppercase text-xs mb-2">Collection</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold uppercase">Boutique</h1>
        </motion.div>

        {/* Filter bar */}
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm hover:border-primary hover:text-primary transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filtres {hasFilters && `(${selectedBrands.length + (selectedSize ? 1 : 0)})`}
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg text-sm border border-border focus:border-primary outline-none"
          >
            <option value="default">Trier par</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
          </select>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-8 p-6 rounded-lg glass space-y-6 overflow-hidden"
          >
            <div>
              <h3 className="font-display uppercase tracking-wider text-sm mb-3">Marque</h3>
              <div className="flex flex-wrap gap-2">
                {brands.map((brand) => (
                  <button
                    key={brand}
                    onClick={() => toggleBrand(brand)}
                    className={`px-4 py-2 rounded-lg text-sm border transition-all ${
                      selectedBrands.includes(brand)
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-display uppercase tracking-wider text-sm mb-3">Pointure</h3>
              <div className="flex flex-wrap gap-2">
                {allSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                    className={`w-12 h-10 rounded-lg text-sm border transition-all ${
                      selectedSize === size
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {hasFilters && (
              <button
                onClick={() => { setSelectedBrands([]); setSelectedSize(null); }}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                <X className="w-3 h-3" /> Réinitialiser les filtres
              </button>
            )}
          </motion.div>
        )}

        {/* Results */}
        <p className="text-sm text-muted-foreground mb-6">{filteredProducts.length} produit{filteredProducts.length !== 1 ? "s" : ""}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Aucun produit ne correspond à vos critères.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
