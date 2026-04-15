'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isLoggedIn, getUser, saveUser, getToken } from '@/lib/auth';
import useCart from '@/lib/useCart';
import { createOrder } from '@/lib/api';
import Navbar from '@/components/Navbar';
import toast from 'react-hot-toast';
import { ShoppingBag } from 'lucide-react';

export default function CommandePage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCart();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    clientName: '',
    clientPhone: '',
    clientAddress: '',
    clientEmail: '',
  });

  useEffect(() => {
    setMounted(true);
    if (!isLoggedIn()) { router.push('/login'); return; }
    // Pré-remplir avec les infos du compte
    const user = getUser();
    if (user) setForm(f => ({ ...f, clientName: user.username }));
  }, []);

  if (!mounted) return null;

  const total = getTotal();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCommander = async (e) => {
    e.preventDefault();
    if (items.length === 0) { toast.error('Votre panier est vide'); return; }
    setLoading(true);

    try {
      const orderData = {
        ...form,
        totalPrice: total,
        items: items.map(item => ({
          productId: item.id,
          name: `${item.brand} ${item.model}`,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      const result = await createOrder(orderData);

      // Mettre à jour le rôle en CLIENT localement
      const user = getUser();
      if (result.newRole) {
        saveUser({ ...user, role: result.newRole });
      }

      toast.success('Commande passée avec succès !');

      // Construire le message WhatsApp
      const itemsText = items.map(i => `• ${i.brand} ${i.model} × ${i.quantity} = ${(i.price * i.quantity).toLocaleString()} FCFA`).join('%0A');
      const message = `🛍️ *Nouvelle commande*%0A%0A*Client :* ${form.clientName}%0A*Téléphone :* ${form.clientPhone}%0A*Adresse :* ${form.clientAddress}%0A%0A*Produits :*%0A${itemsText}%0A%0A*TOTAL : ${total.toLocaleString()} FCFA*`;
      const whatsappUrl = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${message}`;

      clearCart();

      // Ouvrir WhatsApp dans un nouvel onglet
      window.open(whatsappUrl, '_blank');

      router.push('/mes-commandes');

    } catch (err) {
      const msg = err.response?.data?.error || 'Erreur lors de la commande';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">

        <h1 className="text-3xl font-bold text-gray-800 mb-8">Finaliser la commande</h1>

        {items.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
            <ShoppingBag size={64} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-500 text-lg">Votre panier est vide</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Formulaire */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-6">Vos informations</h2>

              <form onSubmit={handleCommander} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                  <input
                    type="text" name="clientName" value={form.clientName}
                    onChange={handleChange} required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Votre nom complet"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <input
                    type="text" name="clientPhone" value={form.clientPhone}
                    onChange={handleChange} required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+237 6XX XX XX XX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresse de livraison</label>
                  <input
                    type="text" name="clientAddress" value={form.clientAddress}
                    onChange={handleChange} required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Votre adresse complète"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email (optionnel)</label>
                  <input
                    type="email" name="clientEmail" value={form.clientEmail}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="votre@email.com"
                  />
                </div>

                <button
                  type="submit" disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-4 rounded-xl transition text-base mt-2"
                >
                  {loading ? 'Traitement...' : '✅ Confirmer la commande'}
                </button>

                <p className="text-xs text-gray-400 text-center">
                  Après confirmation, vous serez redirigé vers WhatsApp pour finaliser avec l'admin
                </p>
              </form>
            </div>

            {/* Récapitulatif commande */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 h-fit">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Récapitulatif</h2>

              <div className="space-y-3 mb-4">
                {items.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      {item.imageUrl ? (
                        <img src={`http://localhost:8080${item.imageUrl}`} alt={item.brand} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <span>📱</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{item.brand} {item.model}</p>
                      <p className="text-xs text-gray-500">× {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-700 text-sm">
                      {(item.price * item.quantity).toLocaleString()} FCFA
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4">
                <div className="flex justify-between">
                  <span className="font-bold text-gray-800">Total à payer</span>
                  <span className="font-bold text-blue-600 text-xl">{total.toLocaleString()} FCFA</span>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}