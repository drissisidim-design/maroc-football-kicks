import { ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShoppingBag, Loader2, Heart } from "lucide-react";
import { toast } from "sonner";

interface ProductCardProps {
  product: ShopifyProduct;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const { node } = product;
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);
  const openCart = useCartStore((s) => s.openCart);
  const toggleFav = useWishlistStore((s) => s.toggle);
  const isFav = useWishlistStore((s) => s.isFavorite(node.handle));

  const price = parseFloat(node.priceRange.minVariantPrice.amount);
  const compareAt = node.compareAtPriceRange ? parseFloat(node.compareAtPriceRange.maxVariantPrice.amount) : 0;
  const hasDiscount = compareAt > price;
  const discount = hasDiscount ? Math.round(((compareAt - price) / compareAt) * 100) : 0;
  const currency = node.priceRange.minVariantPrice.currencyCode;
  const image = node.images.edges[0]?.node;
  const firstVariant = node.variants.edges[0]?.node;

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!firstVariant) return;
    await addItem({
      product,
      variantId: firstVariant.id,
      variantTitle: firstVariant.title,
      price: firstVariant.price,
      quantity: 1,
      selectedOptions: firstVariant.selectedOptions || [],
    });
    toast.success("Ajouté au panier !");
    openCart();
  };

  const handleToggleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFav(node.handle);
    toast(isFav ? "Retiré des favoris" : "Ajouté aux favoris ❤️");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Link to={`/product/${node.handle}`} className="group block">
        <div className="relative overflow-hidden rounded-lg bg-secondary/30 aspect-square">
          {image ? (
            <img
              src={image.url}
              alt={image.altText || node.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">No image</div>
          )}

          {hasDiscount && (
            <span className="absolute top-3 left-3 px-2 py-1 text-xs font-bold rounded bg-primary text-primary-foreground">
              -{discount}%
            </span>
          )}

          {/* Wishlist heart */}
          <button
            onClick={handleToggleFav}
            className="absolute top-3 right-3 p-2 rounded-full bg-background/60 backdrop-blur-sm hover:bg-background/80 transition-colors z-10"
            aria-label={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            <Heart className={`w-4 h-4 transition-colors ${isFav ? "fill-destructive text-destructive" : "text-foreground"}`} />
          </button>

          <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
            <span className="font-display text-sm tracking-widest uppercase text-primary border border-primary px-4 py-2 rounded">
              Voir le produit
            </span>
            {firstVariant && (
              <button
                onClick={handleQuickAdd}
                disabled={isLoading}
                className="p-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/80 transition-colors"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingBag className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>

        <div className="mt-3 space-y-1">
          <h3 className="font-medium text-sm leading-tight group-hover:text-primary transition-colors">{node.title}</h3>
          <div className="flex items-center gap-2">
            <span className="font-display text-lg neon-text">{price.toFixed(2)} {currency}</span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">{compareAt.toFixed(2)} {currency}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
