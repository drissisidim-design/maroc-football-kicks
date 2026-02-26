import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { useWishlistStore } from "@/stores/wishlistStore";
import { ShoppingBag, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const Wishlist = () => {
  const { data: products = [], isLoading } = useShopifyProducts(50);
  const wishlistItems = useWishlistStore((s) => s.items);
  const clear = useWishlistStore((s) => s.clear);

  const favoriteProducts = products.filter((p) => wishlistItems.includes(p.node.handle));

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <p className="text-primary font-display tracking-[0.3em] uppercase text-xs mb-2">Mes favoris</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold uppercase">Wishlist</h1>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-lg bg-secondary/30 animate-pulse" />
            ))}
          </div>
        ) : favoriteProducts.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg mb-2">Votre wishlist est vide</p>
            <p className="text-sm text-muted-foreground mb-6">Ajoutez des produits en cliquant sur le cœur ❤️</p>
            <Button asChild variant="outline">
              <Link to="/boutique">Voir la boutique</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-muted-foreground">{favoriteProducts.length} produit{favoriteProducts.length !== 1 ? "s" : ""}</p>
              <Button variant="ghost" size="sm" onClick={clear} className="text-xs text-muted-foreground hover:text-destructive">
                Vider la wishlist
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteProducts.map((product, i) => (
                <ProductCard key={product.node.id} product={product} index={i} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
