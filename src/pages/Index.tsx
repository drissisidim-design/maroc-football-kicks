import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Truck, Shield, RotateCcw, ShoppingBag, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import heroBg from "@/assets/hero-bg.jpg";

const testimonials = [
  { name: "Youssef B.", city: "Casablanca", text: "Qualité incroyable, livraison rapide! Mes Mercurial sont parfaites.", rating: 5 },
  { name: "Amine K.", city: "Rabat", text: "Meilleur store de foot au Maroc, je recommande à 100%!", rating: 5 },
  { name: "Omar H.", city: "Marrakech", text: "Super service client, les chaussures sont authentiques.", rating: 5 },
];

const Index = () => {
  const { data: products = [], isLoading } = useShopifyProducts(6);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
        >
          <img src={heroBg} alt="Chaussures de football" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        </motion.div>

        <div className="relative container mx-auto px-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="max-w-xl">
            <motion.p
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-primary font-display tracking-[0.3em] uppercase text-sm mb-4"
            >
              Nouvelle collection 2026
            </motion.p>
            <motion.h1
              className="font-display text-5xl md:text-7xl font-bold uppercase leading-[0.9] mb-6"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7, ease: "easeOut" }}
            >
              Domine le<br />
              <motion.span
                className="neon-text inline-block"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.5, type: "spring", stiffness: 200 }}
              >
                terrain
              </motion.span>
            </motion.h1>
            <motion.p
              className="text-muted-foreground text-lg mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              Les meilleures chaussures de football des plus grandes marques, livrées partout au Maroc.
            </motion.p>
            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.6 }}
            >
              <Button asChild size="lg" className="font-display tracking-widest uppercase text-sm h-14 px-8 neon-glow">
                <Link to="/boutique">
                  Voir la boutique <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features strip */}
      <section className="border-y border-border">
        <div className="container mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Truck, text: "Livraison partout au Maroc" },
            { icon: Shield, text: "100% Authentique" },
            { icon: RotateCcw, text: "Retours sous 14 jours" },
          ].map(({ icon: Icon, text }, i) => (
            <motion.div
              key={text}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3 justify-center"
            >
              <Icon className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">{text}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-12"
          >
            <div>
              <p className="text-primary font-display tracking-[0.3em] uppercase text-xs mb-2">Populaire</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold uppercase">Nos Produits</h2>
            </div>
            <Link to="/boutique" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
              Tout voir <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-lg bg-secondary/30 animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg mb-2">Aucun produit disponible</p>
              <p className="text-sm text-muted-foreground">Ajoutez des produits à votre store Shopify pour les voir ici.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, i) => (
                <ProductCard key={product.node.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Promo banner */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 gradient-radial" />
        <div className="relative container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <p className="text-primary font-display tracking-[0.3em] uppercase text-xs mb-4">Offre limitée</p>
            <h2 className="font-display text-4xl md:text-6xl font-bold uppercase mb-4">
              Jusqu'à <span className="neon-text">-25%</span>
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Profitez de nos promotions exceptionnelles sur une sélection de chaussures de football.
            </p>
            <Button asChild size="lg" className="font-display tracking-widest uppercase text-sm h-14 px-8 neon-glow">
              <Link to="/boutique">Voir les promos</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-12">
            <p className="text-primary font-display tracking-[0.3em] uppercase text-xs mb-2">Avis clients</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold uppercase">Ce qu'ils disent</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass rounded-lg p-6"
              >
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <p className="font-medium text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.city}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-lg mx-auto text-center">
            <p className="text-primary font-display tracking-[0.3em] uppercase text-xs mb-2">Newsletter</p>
            <h2 className="font-display text-3xl font-bold uppercase mb-4">Restez informé</h2>
            <p className="text-muted-foreground text-sm mb-6">
              Recevez nos offres exclusives et les dernières nouveautés directement dans votre boîte mail.
            </p>
            {subscribed ? (
              <motion.p initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-primary font-medium">
                ✅ Merci pour votre inscription !
              </motion.p>
            ) : (
              <form
                onSubmit={(e) => { e.preventDefault(); if (email.includes("@")) setSubscribed(true); }}
                className="flex gap-2"
              >
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="h-12 flex-1"
                  required
                />
                <Button type="submit" size="lg" className="h-12 font-display tracking-widest uppercase text-xs neon-glow px-6">
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
