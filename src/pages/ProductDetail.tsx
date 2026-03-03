import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ShoppingBag, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useShopifyProduct } from "@/hooks/useShopifyProducts";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

const ProductDetail = () => {
  const { handle } = useParams();
  const { data: product, isLoading: productLoading } = useShopifyProduct(handle || "");
  const addItem = useCartStore((s) => s.addItem);
  const cartLoading = useCartStore((s) => s.isLoading);
  const navigate = useNavigate();
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  if (productLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Produit non trouvé</p>
          <Link to="/boutique" className="text-primary hover:underline">Retour à la boutique</Link>
        </div>
      </div>
    );
  }

  const variants = product.variants.edges.map((e) => e.node);
  const selectedVariant = variants.find((v) => v.id === selectedVariantId) || variants[0];
  const price = parseFloat(selectedVariant.price.amount);
  const compareAt = product.compareAtPriceRange
    ? parseFloat(product.compareAtPriceRange.maxVariantPrice.amount)
    : 0;
  const hasDiscount = compareAt > price;
  const discount = hasDiscount ? Math.round(((compareAt - price) / compareAt) * 100) : 0;
  const images = product.images.edges.map((e) => e.node);

  const handleBuyNow = async () => {
    if (!selectedVariant) return;
    await addItem({
      product: { node: product },
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions || [],
    });
    navigate("/commande");
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <Link
          to="/boutique"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Retour à la boutique
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative aspect-square rounded-lg overflow-hidden bg-secondary/30"
          >
            {images[0] ? (
              <motion.img
                src={images[0].url}
                alt={images[0].altText || product.title}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">No image</div>
            )}
            {hasDiscount && (
              <span className="absolute top-4 left-4 px-3 py-1 text-sm font-bold rounded bg-primary text-primary-foreground">
                -{discount}%
              </span>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col"
          >
            <h1 className="font-display text-3xl md:text-4xl font-bold uppercase mb-4">{product.title}</h1>

            <div className="flex items-center gap-3 mb-6">
              <span className="font-display text-3xl neon-text">
                {price.toFixed(2)} {selectedVariant.price.currencyCode}
              </span>
              {hasDiscount && (
                <span className="text-lg text-muted-foreground line-through">
                  {compareAt.toFixed(2)} {selectedVariant.price.currencyCode}
                </span>
              )}
            </div>

            <p className="text-muted-foreground leading-relaxed mb-8">{product.description}</p>

            {/* Options / Variants */}
            {product.options
              .filter((opt) => !(opt.name === "Title" && opt.values.length === 1 && opt.values[0] === "Default Title"))
              .map((option) => {
                const currentValue = selectedVariant.selectedOptions.find((o) => o.name === option.name)?.value;
                return (
                  <div key={option.name} className="mb-6">
                    <h3 className="font-display uppercase tracking-wider text-sm mb-3">{option.name}</h3>
                    <div className="flex flex-wrap gap-2">
                      {option.values.map((value) => {
                        const matchingVariant = variants.find((v) =>
                          v.selectedOptions.some((o) => o.name === option.name && o.value === value) && v.availableForSale
                        );
                        const isSelected = currentValue === value;
                        return (
                          <button
                            key={value}
                            onClick={() => matchingVariant && setSelectedVariantId(matchingVariant.id)}
                            disabled={!matchingVariant}
                            className={`px-4 py-3 rounded-lg text-sm font-medium border transition-all ${
                              isSelected
                                ? "border-primary bg-primary/10 text-primary neon-border"
                                : matchingVariant
                                  ? "border-border text-muted-foreground hover:border-primary/50"
                                  : "border-border text-muted-foreground/40 opacity-50 cursor-not-allowed"
                            }`}
                          >
                            {value}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

            <Button
              onClick={handleBuyNow}
              disabled={cartLoading}
              size="lg"
              className="h-14 font-display tracking-widest uppercase text-sm neon-glow"
            >
              {cartLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" /> Commander maintenant
                </span>
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
