import { motion } from "framer-motion";
import { Shield, Truck, Award, Users } from "lucide-react";

const values = [
  { icon: Shield, title: "Authenticité", desc: "Tous nos produits sont 100% authentiques et proviennent directement des marques officielles." },
  { icon: Truck, title: "Livraison rapide", desc: "Livraison partout au Maroc en 24 à 72h selon votre ville." },
  { icon: Award, title: "Qualité", desc: "Nous sélectionnons uniquement les meilleures chaussures de football pour nos clients." },
  { icon: Users, title: "Service client", desc: "Une équipe dédiée pour vous accompagner avant et après votre achat." },
];

const About = () => (
  <div className="min-h-screen pt-24 pb-16">
    <div className="container mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
        <p className="text-primary font-display tracking-[0.3em] uppercase text-xs mb-2">Qui sommes-nous</p>
        <h1 className="font-display text-4xl md:text-5xl font-bold uppercase">À propos</h1>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="font-display text-2xl font-bold uppercase mb-6">
            La référence du football au <span className="neon-text">Maroc</span>
          </h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Godasses.ma est née d'une passion pour le football et le désir d'offrir aux joueurs marocains
              l'accès aux meilleures chaussures de football du marché.
            </p>
            <p>
              Que vous soyez un joueur professionnel, amateur ou simplement passionné, nous avons la paire
              parfaite pour vous. Notre sélection comprend les dernières collections de Nike, Adidas, Puma
              et bien d'autres marques reconnues.
            </p>
            <p>
              Basés à Casablanca, nous livrons dans tout le Maroc avec un service rapide et fiable.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="relative aspect-video rounded-lg overflow-hidden bg-secondary/30 flex items-center justify-center"
        >
          <div className="text-center">
            <p className="font-display text-6xl font-bold neon-text">🇲🇦</p>
            <p className="font-display text-xl uppercase tracking-wider mt-4">Made for Morocco</p>
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
        <p className="text-primary font-display tracking-[0.3em] uppercase text-xs mb-2 text-center">Nos valeurs</p>
        <h2 className="font-display text-3xl font-bold uppercase mb-12 text-center">Pourquoi nous choisir</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-lg p-6 text-center"
            >
              <div className="inline-flex p-3 rounded-lg bg-primary/10 mb-4">
                <v.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display uppercase tracking-wider text-sm mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </div>
);

export default About;
