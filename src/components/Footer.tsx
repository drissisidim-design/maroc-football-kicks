import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border py-16">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <Link to="/" className="font-display text-2xl font-bold tracking-wider">
            <span className="neon-text">KICK</span>STORE
          </Link>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Votre destination premium pour les chaussures de football au Maroc. Livraison rapide partout au Maroc 🇲🇦
          </p>
        </div>
        <div>
          <h4 className="font-display uppercase tracking-wider text-sm mb-4">Navigation</h4>
          <div className="space-y-2">
            <Link to="/" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Accueil</Link>
            <Link to="/boutique" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Boutique</Link>
          </div>
        </div>
        <div>
          <h4 className="font-display uppercase tracking-wider text-sm mb-4">Aide</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Guide des tailles</p>
            <p>Livraison & Retours</p>
            <p>FAQ</p>
          </div>
        </div>
        <div>
          <h4 className="font-display uppercase tracking-wider text-sm mb-4">Contact</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>contact@kickstore.ma</p>
            <p>+212 6 00 00 00 00</p>
            <p>Casablanca, Maroc</p>
          </div>
        </div>
      </div>
      <div className="mt-12 pt-6 border-t border-border text-center text-xs text-muted-foreground">
        © 2026 KICKSTORE. Tous droits réservés.
      </div>
    </div>
  </footer>
);

export default Footer;
