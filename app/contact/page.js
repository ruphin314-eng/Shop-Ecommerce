'use client';
import { useEffect, useState } from 'react';
import { isLoggedIn } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { MapPin, Phone, Mail, MessageCircle, Clock, Send } from 'lucide-react';

export default function ContactPage() {
  useEffect(() => {
    if (!isLoggedIn()) window.location.href = 'http://localhost:8080/login';
  }, []);

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleWhatsApp = (e) => {
    e.preventDefault();
    const msg = `Bonjour IUT DOUALA !%0ANom: ${form.name}%0AEmail: ${form.email}%0ASujet: ${form.subject}%0AMessage: ${form.message}`;
    window.open(`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${msg}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar/>

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-blue-950 text-white py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contactez-nous</h1>
          <p className="text-slate-300 text-lg">
            Une question ? Un problème ? Notre équipe est là pour vous aider.
          </p>
        </div>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-16">

          {/* Infos de contact */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-8">Nos coordonnées</h2>
            <div className="space-y-6">
              {[
                {
                  icon: <MessageCircle size={22} className="text-green-500"/>,
                  title: 'WhatsApp (Recommandé)',
                  content: '+237 651 21 75 00',
                  sub: 'Réponse en moins de 30 minutes',
                  action: () => window.open(`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`, '_blank'),
                  color: 'green',
                },
                {
                  icon: <Phone size={22} className="text-blue-500"/>,
                  title: 'Téléphone',
                  content: '+237 651 21 75 00',
                  sub: 'Lun - Sam, 8h à 20h',
                },
                {
                  icon: <Mail size={22} className="text-purple-500"/>,
                  title: 'Email',
                  content: 'contact@IUT DOUALA.cm',
                  sub: 'Réponse sous 24 heures',
                },
                {
                  icon: <MapPin size={22} className="text-red-500"/>,
                  title: 'Adresse',
                  content: 'Douala, Cameroun',
                  sub: 'Akwa, près du marché central',
                },
                {
                  icon: <Clock size={22} className="text-orange-500"/>,
                  title: 'Horaires',
                  content: 'Lundi - Samedi',
                  sub: '8h00 - 20h00',
                },
              ].map((item, i) => (
                <div key={i}
                  onClick={item.action}
                  className={`flex items-start gap-4 p-4 rounded-2xl border border-gray-100 ${item.action ? 'cursor-pointer hover:border-green-200 hover:bg-green-50 transition' : ''}`}>
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{item.title}</p>
                    <p className="text-gray-700 font-medium">{item.content}</p>
                    <p className="text-gray-400 text-xs">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Formulaire */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-8">Envoyer un message</h2>
            <form onSubmit={handleWhatsApp} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                  <input
                    type="text" required
                    value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email" required
                    value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sujet</label>
                <input
                  type="text" required
                  value={form.subject} onChange={e => setForm({...form, subject: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="De quoi s'agit-il ?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  required rows={6}
                  value={form.message} onChange={e => setForm({...form, message: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                  placeholder="Décrivez votre demande..."
                />
              </div>

              <button type="submit"
                className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-4 rounded-xl transition">
                <Send size={18}/>
                Envoyer via WhatsApp
              </button>

              <p className="text-xs text-gray-400 text-center">
                Votre message sera envoyé directement sur notre WhatsApp
              </p>
            </form>
          </div>
        </div>
      </section>

      <Footer/>
    </div>
  );
}