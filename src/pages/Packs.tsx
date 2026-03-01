import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { Package, Search, Shirt } from "lucide-react";
import { Input } from "@/components/ui/input";

const PACK_KEYWORDS = ["pack", "tenue", "kit", "ensemble", "maillot"];

const Packs = () => {
  const { data: products = [], isLoading } = useShopifyProducts(50);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "packs" | "tenues">("all");

  const filtered = useMemo(() => {
    // Filter products matching pack/tenue keywords in title or description
    let result = products.filter((p) => {
      const title = p.node.title.toLowerCase();
      const desc = p.node.description.toLowerCase();
      return PACK_KEYWORDS.some((kw) => title.includes(kw) || desc.includes(kw));
    });

    // Tab filter
    if (activeTab === "packs") {
      result = result.filter((p) => {
        const t = p.node.title.toLowerCase();
        return t.includes("pack") || t.includes("kit") || t.includes("ensemble");
      });
    } else if (activeTab === "tenues") {
      result = result.filter((p) => {
        const t = p.node.title.toLowerCase();
        return t.includes("tenue") || t.includes("maillot");
      });
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) => p.node.title.toLowerCase().includes(q) || p.node.description.toLowerCase().includes(q)
      );
    }

    return result;
  }, [products, search, activeTab]);

  const tabs = [
    { key: "all" as const, label: "Tout", icon: Package },
    { key: "packs" as const, label: "Packs", icon: Package },
    { key: "tenues" as const, label: "Tenues", icon: Shirt },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <p className="text-primary font-display tracking-[0.3em] uppercase text-xs mb-2">Offres spéciales</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold uppercase">Packs & Tenues</h1>
          <p className="text-muted-foreground mt-3 max-w-lg">
            Découvrez nos packs et tenues complètes pour le terrain. Équipez-vous comme un pro !
          </p>
        </motion.div>

        {/* Tabs + Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-lg p-4 mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <div className="flex gap-2">
              {tabs.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === key
                      ? "bg-primary text-primary-foreground"
                      : "bg-background/50 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher..."
                className="pl-10 h-10 bg-background/50"
              />
            </div>
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
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg mb-2">Aucun pack ou tenue trouvé</p>
            <p className="text-sm text-muted-foreground">
              Les packs et tenues apparaîtront ici lorsque vous les ajouterez à votre boutique Shopify avec les mots-clés "pack", "tenue", "kit" ou "maillot" dans le titre.
            </p>
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

export default Packs;
