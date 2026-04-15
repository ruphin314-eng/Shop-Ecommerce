'use client';
import Link from 'next/link';
import useCart from '@/lib/useCart';
import toast from 'react-hot-toast';
import { ShoppingCart, Eye } from 'lucide-react';

export default function ProductCard({ product }) {
  const addItem = useCart((state) => state.addItem);

  const handleAddToCart = () => {
    if (product.quantity === 0) {
      toast.error('Produit en rupture de stock');
      return;
    }
    addItem(product);
    toast.success(`${product.brand} ${product.model} ajouté au panier !`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition duration-200 group">

      {/* Image */}
      <div className="relative h-48 bg-gray-50 overflow-hidden">
        {product.imageUrl ? (
          <img
            src={`http://localhost:8080${product.imageUrl}`}
            alt={`${product.brand} ${product.model}`}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl">📱</span>
          </div>
        )}

        {/* Badge stock */}
        {product.quantity === 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
            Rupture
          </div>
        )}
        {product.quantity > 0 && product.quantity <= 5 && (
          <div className="absolute top-2 left-2 bg-orange-400 text-white text-xs font-bold px-2 py-1 rounded-lg">
            Plus que {product.quantity}
          </div>
        )}

        {/* Badge type */}
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur text-gray-700 text-xs font-medium px-2 py-1 rounded-lg">
          {product.productType}
        </div>
      </div>

      {/* Infos */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 text-base">
          {product.brand} {product.model}
        </h3>
        <p className="text-gray-500 text-sm mt-1 line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between mt-3">
          <span className="text-blue-600 font-bold text-lg">
            {product.price?.toLocaleString()} FCFA
          </span>
          <span className="text-gray-400 text-xs">
            Stock : {product.quantity}
          </span>
        </div>

        {/* Boutons */}
        <div className="flex gap-2 mt-4">
          <Link
            href={`/produit/${product.id}`}
            className="flex-1 flex items-center justify-center gap-1 border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600 py-2 rounded-xl text-sm font-medium transition"
          >
            <Eye size={15} />
            Détails
          </Link>
          <button
            onClick={handleAddToCart}
            disabled={product.quantity === 0}
            className="flex-1 flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white py-2 rounded-xl text-sm font-medium transition"
          >
            <ShoppingCart size={15} />
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
}