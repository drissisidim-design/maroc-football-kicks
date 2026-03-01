import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Instagram, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Le nom est requis").max(100),
  email: z.string().trim().email("Email invalide").max(255),
  message: z.string().trim().min(1, "Le message est requis").max(1000),
});

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setSending(true);
    // Simulate send — replace with real endpoint later
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("Message envoyé !", { description: "Nous vous répondrons dans les plus brefs délais." });
    setForm({ name: "", email: "", message: "" });
    setSending(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <p className="text-primary font-display tracking-[0.3em] uppercase text-xs mb-2">Nous contacter</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold uppercase">Contact</h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium mb-2">Nom complet</label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Votre nom"
                className="h-12"
              />
              {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="votre@email.com"
                className="h-12"
              />
              {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <Textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Votre message..."
                rows={6}
              />
              {errors.message && <p className="text-destructive text-xs mt-1">{errors.message}</p>}
            </div>
            <Button type="submit" disabled={sending} size="lg" className="h-14 font-display tracking-widest uppercase text-sm neon-glow w-full sm:w-auto">
              {sending ? "Envoi..." : <><Send className="w-4 h-4 mr-2" /> Envoyer</>}
            </Button>
          </motion.form>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-8"
          >
            <div className="glass rounded-lg p-6 space-y-6">
              <h3 className="font-display uppercase tracking-wider text-sm mb-4">Coordonnées</h3>
              {[
                { icon: Mail, label: "Email", value: "godasses.ma@gmail.com", href: "mailto:godasses.ma@gmail.com" },
                { icon: Phone, label: "Téléphone", value: "+212 6 00 00 00 00", href: "tel:+212600000000" },
                { icon: MapPin, label: "Adresse", value: "Casablanca, Maroc" },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    {href ? (
                      <a href={href} className="text-sm hover:text-primary transition-colors">{value}</a>
                    ) : (
                      <p className="text-sm">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="glass rounded-lg p-6">
              <h3 className="font-display uppercase tracking-wider text-sm mb-4">Suivez-nous</h3>
              <div className="flex gap-4">
                <a href="https://www.instagram.com/godasses.ma?igsh=d29zYnYxOXcwYTdz" target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors">
                  <Instagram className="w-5 h-5 text-primary" />
                </a>
                <a href="https://facebook.com/godasses.ma" target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors">
                  <Facebook className="w-5 h-5 text-primary" />
                </a>
              </div>
            </div>

            <div className="glass rounded-lg p-6">
              <h3 className="font-display uppercase tracking-wider text-sm mb-4">Horaires</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Lun - Ven</span><span>9h - 18h</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Samedi</span><span>10h - 16h</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Dimanche</span><span>Fermé</span></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
