'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getProducts, getCategories } from '@/lib/api';
import { isLoggedIn } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';

export default function CataloguePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Filtres
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedType, setSelectedType] = useState('');
  const [sortBy, setSortBy] = useState('');

 useEffect(() => {
    if (!isLoggedIn()) {
      window.location.href = 'http://localhost:8080/login';
      return;
    }
    // Lit le paramètre category dans l'URL si venant du dashboard
    const catParam = searchParams.get('category');
    if (catParam) setSelectedCategory(catParam);
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    try {
      const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
      setProducts(Array.isArray(prods) ? prods : []);
      setCategories(Array.isArray(cats) ? cats : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = products
    .filter(p => {
      const matchSearch = search === '' ||
        `${p.brand} ${p.model}`.toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCategory === '' ||
        p.category?.id?.toString() === selectedCategory;
      const matchType = selectedType === '' || p.productType === selectedType;
      return matchSearch && matchCat && matchType;
    })
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'name') return `${a.brand}`.localeCompare(`${b.brand}`);
      return 0;
    });

  const types = [...new Set(products.map(p => p.productType).filter(Boolean))];
  const hasActiveFilters = search || selectedCategory || selectedType || sortBy;

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSelectedType('');
    setSortBy('');
  };

  useEffect(() => {
    const catParam = searchParams.get('category');
    if (catParam) setSelectedCategory(catParam);

    if (!isLoggedIn()) {
      // L'admin vient peut-être du dashboard sans JWT
      // On redirige vers une page de connexion rapide
      window.location.href = 'http://localhost:8080/login';
      return;
    }
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* ── Banner ── */}
      <div className="bg-linear-to-r from-slate-900 to-blue-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Notre catalogue</h1>
          <p className="text-slate-300">
            Découvrez notre sélection de smartphones, laptops et tablets
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* ── Barre de filtres ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">

          {/* Ligne principale */}
          <div className="flex flex-wrap gap-3 items-center">

            {/* Recherche */}
            <div className="relative flex-1 min-w-56">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              />
              {search && (
                <button onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X size={14}/>
                </button>
              )}
            </div>

            {/* Catégorie */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="appearance-none pl-4 pr-9 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 cursor-pointer"
              >
                <option value="">Toutes les catégories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id.toString()}>{cat.name}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
            </div>

            {/* Type */}
            <div className="relative">
              <select
                value={selectedType}
                onChange={e => setSelectedType(e.target.value)}
                className="appearance-none pl-4 pr-9 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 cursor-pointer"
              >
                <option value="">Tous les types</option>
                {types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
            </div>

            {/* Tri */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="appearance-none pl-4 pr-9 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 cursor-pointer"
              >
                <option value="">Trier par</option>
                <option value="price_asc">Prix croissant</option>
                <option value="price_desc">Prix décroissant</option>
                <option value="name">Nom A-Z</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
            </div>

            {/* Effacer filtres */}
            {hasActiveFilters && (
              <button onClick={clearFilters}
                className="flex items-center gap-1.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 border border-red-200 rounded-xl transition">
                <X size={14}/> Effacer
              </button>
            )}
          </div>

          {/* Badges filtres actifs */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
              {search && (
                <span className="flex items-center gap-1 bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1 rounded-full">
                  Recherche: {search}
                  <button onClick={() => setSearch('')}><X size={12}/></button>
                </span>
              )}
              {selectedCategory && (
                <span className="flex items-center gap-1 bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1 rounded-full">
                  {categories.find(c => c.id.toString() === selectedCategory)?.name}
                  <button onClick={() => setSelectedCategory('')}><X size={12}/></button>
                </span>
              )}
              {selectedType && (
                <span className="flex items-center gap-1 bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1 rounded-full">
                  {selectedType}
                  <button onClick={() => setSelectedType('')}><X size={12}/></button>
                </span>
              )}
              {sortBy && (
                <span className="flex items-center gap-1 bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1 rounded-full">
                  {sortBy === 'price_asc' ? 'Prix ↑' : sortBy === 'price_desc' ? 'Prix ↓' : 'Nom A-Z'}
                  <button onClick={() => setSortBy('')}><X size={12}/></button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* ── Résultats header ── */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600 text-sm">
            {loading ? 'Chargement...' : (
              <span>
                <span className="font-bold text-gray-800">{filtered.length}</span>
                {' '}produit{filtered.length > 1 ? 's' : ''} trouvé{filtered.length > 1 ? 's' : ''}
                {hasActiveFilters && (
                  <span className="text-gray-400"> sur {products.length} au total</span>
                )}
              </span>
            )}
          </p>

          {/* Grille catégories rapides */}
          {!loading && categories.length > 0 && !selectedCategory && (
            <div className="hidden md:flex gap-2">
              {categories.slice(0, 4).map(cat => (
                <button key={cat.id}
                  onClick={() => setSelectedCategory(cat.id.toString())}
                  className="text-xs px-3 py-1.5 bg-white border border-gray-200 hover:border-blue-300 hover:text-blue-600 rounded-full transition font-medium text-gray-600">
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Grille produits ── */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
                <div className="h-48 bg-gray-100"/>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-100 rounded-full w-3/4"/>
                  <div className="h-3 bg-gray-100 rounded-full w-1/2"/>
                  <div className="h-8 bg-gray-100 rounded-xl"/>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
            <div className="text-7xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">Aucun produit trouvé</h3>
            <p className="text-gray-400 text-sm mb-6">
              {products.length === 0
                ? 'Aucun produit dans le backend pour le moment'
                : 'Essayez de modifier vos critères de recherche'}
            </p>
            {hasActiveFilters && (
              <button onClick={clearFilters}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition">
                Réinitialiser les filtres
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map(product => (
                <ProductCard key={product.id} product={product}/>
              ))}
            </div>

            {/* Message fin de liste */}
            {filtered.length >= 8 && (
              <div className="text-center mt-10 text-gray-400 text-sm">
                Vous avez vu tous les {filtered.length} produits
              </div>
            )}
          </>
        )}

      </div>

      <Footer/>
    </div>
  );
}