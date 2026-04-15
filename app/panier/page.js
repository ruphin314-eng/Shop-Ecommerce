'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isLoggedIn } from '@/lib/auth';
import useCart from '@/lib/useCart';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';

export default function PanierPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isLoggedIn()) router.push('/login');
  }, []);

  if (!mounted) return null;

  const total = getTotal();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Mon panier</h1>
            <p className="text-gray-500 mt-1">{items.length} article{items.length > 1 ? 's' : ''}</p>
          </div>
          <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition">
            <ArrowLeft size={18} /> Continuer les achats
          </button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
            <ShoppingBag size={64} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-500 text-lg font-medium">Votre panier est vide</p>
            <p className="text-gray-400 text-sm mt-1 mb-6">Ajoutez des produits depuis le catalogue</p>
            <Link href="/catalogue" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition">
              Voir le catalogue
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Liste articles */}
            <div className="lg:col-span-2 space-y-3">
              {items.map(item => (
                <div key={item.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4">

                  {/* Image */}
                  <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    {item.imageUrl ? (
                      <img src={`http://localhost:8080${item.imageUrl}`} alt={item.brand} className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <span className="text-2xl">📱</span>
                    )}
                  </div>

                  {/* Infos */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{item.brand} {item.model}</p>
                    <p className="text-blue-600 font-bold">{item.price?.toLocaleString()} FCFA</p>
                  </div>

                  {/* Quantité */}
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-50 transition font-bold">−</button>
                    <span className="px-3 py-2 font-semibold text-gray-800 min-w-8 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-50 transition font-bold">+</button>
                  </div>

                  {/* Sous-total */}
                  <p className="font-bold text-gray-700 min-w-24 text-right">
                    {(item.price * item.quantity).toLocaleString()} FCFA
                  </p>

                  {/* Supprimer */}
                  <button onClick={() => removeItem(item.id)} className="p-2 text-gray-400 hover:text-red-500 transition">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}

              {/* Vider panier */}
              <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700 transition flex items-center gap-1 mt-2">
                <Trash2 size={14} /> Vider le panier
              </button>
            </div>

            {/* Récapitulatif */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 h-fit sticky top-24">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Récapitulatif</h2>

              <div className="space-y-2 mb-4">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm text-gray-600">
                    <span className="truncate mr-2">{item.brand} × {item.quantity}</span>
                    <span className="font-medium">{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="font-bold text-gray-800">Total</span>
                  <span className="font-bold text-blue-600 text-lg">{total.toLocaleString()} FCFA</span>
                </div>
              </div>

              <Link
                href="/commande"
                className="w-full block text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition"
              >
                Commander maintenant
              </Link>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}