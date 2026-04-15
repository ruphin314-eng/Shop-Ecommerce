import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCart = create(
  persist(
    (set, get) => ({
      items: [],

      // Ajouter un produit au panier
      addItem: (product, quantity = 1) => {
        const items = get().items;
        const existing = items.find(i => i.id === product.id);
        if (existing) {
          set({
            items: items.map(i =>
              i.id === product.id
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
          });
        } else {
          set({ items: [...items, { ...product, quantity }] });
        }
      },

      // Supprimer un produit
      removeItem: (productId) => {
        set({ items: get().items.filter(i => i.id !== productId) });
      },

      // Modifier la quantité
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map(i =>
            i.id === productId ? { ...i, quantity } : i
          ),
        });
      },

      // Vider le panier
      clearCart: () => set({ items: [] }),

      // Total du panier
      getTotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity, 0
        );
      },

      // Nombre d'articles
      getCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    { name: 'cart-storage' } // persisté dans localStorage
  )
);

export default useCart;