import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { ShoppingBag } from "lucide-react";

const Shop = () => {
  const { data: products = [], isLoading } = useShopifyProducts(50);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <p className="text-primary font-display tracking-[0.3em] uppercase text-xs mb-2">Collection</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold uppercase">Boutique</h1>
        </motion.div>

        <p className="text-sm text-muted-foreground mb-6">
          {products.length} produit{products.length !== 1 ? "s" : ""}
        </p>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-lg bg-secondary/30 animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg mb-2">Aucun produit trouvé</p>
            <p className="text-sm text-muted-foreground">
              Ajoutez des produits à votre store Shopify pour les voir ici.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, i) => (
              <ProductCard key={product.node.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
