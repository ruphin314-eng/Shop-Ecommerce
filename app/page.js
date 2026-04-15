'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { isLoggedIn } from '@/lib/auth';
import { getProducts, getCategories } from '@/lib/api';
import { ShoppingBag, Shield, Truck, Headphones, Star, ArrowRight, ChevronRight } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (!isLoggedIn()) {
      window.location.href = 'http://localhost:8080/login';
      return;
    }
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
      setProducts(Array.isArray(prods) ? prods.slice(0, 8) : []);
      setCategories(Array.isArray(cats) ? cats : []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white overflow-hidden">
        {/* Cercles décoratifs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2"/>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/10 rounded-full translate-y-1/2 -translate-x-1/2"/>

        <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-36 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              📦 Smartphones · Laptops · Tablets
            </span>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              La tech de demain,{' '}
              <span className="text-blue-400">disponible aujourd'hui</span>
            </h1>
            <p className="text-slate-300 text-lg mb-8 leading-relaxed">
              Découvrez notre sélection de smartphones, laptops et tablettes aux meilleurs prix. Livraison rapide partout au Cameroun.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/catalogue"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-4 rounded-2xl transition">
                Explorer le catalogue <ArrowRight size={18}/>
              </Link>
              <Link href="/about"
                className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 text-white px-8 py-4 rounded-2xl transition">
                En savoir plus
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { number: '500+', label: 'Produits disponibles' },
              { number: '2K+', label: 'Clients satisfaits' },
              { number: '24h', label: 'Livraison express' },
              { number: '100%', label: 'Produits garantis' },
            ].map((stat, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center backdrop-blur">
                <p className="text-3xl font-bold text-blue-400 mb-1">{stat.number}</p>
                <p className="text-slate-400 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AVANTAGES ── */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <Truck size={28}/>, title: 'Livraison rapide', desc: 'Partout au Cameroun' },
              { icon: <Shield size={28}/>, title: 'Produits garantis', desc: 'Qualité certifiée' },
              { icon: <Headphones size={28}/>, title: 'Support 24/7', desc: 'Via WhatsApp' },
              { icon: <ShoppingBag size={28}/>, title: 'Paiement facile', desc: 'Mobile Money & Cash' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600">
                  {item.icon}
                </div>
                <h3 className="font-bold text-gray-800 mb-1">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      {categories.length > 0 && (
        <section className="py-20 max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Nos catégories</h2>
              <p className="text-gray-500 mt-1">Trouvez ce que vous cherchez</p>
            </div>
            <Link href="/catalogue" className="flex items-center gap-1 text-blue-600 hover:underline font-medium text-sm">
              Voir tout <ChevronRight size={16}/>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat, i) => {
              const emojis = ['💻', '📱', '📟', '🖥️', '⌨️', '🖱️', '📷', '🎧'];
              return (
                <Link key={cat.id} href={`/catalogue?category=${cat.id}`}
                  className="group bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 text-center hover:shadow-md hover:border-blue-300 transition">
                  <div className="text-4xl mb-3">{emojis[i % emojis.length]}</div>
                  <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition">{cat.name}</h3>
                  {cat.description && (
                    <p className="text-gray-500 text-xs mt-1 line-clamp-2">{cat.description}</p>
                  )}
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ── PRODUITS VEDETTES ── */}
      {products.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">Produits populaires</h2>
                <p className="text-gray-500 mt-1">Les plus demandés du moment</p>
              </div>
              <Link href="/catalogue" className="flex items-center gap-1 text-blue-600 hover:underline font-medium text-sm">
                Voir tout <ChevronRight size={16}/>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product}/>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── BANNIERE CTA ── */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Prêt à passer votre commande ?
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Contactez-nous sur WhatsApp pour toute question ou commande personnalisée.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/catalogue"
              className="bg-white text-blue-600 font-bold px-8 py-4 rounded-2xl hover:bg-blue-50 transition">
              Voir le catalogue
            </Link>
            <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`} target="_blank"
              className="border-2 border-white text-white font-bold px-8 py-4 rounded-2xl hover:bg-white/10 transition">
              WhatsApp Admin
            </a>
          </div>
        </div>
      </section>

      {/* ── TEMOIGNAGES ── */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">Ce que disent nos clients</h2>
          <p className="text-gray-500 mt-2">Des milliers de clients satisfaits</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: 'Jean-Paul M.', city: 'Douala', text: 'Livraison rapide et produit conforme à la description. Je recommande vivement !', stars: 5 },
            { name: 'Marie K.', city: 'Yaoundé', text: 'Super expérience d\'achat. Le support WhatsApp est très réactif.', stars: 5 },
            { name: 'Patrick N.', city: 'Bafoussam', text: 'Prix imbattables et qualité au rendez-vous. Mon laptop tourne parfaitement.', stars: 5 },
          ].map((t, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex gap-1 mb-3">
                {[...Array(t.stars)].map((_, j) => (
                  <Star key={j} size={16} className="text-yellow-400 fill-yellow-400"/>
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">{t.name[0]}</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{t.name}</p>
                  <p className="text-gray-400 text-xs">{t.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer/>
    </div>
  );
}

// Import en bas pour éviter les imports circulaires
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';