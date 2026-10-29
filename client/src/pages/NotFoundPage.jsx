// ============================================================================
// CASA TÒPAZ — 404 Not Found Page
// ============================================================================

import { Link } from 'react-router-dom';
import { UtensilsCrossed } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 bg-[#0d0c0c] text-stone-200">
      <div className="w-20 h-20 rounded-full bg-amber-950/40 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6">
        <UtensilsCrossed className="w-10 h-10" />
      </div>

      <span className="font-mono text-xs text-amber-500 uppercase tracking-widest mb-2 block">
        Erreur 404 · Page Non Trouvée
      </span>

      <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white mb-4">
        Ce Plat N'est Pas à la Carte
      </h1>

      <p className="text-sm text-stone-400 max-w-md mb-8 leading-relaxed">
        L'adresse que vous avez demandée n'existe pas ou a été déplacée dans une autre section de notre établissement.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to="/"
          className="px-6 py-3 rounded-xl bg-stone-900 hover:bg-stone-850 border border-stone-800 text-stone-300 text-xs font-medium transition-colors"
        >
          Retour à l'Accueil
        </Link>
        <Link
          to="/menu"
          className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium transition-colors shadow-lg"
        >
          Explorer la Carte Complète
        </Link>
      </div>
    </div>
  );
}
