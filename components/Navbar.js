'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getUser, removeToken } from '@/lib/auth';
import useCart from '@/lib/useCart';
import { ShoppingCart, User, LogOut, Package, X, AlertTriangle } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(() => {
    if (typeof window !== 'undefined') return getUser();
    return null;
  });
  const [mounted, setMounted] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const count = useCart((state) => state.getCount());

  useEffect(() => {
    setMounted(true);
  }, []);

const handleLogout = () => {
  setShowLogoutModal(false);
  router.push('/logout');
};
  return (
    <>
      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/catalogue" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="font-bold text-gray-800 text-lg">IUT DOUALA</span>
            </Link>

            {/* Liens centre */}
           <div className="hidden md:flex items-center gap-6">
  <Link href="/" className="text-gray-600 hover:text-blue-600 transition font-medium">
    Accueil
  </Link>
  <Link href="/catalogue" className="text-gray-600 hover:text-blue-600 transition font-medium">
    Catalogue
  </Link>
  <Link href="/about" className="text-gray-600 hover:text-blue-600 transition font-medium">
    À propos
  </Link>
  <Link href="/contact" className="text-gray-600 hover:text-blue-600 transition font-medium">
    Contact
  </Link>
  {mounted && user?.role === 'CLIENT' && (
    <Link href="/mes-commandes" className="text-gray-600 hover:text-blue-600 transition font-medium">
      Mes commandes
    </Link>
  )}
</div>

            {/* Actions droite */}
            <div className="flex items-center gap-3">

              {/* Panier */}
              <Link href="/panier" className="relative p-2 text-gray-600 hover:text-blue-600 transition">
                <ShoppingCart size={22} />
                {mounted && count > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {count}
                  </span>
                )}
              </Link>

              {/* Info utilisateur */}
              {mounted && user && (
                <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-1.5">
                  <User size={16} className="text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">{user.username}</span>
                  <span className="text-xs bg-blue-100 text-blue-600 rounded-full px-2 py-0.5 font-medium">
                    {user.role}
                  </span>
                </div>
              )}

              {/* Mes commandes mobile */}
              {mounted && user?.role === 'CLIENT' && (
                <Link href="/mes-commandes" className="p-2 text-gray-600 hover:text-blue-600 transition md:hidden">
                  <Package size={22} />
                </Link>
              )}

              {/* Bouton déconnexion */}
              <button
                onClick={() => setShowLogoutModal(true)}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
                title="Se déconnecter"
              >
                <LogOut size={18} />
                <span className="hidden md:block text-sm font-medium">Déconnexion</span>
              </button>

            </div>
          </div>
        </div>
      </nav>

      {/* Modal de confirmation déconnexion */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">

          {/* Fond sombre */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowLogoutModal(false)}
          />

          {/* Carte modale */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-in fade-in zoom-in duration-200">

            {/* Bouton fermer */}
            <button
              onClick={() => setShowLogoutModal(false)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              <X size={16} />
            </button>

            {/* Icone */}
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={28} className="text-red-500" />
            </div>

            {/* Texte */}
            <h3 className="text-lg font-bold text-gray-800 text-center mb-2">
              Déconnexion
            </h3>
            <p className="text-gray-500 text-sm text-center mb-6">
              Voulez-vous vraiment vous déconnecter ?<br/>
              Votre panier sera conservé pour votre prochaine visite.
            </p>

            {/* Boutons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium rounded-xl transition text-sm"
              >
                Annuler
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition text-sm flex items-center justify-center gap-2"
              >
                <LogOut size={16} />
                Se déconnecter
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}