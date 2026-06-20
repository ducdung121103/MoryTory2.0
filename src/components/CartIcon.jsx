import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart, useCartDispatch } from '../store/CartContext';

export default function CartIcon() {
  const { items } = useCart();
  const dispatch = useCartDispatch();

  if (items.length === 0) return null;

  return (
    <button
      onClick={() => dispatch({ type: 'TOGGLE_CART' })}
      className="fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-card text-walnut p-3.5 rounded-full shadow-[var(--shadow-warm)] hover:shadow-lg transition-all z-50 flex items-center justify-center group border border-line relative shrink-0 active:scale-95"
    >
      <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
      <span className="absolute -top-2 -right-2 bg-sun text-ink text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full shadow-sm animate-breathe">
        {items.length}
      </span>
    </button>
  );
}