import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { ShoppingBag, Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Shop = () => {
  const { data: products = [], isLoading } = useShopifyProducts(50);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [priceRange, setPriceRange] = useState("all");

  const filtered = useMemo(() => {
    let result = [...products];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((p) =>
        p.node.title.toLowerCase().includes(q) || p.node.description.toLowerCase().includes(q)
      );
    }

    // Price filter
    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number);
      result = result.filter((p) => {
        const price = parseFloat(p.node.priceRange.minVariantPrice.amount);
        return max ? price >= min && price <= max : price >= min;
      });
    }

    // Sort
    if (sort === "price-asc") {
      result.sort((a, b) => parseFloat(a.node.priceRange.minVariantPrice.amount) - parseFloat(b.node.priceRange.minVariantPrice.amount));
    } else if (sort === "price-desc") {
      result.sort((a, b) => parseFloat(b.node.priceRange.minVariantPrice.amount) - parseFloat(a.node.priceRange.minVariantPrice.amount));
    } else if (sort === "name") {
      result.sort((a, b) => a.node.title.localeCompare(b.node.title));
    }

    return result;
  }, [products, search, sort, priceRange]);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <p className="text-primary font-display tracking-[0.3em] uppercase text-xs mb-2">Collection</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold uppercase">Boutique</h1>
        </motion.div>

        {/* Filters bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-lg p-4 mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un produit..."
                className="pl-10 h-10 bg-background/50"
              />
            </div>
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="w-full sm:w-[180px] h-10 bg-background/50">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Prix" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les prix</SelectItem>
                <SelectItem value="0-300">Moins de 300 MAD</SelectItem>
                <SelectItem value="300-500">300 - 500 MAD</SelectItem>
                <SelectItem value="500-800">500 - 800 MAD</SelectItem>
                <SelectItem value="800-99999">Plus de 800 MAD</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-full sm:w-[180px] h-10 bg-background/50">
                <ArrowUpDown className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Trier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Par défaut</SelectItem>
                <SelectItem value="price-asc">Prix croissant</SelectItem>
                <SelectItem value="price-desc">Prix décroissant</SelectItem>
                <SelectItem value="name">Nom A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        <p className="text-sm text-muted-foreground mb-6">
          {filtered.length} produit{filtered.length !== 1 ? "s" : ""}
        </p>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-lg bg-secondary/30 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg mb-2">Aucun produit trouvé</p>
            <p className="text-sm text-muted-foreground">
              {search || priceRange !== "all" ? "Essayez de modifier vos filtres." : "Ajoutez des produits à votre store Shopify."}
            </p>
            {(search || priceRange !== "all") && (
              <Button variant="outline" className="mt-4" onClick={() => { setSearch(""); setPriceRange("all"); setSort("default"); }}>
                Réinitialiser les filtres
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product, i) => (
              <ProductCard key={product.node.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
