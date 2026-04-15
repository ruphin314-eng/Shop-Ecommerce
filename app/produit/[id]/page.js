'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getProduct, getProducts } from '@/lib/api';
import { isLoggedIn } from '@/lib/auth';
import useCart from '@/lib/useCart';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import toast from 'react-hot-toast';
import { ShoppingCart, ArrowLeft } from 'lucide-react';

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const addItem = useCart((state) => state.addItem);

  useEffect(() => {
    if (!isLoggedIn()) {
      window.location.href = 'http://localhost:8080/login';
      return;
    }
    loadProduct();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadProduct = async () => {
    try {
      const data = await getProduct(id);
      setProduct(data);
      loadSimilar(data);
    } catch {
      router.push('/catalogue');
    } finally {
      setLoading(false);
    }
  };

  const loadSimilar = async (prod) => {
    try {
      const all = await getProducts();
      const filtered = Array.isArray(all)
        ? all.filter(p =>
            p.id !== prod.id && (
              p.productType === prod.productType ||
              p.category?.id === prod.category?.id
            )
          ).slice(0, 4)
        : [];
      setSimilar(filtered);
    } catch {}
  };

  // ── Gestion quantité avec notifications intelligentes ──
  const handleIncrease = () => {
    const next = quantity + 1;

    if (product.quantity === 0) {
      toast.error('Ce produit est en rupture de stock.', { icon: '🚫' });
      return;
    }

    if (next > product.quantity) {
      // Notification selon le stock restant
      if (product.quantity === 1) {
        toast('Il ne reste plus qu\'1 exemplaire disponible !', {
          icon: '⚠️',
          style: { background: '#FEF3C7', color: '#92400E', fontWeight: '600' },
        });
      } else {
        toast(`Stock limité ! Il ne reste que ${product.quantity} exemplaire${product.quantity > 1 ? 's' : ''} disponible${product.quantity > 1 ? 's' : ''}.`, {
          icon: '📦',
          style: { background: '#FEF3C7', color: '#92400E', fontWeight: '600' },
          duration: 4000,
        });
      }
      setQuantity(product.quantity); // Bloque au max disponible
      return;
    }

    // Avertissement préventif quand on approche du stock max
    if (next === product.quantity && product.quantity <= 5) {
      toast(`Attention : vous atteignez la limite de stock disponible (${product.quantity}).`, {
        icon: '⚡',
        style: { background: '#EFF6FF', color: '#1E40AF', fontWeight: '500' },
        duration: 3000,
      });
    }

    setQuantity(next);
  };

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(q => q - 1);
  };

  const handleInputChange = (e) => {
    const val = parseInt(e.target.value);
    if (isNaN(val) || val < 1) { setQuantity(1); return; }

    if (val > product.quantity) {
      toast(`Il ne reste que ${product.quantity} exemplaire${product.quantity > 1 ? 's' : ''} en stock.`, {
        icon: '📦',
        style: { background: '#FEF3C7', color: '#92400E', fontWeight: '600' },
        duration: 4000,
      });
      setQuantity(product.quantity);
      return;
    }
    setQuantity(val);
  };

  const handleAddToCart = () => {
    if (product.quantity === 0) {
      toast.error('Ce produit est en rupture de stock.', { icon: '🚫' });
      return;
    }
    if (quantity > product.quantity) {
      toast.error(`Stock insuffisant. Maximum disponible : ${product.quantity}`);
      setQuantity(product.quantity);
      return;
    }
    addItem(product, quantity);
    toast.success(`${product.brand} ${product.model} ajouté au panier !`, {
      icon: '🛒',
      duration: 3000,
    });
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex justify-center items-center py-32">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"/>
      </div>
    </div>
  );

  if (!product) return null;

  const isOutOfStock = product.quantity === 0;
  const isLowStock = product.quantity > 0 && product.quantity <= 5;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Retour */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition mb-6"
        >
          <ArrowLeft size={18}/> Retour au catalogue
        </button>

        {/* Carte produit */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">

            {/* Image */}
            <div className="relative bg-gray-50 flex justify-center p-8 min-h-72">
              {product.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`http://localhost:8080${product.imageUrl}`}
                  alt={`${product.brand} ${product.model}`}
                  className="max-h-72 object-contain rounded-xl"
                />
              ) : (
                <div className="text-8xl">📱</div>
              )}

              {/* Badge rupture sur l'image */}
              {isOutOfStock && (
                <div className="absolute inset-0 bg-black/40 rounded-l-2xl flex items-center justify-center">
                  <span className="bg-red-500 text-white font-bold px-6 py-3 rounded-xl text-lg rotate-[-10deg]">
                    Rupture de stock
                  </span>
                </div>
              )}
            </div>

            {/* Infos */}
            <div className="p-8 flex flex-col justify-between">
              <div>
                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
                    {product.productType}
                  </span>
                  {product.category && (
                    <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">
                      {product.category.name}
                    </span>
                  )}
                  {/* Badge stock — sans chiffre visible */}
                  {isOutOfStock ? (
                    <span className="bg-red-100 text-red-600 text-xs font-semibold px-3 py-1 rounded-full">
                      Indisponible
                    </span>
                  ) : (
                    <span className="bg-green-100 text-green-600 text-xs font-semibold px-3 py-1 rounded-full">
                      ✓ Disponible
                    </span>
                  )}
                </div>

                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  {product.brand} {product.model}
                </h1>

                <p className="text-3xl font-bold text-blue-600 mb-4">
                  {product.price?.toLocaleString()} FCFA
                </p>

                <p className="text-gray-600 leading-relaxed mb-6">
                  {product.description}
                </p>

                {/* Détails */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {product.year && (
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-400">Année</p>
                      <p className="font-semibold text-gray-700">{product.year}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Zone quantité + bouton */}
              {isOutOfStock ? (
                <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
                  <p className="text-red-500 font-semibold text-sm mb-1">
                    🚫 Produit actuellement indisponible
                  </p>
                 <p className="text-red-400 text-xs">
  Contactez-nous sur WhatsApp pour être notifié du réapprovisionnement
</p>

<a
  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=Bonjour, je suis intéressé par ${product.brand} ${product.model} actuellement en rupture de stock.`}
  target="_blank"
  rel="noreferrer"
  className="inline-block mt-3 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-5 py-2 rounded-xl transition"
>
  Me notifier sur WhatsApp
</a>
                 
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Avertissement stock faible */}

                  <div className="flex items-center gap-3">
                    {/* Contrôle quantité */}
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                      <button
                        onClick={handleDecrease}
                        disabled={quantity <= 1}
                        className="px-4 py-3 text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition font-bold text-lg"
                      >−</button>

                      {/* Input éditable directement */}
                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={handleInputChange}
                        className="w-14 py-3 text-center font-semibold text-gray-800 border-none outline-none bg-white text-sm"
                      />

                      <button
                        onClick={handleIncrease}
                        className="px-4 py-3 text-gray-600 hover:bg-gray-50 transition font-bold text-lg"
                      >+</button>
                    </div>

                    {/* Bouton ajouter */}
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold py-3 rounded-xl transition"
                    >
                      <ShoppingCart size={18}/>
                      Ajouter au panier
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Produits similaires */}
        {similar.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Produits similaires</h2>
            <p className="text-gray-500 text-sm mb-6">
              D'autres produits qui pourraient vous intéresser
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {similar.map(p => (
                <ProductCard key={p.id} product={p}/>
              ))}
            </div>
          </div>
        )}

      </div>
      <Footer/>
    </div>
  );
}