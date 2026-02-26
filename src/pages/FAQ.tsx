import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "Les produits sont-ils authentiques ?", a: "Oui, tous nos produits sont 100% authentiques et proviennent directement des fournisseurs officiels des marques (Nike, Adidas, Puma, etc.)." },
  { q: "Quels sont les délais de livraison ?", a: "La livraison prend entre 24h et 72h selon votre ville au Maroc. Les grandes villes comme Casablanca, Rabat et Marrakech bénéficient généralement d'une livraison en 24h." },
  { q: "Comment choisir ma taille ?", a: "Nous recommandons de vous référer au guide des tailles de chaque marque. En cas de doute, n'hésitez pas à nous contacter et notre équipe vous aidera à trouver la taille idéale." },
  { q: "Puis-je retourner un produit ?", a: "Oui, vous disposez de 14 jours après réception pour retourner un produit. L'article doit être dans son état d'origine, non porté et dans son emballage d'origine." },
  { q: "Quels sont les modes de paiement acceptés ?", a: "Nous acceptons le paiement à la livraison (COD), les virements bancaires et les paiements par carte bancaire via notre checkout sécurisé." },
  { q: "Proposez-vous des remises pour les clubs ?", a: "Oui, nous offrons des tarifs spéciaux pour les commandes en gros (clubs, associations, écoles de foot). Contactez-nous pour un devis personnalisé." },
  { q: "Comment suivre ma commande ?", a: "Après l'expédition, vous recevrez un email avec votre numéro de suivi. Vous pouvez également nous contacter pour connaître le statut de votre commande." },
  { q: "Livrez-vous en dehors du Maroc ?", a: "Pour le moment, nous livrons uniquement au Maroc. La livraison internationale sera disponible prochainement." },
];

const FAQ = () => (
  <div className="min-h-screen pt-24 pb-16">
    <div className="container mx-auto px-4 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
        <p className="text-primary font-display tracking-[0.3em] uppercase text-xs mb-2">Aide</p>
        <h1 className="font-display text-4xl md:text-5xl font-bold uppercase">FAQ</h1>
        <p className="text-muted-foreground mt-4">Trouvez les réponses à vos questions les plus fréquentes.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="glass rounded-lg px-6 border-none">
              <AccordionTrigger className="font-medium text-sm hover:text-primary py-5">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </div>
  </div>
);

export default FAQ;
