import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, ShoppingBag, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/stores/cartStore";
import { updateCartBuyerIdentity, updateCartNote } from "@/lib/shopify";
import { toast } from "sonner";
import { z } from "zod";

const checkoutSchema = z.object({
  firstName: z.string().trim().min(1, "Prénom requis").max(50),
  lastName: z.string().trim().min(1, "Nom requis").max(50),
  phone: z.string().trim().min(10, "Numéro invalide").max(15),
  address1: z.string().trim().min(1, "Adresse requise").max(200),
  city: z.string().trim().min(1, "Ville requise").max(100),
});

const Checkout = () => {
  const navigate = useNavigate();
  const { items, cartId, clearCart } = useCartStore();
  const totalPrice = useCartStore((s) => s.totalPrice());
  const totalItems = useCartStore((s) => s.totalItems());
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address1: "",
    city: "",
  });

  const update = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: "" }));
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md mx-auto px-4">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h1 className="font-display text-3xl font-bold uppercase mb-3">Commande confirmée !</h1>
          <p className="text-muted-foreground mb-2">Merci pour votre commande.</p>
          <p className="text-muted-foreground text-sm mb-6">Nous vous contacterons bientôt pour confirmer la livraison.</p>
          <Button onClick={() => navigate("/boutique")} variant="outline">
            Retour à la boutique
          </Button>
        </motion.div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-lg mb-2">Votre panier est vide</p>
          <Button onClick={() => navigate("/boutique")} variant="outline" className="mt-4">
            Retour à la boutique
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = checkoutSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    if (!cartId) {
      toast.error("Erreur", { description: "Panier introuvable. Veuillez réessayer." });
      return;
    }

    setLoading(true);
    try {
      let phoneClean = form.phone.replace(/[\s()-]/g, '');
      if (phoneClean.startsWith('0')) {
        phoneClean = '+212' + phoneClean.slice(1);
      } else if (!phoneClean.startsWith('+')) {
        phoneClean = '+212' + phoneClean;
      }
      const fakeEmail = `${phoneClean.replace(/[+]/g, '')}@godasses.ma`;

      const identityResult = await updateCartBuyerIdentity(cartId, {
        email: fakeEmail,
        firstName: form.firstName,
        lastName: form.lastName,
        phone: phoneClean,
        address1: form.address1,
        city: form.city,
        country: 'MA',
        zip: '00000',
      });

      if (!identityResult.success) {
        console.error('Buyer identity error:', identityResult.errors);
        toast.error("Erreur", { description: "Impossible de mettre à jour les informations. Veuillez réessayer." });
        setLoading(false);
        return;
      }

      // Add detailed note for merchant to contact the client
      const itemsSummary = items.map(i => `${i.product.node.title} x${i.quantity}`).join(', ');
      await updateCartNote(cartId, `🛒 Commande via godasses.ma\n📞 Tel: ${form.phone}\n👤 ${form.firstName} ${form.lastName}\n📍 ${form.address1}, ${form.city}\n📦 Articles: ${itemsSummary}\n💰 Total: ${totalPrice.toFixed(2)} MAD`);

      setOrderSuccess(true);
      clearCart();
      toast.success("Commande confirmée !");
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Erreur", { description: "Une erreur est survenue. Veuillez réessayer." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Retour
          </button>

          <p className="text-primary font-display tracking-[0.3em] uppercase text-xs mb-2">Finaliser</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold uppercase mb-8">Commande</h1>
        </motion.div>

        {/* Order summary */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="glass rounded-lg p-5 mb-6">
          <h3 className="font-display uppercase tracking-wider text-xs text-muted-foreground mb-3">
            Résumé — {totalItems} article{totalItems !== 1 ? "s" : ""}
          </h3>
          <div className="space-y-3">
            {items.map((item) => {
              const image = item.product.node.images?.edges?.[0]?.node;
              return (
                <div key={item.variantId} className="flex gap-3 items-center">
                  {image && <img src={image.url} alt={item.product.node.title} className="w-12 h-12 object-cover rounded" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.product.node.title}</p>
                    <p className="text-xs text-muted-foreground">× {item.quantity}</p>
                  </div>
                  <p className="text-sm neon-text font-bold whitespace-nowrap">
                    {(parseFloat(item.price.amount) * item.quantity).toFixed(2)} {item.price.currencyCode}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between items-center mt-4 pt-3 border-t border-border">
            <span className="font-display uppercase tracking-wider text-sm">Total</span>
            <span className="font-display text-xl neon-text">{totalPrice.toFixed(2)} {items[0]?.price.currencyCode}</span>
          </div>
        </motion.div>

        {/* Simple form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-lg p-6 space-y-4"
        >
          <h2 className="font-display uppercase tracking-wider text-sm mb-2">Vos informations</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input value={form.firstName} onChange={(e) => update("firstName", e.target.value)} placeholder="Prénom *" className="h-12" />
              {errors.firstName && <p className="text-destructive text-xs mt-1">{errors.firstName}</p>}
            </div>
            <div>
              <Input value={form.lastName} onChange={(e) => update("lastName", e.target.value)} placeholder="Nom *" className="h-12" />
              {errors.lastName && <p className="text-destructive text-xs mt-1">{errors.lastName}</p>}
            </div>
          </div>

          <div>
            <Input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="Téléphone * (ex: 06 12 34 56 78)" className="h-12" />
            {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone}</p>}
          </div>

          <div>
            <Input value={form.address1} onChange={(e) => update("address1", e.target.value)} placeholder="Adresse de livraison *" className="h-12" />
            {errors.address1 && <p className="text-destructive text-xs mt-1">{errors.address1}</p>}
          </div>

          <div>
            <Input value={form.city} onChange={(e) => update("city", e.target.value)} placeholder="Ville *" className="h-12" />
            {errors.city && <p className="text-destructive text-xs mt-1">{errors.city}</p>}
          </div>

          <Button
            type="submit"
            disabled={loading}
            size="lg"
            className="w-full h-14 font-display tracking-widest uppercase text-sm neon-glow mt-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Confirmer la commande"
            )}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Paiement à la livraison — Nous vous contacterons pour confirmer
          </p>
        </motion.form>
      </div>
    </div>
  );
};

export default Checkout;
