import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, ShoppingBag, CreditCard, Truck, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCartStore } from "@/stores/cartStore";
import { updateCartBuyerIdentity, updateCartNote, BuyerInfo } from "@/lib/shopify";
import { toast } from "sonner";
import { z } from "zod";

const moroccanCities = [
  "Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir", "Meknès",
  "Oujda", "Kénitra", "Tétouan", "Safi", "El Jadida", "Nador", "Béni Mellal",
  "Mohammédia", "Taza", "Khémisset", "Settat", "Berrechid", "Laâyoune",
];

const checkoutSchema = z.object({
  firstName: z.string().trim().min(1, "Prénom requis").max(50),
  lastName: z.string().trim().min(1, "Nom requis").max(50),
  email: z.string().trim().email("Email invalide"),
  phone: z.string().trim().min(10, "Numéro invalide").max(15),
  address1: z.string().trim().min(1, "Adresse requise").max(200),
  address2: z.string().max(200).optional(),
  city: z.string().trim().min(1, "Ville requise"),
  zip: z.string().trim().min(1, "Code postal requis").max(10),
  note: z.string().max(500).optional(),
});

const Checkout = () => {
  const navigate = useNavigate();
  const { items, cartId, getCheckoutUrl } = useCartStore();
  const totalPrice = useCartStore((s) => s.totalPrice());
  const totalItems = useCartStore((s) => s.totalItems());
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    zip: "",
    note: "",
  });

  const update = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: "" }));
  };

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
      toast.error("Erreur panier", { description: "Veuillez réessayer." });
      return;
    }

    setLoading(true);
    try {
      const buyerInfo: BuyerInfo = {
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        address1: form.address1,
        address2: form.address2,
        city: form.city,
        country: "MA",
        zip: form.zip,
      };

      const identityResult = await updateCartBuyerIdentity(cartId, buyerInfo);

      if (!identityResult.success) {
        toast.error("Erreur", { description: "Impossible de mettre à jour vos informations." });
        setLoading(false);
        return;
      }

      if (form.note.trim()) {
        await updateCartNote(cartId, form.note.trim());
      }

      const checkoutUrl = identityResult.checkoutUrl || getCheckoutUrl();
      if (checkoutUrl) {
        window.open(checkoutUrl, "_blank");
        toast.success("Redirection vers le paiement...");
      } else {
        toast.error("Erreur checkout", { description: "URL de paiement non disponible." });
      }
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Erreur", { description: "Une erreur est survenue. Veuillez réessayer." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Retour
          </button>

          <p className="text-primary font-display tracking-[0.3em] uppercase text-xs mb-2">Finaliser</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold uppercase mb-8">Commande</h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Personal info */}
            <div className="glass rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <h2 className="font-display uppercase tracking-wider text-sm">Informations personnelles</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Prénom <span className="text-destructive">*</span></label>
                  <Input value={form.firstName} onChange={(e) => update("firstName", e.target.value)} placeholder="Votre prénom" className="h-11" />
                  {errors.firstName && <p className="text-destructive text-xs mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Nom <span className="text-destructive">*</span></label>
                  <Input value={form.lastName} onChange={(e) => update("lastName", e.target.value)} placeholder="Votre nom" className="h-11" />
                  {errors.lastName && <p className="text-destructive text-xs mt-1">{errors.lastName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Email <span className="text-destructive">*</span></label>
                  <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="votre@email.com" className="h-11" />
                  {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Téléphone <span className="text-destructive">*</span></label>
                  <Input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+212 6XX XXX XXX" className="h-11" />
                  {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone}</p>}
                </div>
              </div>
            </div>

            {/* Shipping */}
            <div className="glass rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Truck className="w-4 h-4 text-primary" />
                </div>
                <h2 className="font-display uppercase tracking-wider text-sm">Adresse de livraison</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Adresse <span className="text-destructive">*</span></label>
                  <Input value={form.address1} onChange={(e) => update("address1", e.target.value)} placeholder="Rue, numéro, quartier" className="h-11" />
                  {errors.address1 && <p className="text-destructive text-xs mt-1">{errors.address1}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Complément d'adresse</label>
                  <Input value={form.address2} onChange={(e) => update("address2", e.target.value)} placeholder="Appartement, étage... (optionnel)" className="h-11" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Ville <span className="text-destructive">*</span></label>
                    <Select value={form.city} onValueChange={(v) => update("city", v)}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Sélectionnez une ville" />
                      </SelectTrigger>
                      <SelectContent>
                        {moroccanCities.map((city) => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.city && <p className="text-destructive text-xs mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Code postal <span className="text-destructive">*</span></label>
                    <Input value={form.zip} onChange={(e) => update("zip", e.target.value)} placeholder="20000" className="h-11" />
                    {errors.zip && <p className="text-destructive text-xs mt-1">{errors.zip}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Note */}
            <div className="glass rounded-lg p-6">
              <label className="block text-sm font-medium mb-2">Note de commande (optionnel)</label>
              <Textarea
                value={form.note}
                onChange={(e) => update("note", e.target.value)}
                placeholder="Instructions spéciales, taille souhaitée, etc."
                rows={3}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              size="lg"
              className="w-full h-14 font-display tracking-widest uppercase text-sm neon-glow"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-2" /> Passer au paiement
                </>
              )}
            </Button>
          </motion.form>

          {/* Order summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="glass rounded-lg p-6 sticky top-24">
              <h3 className="font-display uppercase tracking-wider text-sm mb-4">
                Résumé ({totalItems} article{totalItems !== 1 ? "s" : ""})
              </h3>

              <div className="space-y-3 mb-6 max-h-[400px] overflow-y-auto">
                {items.map((item) => {
                  const image = item.product.node.images?.edges?.[0]?.node;
                  return (
                    <div key={item.variantId} className="flex gap-3">
                      {image && (
                        <img src={image.url} alt={item.product.node.title} className="w-14 h-14 object-cover rounded-md" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.product.node.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.selectedOptions.map((o) => o.value).join(" • ")} × {item.quantity}
                        </p>
                        <p className="text-sm neon-text font-bold">
                          {(parseFloat(item.price.amount) * item.quantity).toFixed(2)} {item.price.currencyCode}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sous-total</span>
                  <span>{totalPrice.toFixed(2)} {items[0]?.price.currencyCode}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Livraison</span>
                  <span className="text-primary">Calculée à l'étape suivante</span>
                </div>
                <div className="flex justify-between font-display text-lg pt-2 border-t border-border mt-2">
                  <span className="uppercase tracking-wider">Total</span>
                  <span className="neon-text">{totalPrice.toFixed(2)} {items[0]?.price.currencyCode}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
