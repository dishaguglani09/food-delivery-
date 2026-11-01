// ============================================================================
// The Indian Rasoi — Reusable Empty State Component
// Used across empty orders, empty filters, empty cart, etc.
// ============================================================================

import { Link } from 'react-router-dom';
import { UtensilsCrossed } from 'lucide-react';

export default function EmptyState({
  icon: Icon = UtensilsCrossed,
  title = 'Aucun élément trouvé',
  description = 'Nous n’avons trouvé aucun élément correspondant à vos critères.',
  actionLabel = 'Explorer la Carte',
  actionLink = '/menu',
  onActionClick
}) {
  return (
    <div className="py-16 sm:py-24 px-4 text-center max-w-md mx-auto space-y-5">
      <div className="w-16 h-16 rounded-3xl bg-amber-950/30 border border-amber-500/20 mx-auto flex items-center justify-center text-amber-400 shadow-xl">
        <Icon className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h3 className="font-serif text-2xl font-bold text-white tracking-wide">
          {title}
        </h3>
        <p className="text-sm text-stone-400 leading-relaxed">
          {description}
        </p>
      </div>

      {actionLabel && (
        <div>
          {onActionClick ? (
            <button
              onClick={onActionClick}
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-medium text-sm transition-all shadow-lg shadow-amber-950/40 cursor-pointer"
            >
              {actionLabel}
            </button>
          ) : (
            <Link
              to={actionLink}
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-medium text-sm transition-all shadow-lg shadow-amber-950/40"
            >
              {actionLabel}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
