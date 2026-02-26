import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/stores/cartStore";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2, ArrowRight, Loader2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

const CartDrawer = () => {
  const navigate = useNavigate();
  const { items, isOpen, closeCart, removeItem, updateQuantity, isLoading, isSyncing, syncCart } = useCartStore();
  const totalPrice = useCartStore((s) => s.totalPrice());
  const totalItems = useCartStore((s) => s.totalItems());

  useEffect(() => { if (isOpen) syncCart(); }, [isOpen, syncCart]);

  const handleCheckout = () => {
    closeCart();
    navigate("/commande");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md glass border-l border-border flex flex-col"
          >
            <div className="p-6 flex items-center justify-between border-b border-border">
              <h2 className="font-display text-xl tracking-wider uppercase">
                Panier <span className="neon-text">({totalItems})</span>
              </h2>
              <button onClick={closeCart} className="p-2 hover:text-primary transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Votre panier est vide</p>
                </div>
              ) : (
                <AnimatePresence>
                  {items.map((item) => {
                    const image = item.product.node.images?.edges?.[0]?.node;
                    return (
                      <motion.div
                        key={item.variantId}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex gap-4 p-3 rounded-lg bg-secondary/50"
                      >
                        {image && (
                          <img
                            src={image.url}
                            alt={image.altText || item.product.node.title}
                            className="w-20 h-20 object-cover rounded-md"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{item.product.node.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.selectedOptions.map(o => o.value).join(' • ')}
                          </p>
                          <p className="text-sm font-bold neon-text">
                            {parseFloat(item.price.amount).toFixed(2)} {item.price.currencyCode}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <button
                              onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                              className="w-6 h-6 rounded bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                              className="w-6 h-6 rounded bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(item.variantId)}
                          className="p-1 self-start hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-border space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-display text-lg uppercase tracking-wider">Total</span>
                  <span className="font-display text-2xl neon-text">
                    {totalPrice.toFixed(2)} {items[0]?.price.currencyCode}
                  </span>
                </div>
                <Button
                  onClick={handleCheckout}
                  disabled={isLoading || isSyncing}
                  className="w-full h-12 font-display tracking-widest uppercase text-sm neon-glow"
                >
                  {isLoading || isSyncing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <ArrowRight className="w-4 h-4 mr-2" /> Passer la commande
                    </>
                  )}
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
