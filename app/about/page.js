'use client';
import { useEffect } from 'react';
import { isLoggedIn } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Shield, Truck, Users, Award, Target, Heart } from 'lucide-react';

export default function AboutPage() {
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn()) window.location.href = 'http://localhost:8080/login';
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar/>

      {/* Hero About */}
      <section className="bg-gradient-to-br from-slate-900 to-blue-950 text-white py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">À propos de IUT DOUALA</h1>
          <p className="text-slate-300 text-lg leading-relaxed">
            Votre partenaire tech de confiance au Cameroun depuis 2020. Nous vous proposons les meilleurs produits technologiques aux prix les plus compétitifs.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Notre mission</span>
            <h2 className="text-3xl font-bold text-gray-800 mt-2 mb-6">
              Rendre la technologie accessible à tous
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              IUT DOUALA est né d'une conviction simple : chaque Camerounais mérite d'avoir accès aux meilleurs produits technologiques sans se ruiner.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Nous travaillons directement avec des fournisseurs certifiés pour vous garantir des produits authentiques, avec des prix justes et un service après-vente réactif.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Notre équipe est disponible 7j/7 via WhatsApp pour répondre à toutes vos questions et vous accompagner dans votre achat.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: <Target size={24}/>, title: 'Notre vision', desc: 'Devenir la référence e-commerce tech en Afrique centrale' },
              { icon: <Heart size={24}/>, title: 'Nos valeurs', desc: 'Honnêteté, qualité et satisfaction client avant tout' },
              { icon: <Users size={24}/>, title: 'Notre équipe', desc: 'Des passionnés de tech à votre service' },
              { icon: <Award size={24}/>, title: 'Notre engagement', desc: 'Produits garantis et service premium' },
            ].map((item, i) => (
              <div key={i} className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white mb-3">
                  {item.icon}
                </div>
                <h3 className="font-bold text-gray-800 mb-1 text-sm">{item.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chiffres clés */}
      <section className="bg-blue-600 py-20 text-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">IUT DOUALA en chiffres</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '4+', label: 'Années d\'expérience' },
              { number: '2000+', label: 'Clients satisfaits' },
              { number: '500+', label: 'Produits disponibles' },
              { number: '10+', label: 'Villes desservies' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-5xl font-bold mb-2">{stat.number}</p>
                <p className="text-blue-100 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Pourquoi nous choisir ?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: <Shield size={32}/>, title: 'Produits authentiques', desc: 'Tous nos produits proviennent de fournisseurs officiels et sont accompagnés de leur garantie constructeur.' },
            { icon: <Truck size={32}/>, title: 'Livraison rapide', desc: 'Nous livrons partout au Cameroun en 24 à 72 heures selon votre localisation.' },
            { icon: <Users size={32}/>, title: 'Support dédié', desc: 'Notre équipe est disponible sur WhatsApp pour vous aider avant, pendant et après votre achat.' },
          ].map((item, i) => (
            <div key={i} className="text-center p-8 rounded-2xl border border-gray-100 hover:shadow-md transition">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{item.title}</h3>
              <p className="text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer/>
    </div>
  );
}