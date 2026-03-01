import { Link } from "react-router-dom";
import { Instagram, Facebook } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border py-16">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <Link to="/" className="font-display text-2xl font-bold tracking-wider">
            <span className="neon-text">GO</span>DASSES
          </Link>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Godasses.ma — Votre destination N°1 pour les chaussures de football authentiques au Maroc 🇲🇦
          </p>
          <div className="flex gap-3 mt-4">
            <a href="https://www.instagram.com/godasses.ma?igsh=d29zYnYxOXcwYTdz" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors">
              <Instagram className="w-4 h-4 text-primary" />
            </a>
            <a href="https://facebook.com/godasses.ma" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors">
              <Facebook className="w-4 h-4 text-primary" />
            </a>
          </div>
        </div>
        <div>
          <h4 className="font-display uppercase tracking-wider text-sm mb-4">Navigation</h4>
          <div className="space-y-2">
            <Link to="/" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Accueil</Link>
            <Link to="/boutique" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Boutique</Link>
            <Link to="/wishlist" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Wishlist</Link>
            <Link to="/a-propos" className="block text-sm text-muted-foreground hover:text-primary transition-colors">À propos</Link>
          </div>
        </div>
        <div>
          <h4 className="font-display uppercase tracking-wider text-sm mb-4">Aide</h4>
          <div className="space-y-2">
            <Link to="/faq" className="block text-sm text-muted-foreground hover:text-primary transition-colors">FAQ</Link>
            <Link to="/livraison" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Livraison & Retours</Link>
            <Link to="/contact" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link>
          </div>
        </div>
        <div>
          <h4 className="font-display uppercase tracking-wider text-sm mb-4">Contact</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <a href="mailto:godasses.ma@gmail.com" className="block hover:text-primary transition-colors">godasses.ma@gmail.com</a>
            <a href="tel:+212600000000" className="block hover:text-primary transition-colors">+212 6 00 00 00 00</a>
            <p>Casablanca, Maroc</p>
          </div>
        </div>
      </div>
      <div className="mt-12 pt-6 border-t border-border text-center text-xs text-muted-foreground">
        © 2026 GODASSES.MA — Tous droits réservés.
      </div>
    </div>
  </footer>
);

export default Footer;
