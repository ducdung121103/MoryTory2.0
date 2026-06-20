import React, { createContext, useContext, useReducer, useEffect } from 'react';
import localforage from 'localforage';

const CartContext = createContext(null);
const CartDispatchContext = createContext(null);

const CART_KEY = 'morytory_cart';

const initialState = {
  items: [],
  isOpen: false,
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.payload] };
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((item) => item.id !== action.payload) };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };
    case 'SET_CART_OPEN':
      return { ...state, isOpen: action.payload };
    case 'LOAD_CART':
      return { ...state, items: action.payload || [] };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Restore cart from localforage on mount
  useEffect(() => {
    (async () => {
      try {
        const saved = await localforage.getItem(CART_KEY);
        if (saved && Array.isArray(saved)) {
          const hydrated = saved.map(item => {
            if (item.photo instanceof Blob) {
              return {
                ...item,
                photoPreviewUrl: URL.createObjectURL(item.photo)
              };
            }
            return item;
          });
          dispatch({ type: 'LOAD_CART', payload: hydrated });
        }
      } catch (e) {
        console.error('Cart restore error:', e);
      }
    })();
  }, []);

  // Persist cart to localforage when items change
  useEffect(() => {
    (async () => {
      try {
        if (state.items.length > 0) {
          await localforage.setItem(CART_KEY, state.items);
        } else {
          // If CLEAR_CART was called, remove key entirely
          await localforage.removeItem(CART_KEY);
        }
      } catch (e) {
        console.error('Cart save error:', e);
      }
    })();
  }, [state.items]);

  return (
    <CartContext.Provider value={state}>
      <CartDispatchContext.Provider value={dispatch}>
        {children}
      </CartDispatchContext.Provider>
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === null) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export function useCartDispatch() {
  const context = useContext(CartDispatchContext);
  if (context === null) {
    throw new Error('useCartDispatch must be used within a CartProvider');
  }
  return context;
}