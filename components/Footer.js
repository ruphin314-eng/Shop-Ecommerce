import Link from 'next/link';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

          {/* Logo + description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">T</span>
              </div>
              <span className="text-xl font-bold">IUT DOUALA</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Votre boutique tech de confiance au Cameroun. Smartphones, laptops et tablettes aux meilleurs prix avec livraison rapide.
            </p>
           {/* Réseaux sociaux */}
<div className="flex gap-3">
  {[
    { label: 'Facebook', href: '#', svg: (
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    )},
    { label: 'Instagram', href: '#', svg: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
      </svg>
    )},
    { label: 'WhatsApp', href: `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`, svg: (
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
      </svg>
    )},
  ].map((social, i) => (
    <a key={i} href={social.href} target="_blank" rel="noreferrer"
      aria-label={social.label}
      className="w-9 h-9 bg-white/10 hover:bg-blue-600 rounded-xl flex items-center justify-center transition text-white">
      {social.svg}
    </a>
  ))}
</div>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="font-bold text-white mb-4">Navigation</h3>
            <ul className="space-y-2">
              {[
                { label: 'Accueil', href: '/' },
                { label: 'Catalogue', href: '/catalogue' },
                { label: 'À propos', href: '/about' },
                { label: 'Contact', href: '/contact' },
                { label: 'Mon panier', href: '/panier' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="text-slate-400 hover:text-blue-400 text-sm transition">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-white mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-slate-400 text-sm">
                <MapPin size={16} className="text-blue-400 mt-0.5 flex-shrink-0"/>
                <span>Douala, Cameroun</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <Phone size={16} className="text-blue-400 flex-shrink-0"/>
                <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
                  className="hover:text-blue-400 transition">
                  +237 651 21 75 00
                </a>
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <Mail size={16} className="text-blue-400 flex-shrink-0"/>
                <a href="mailto:contact@IUT DOUALA.cm"
                  className="hover:text-blue-400 transition">
                  contact@IUT DOUALA.cm
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bas du footer */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} IUT DOUALA. Tous droits réservés.
          </p>
          <p className="text-slate-600 text-xs">
            Fait avec ❤️ au Cameroun
          </p>
        </div>
      </div>
    </footer>
  );
}