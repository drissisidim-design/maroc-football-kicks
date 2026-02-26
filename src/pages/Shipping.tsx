import { motion } from "framer-motion";
import { Truck, RotateCcw, Clock, MapPin } from "lucide-react";

const policies = [
  {
    icon: Truck,
    title: "Livraison",
    items: [
      "Livraison partout au Maroc",
      "Casablanca, Rabat, Marrakech : 24-48h",
      "Autres villes : 48-72h",
      "Frais de livraison : à partir de 30 MAD",
      "Livraison gratuite à partir de 500 MAD d'achat",
    ],
  },
  {
    icon: RotateCcw,
    title: "Retours",
    items: [
      "Retour gratuit sous 14 jours",
      "Produit non porté et dans son emballage d'origine",
      "Remboursement sous 5 jours ouvrés",
      "Échange possible selon disponibilité",
    ],
  },
  {
    icon: Clock,
    title: "Délais",
    items: [
      "Commandes traitées sous 24h",
      "Expédition du lundi au samedi",
      "Suivi de commande par email",
      "Notification SMS à la livraison",
    ],
  },
  {
    icon: MapPin,
    title: "Zones de livraison",
    items: [
      "Toutes les villes du Maroc",
      "Points relais disponibles dans les grandes villes",
      "Livraison à domicile",
      "Livraison internationale : bientôt disponible",
    ],
  },
];

const Shipping = () => (
  <div className="min-h-screen pt-24 pb-16">
    <div className="container mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
        <p className="text-primary font-display tracking-[0.3em] uppercase text-xs mb-2">Informations</p>
        <h1 className="font-display text-4xl md:text-5xl font-bold uppercase">Livraison & Retours</h1>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {policies.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-lg p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <p.icon className="w-5 h-5 text-primary" />
              </div>
              <h2 className="font-display uppercase tracking-wider text-sm">{p.title}</h2>
            </div>
            <ul className="space-y-2">
              {p.items.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary mt-1">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

export default Shipping;
