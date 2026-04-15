'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isLoggedIn } from '@/lib/auth';
import { getMyOrders } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Package, Clock, ChevronRight, ShoppingBag, X, Download, Phone, MapPin, Mail, CheckCircle, Truck, XCircle, AlertCircle } from 'lucide-react';

const statusConfig = {
  EN_ATTENTE:  { label: 'En attente',  color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: <AlertCircle size={14}/>, dot: 'bg-yellow-400' },
  CONFIRMEE:   { label: 'Confirmée',   color: 'bg-blue-100 text-blue-700 border-blue-200',       icon: <CheckCircle size={14}/>, dot: 'bg-blue-400' },
  LIVREE:      { label: 'Livrée',      color: 'bg-green-100 text-green-700 border-green-200',    icon: <Truck size={14}/>,       dot: 'bg-green-400' },
  ANNULEE:     { label: 'Annulée',     color: 'bg-red-100 text-red-700 border-red-200',          icon: <XCircle size={14}/>,     dot: 'bg-red-400' },
};

export default function MesCommandesPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null); // commande sélectionnée pour le modal

  useEffect(() => {
    if (!isLoggedIn()) { window.location.href = 'http://localhost:8080/login'; return; }
    getMyOrders()
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const parseItems = (itemsStr) => {
    try { return JSON.parse(itemsStr || '[]'); } catch { return []; }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
  };

  const formatDateTime = (dateStr) => {
    return new Date(dateStr).toLocaleString('fr-FR', {
      day: '2-digit', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  // ── Génération PDF ──
  const downloadPDF = (order) => {
    const items = parseItems(order.items);
    const status = statusConfig[order.status] || statusConfig.EN_ATTENTE;

    const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <title>Facture #${order.id}</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family: Arial, sans-serif; color: #1a1a1a; background: #fff; padding: 40px; }
    .header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:40px; padding-bottom:24px; border-bottom:2px solid #2563eb; }
    .logo { font-size:24px; font-weight:800; color:#2563eb; }
    .logo span { display:block; font-size:12px; font-weight:400; color:#666; margin-top:4px; }
    .facture-info { text-align:right; }
    .facture-info h2 { font-size:20px; font-weight:700; color:#1a1a1a; }
    .facture-info p { font-size:12px; color:#666; margin-top:4px; }
    .badge { display:inline-block; padding:4px 12px; border-radius:20px; font-size:11px; font-weight:600; margin-top:8px;
      background:${order.status === 'LIVREE' ? '#dcfce7' : order.status === 'CONFIRMEE' ? '#dbeafe' : order.status === 'ANNULEE' ? '#fee2e2' : '#fef9c3'};
      color:${order.status === 'LIVREE' ? '#15803d' : order.status === 'CONFIRMEE' ? '#1d4ed8' : order.status === 'ANNULEE' ? '#dc2626' : '#854d0e'}; }
    .section { margin-bottom:28px; }
    .section-title { font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:#2563eb; margin-bottom:12px; }
    .info-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
    .info-box { background:#f8fafc; border-radius:8px; padding:14px; }
    .info-box label { font-size:11px; color:#888; display:block; margin-bottom:4px; }
    .info-box p { font-size:13px; font-weight:600; color:#1a1a1a; }
    table { width:100%; border-collapse:collapse; }
    thead tr { background:#2563eb; color:#fff; }
    thead th { padding:10px 12px; text-align:left; font-size:12px; font-weight:600; }
    tbody tr { border-bottom:1px solid #f0f0f0; }
    tbody tr:last-child { border-bottom:none; }
    tbody td { padding:10px 12px; font-size:13px; color:#1a1a1a; }
    tbody tr:nth-child(even) { background:#f8fafc; }
    .total-row { background:#eff6ff !important; font-weight:700; }
    .total-row td { padding:14px 12px; font-size:15px; color:#2563eb; }
    .footer { margin-top:40px; padding-top:20px; border-top:1px solid #e5e7eb; text-align:center; font-size:11px; color:#aaa; }
    .footer strong { color:#2563eb; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">📦 IUT DOUALA<span>Douala, Cameroun · +237 651 21 75 00</span></div>
    <div class="facture-info">
      <h2>FACTURE</h2>
      <p>N° <strong>#${String(order.id).padStart(5, '0')}</strong></p>
      <p>${formatDateTime(order.createdAt)}</p>
      <div class="badge">${status.label}</div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Informations client</div>
    <div class="info-grid">
      <div class="info-box"><label>Nom complet</label><p>${order.clientName || '-'}</p></div>
      <div class="info-box"><label>Téléphone</label><p>${order.clientPhone || '-'}</p></div>
      <div class="info-box"><label>Adresse</label><p>${order.clientAddress || '-'}</p></div>
      <div class="info-box"><label>Email</label><p>${order.clientEmail || '-'}</p></div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Détail de la commande</div>
    <table>
      <thead>
        <tr>
          <th>Produit</th>
          <th>Prix unitaire</th>
          <th>Quantité</th>
          <th>Sous-total</th>
        </tr>
      </thead>
      <tbody>
        ${items.map(item => `
          <tr>
            <td>${item.name || '-'}</td>
            <td>${Number(item.price || 0).toLocaleString('fr-FR')} FCFA</td>
            <td>${item.quantity}</td>
            <td>${(Number(item.price || 0) * item.quantity).toLocaleString('fr-FR')} FCFA</td>
          </tr>
        `).join('')}
        <tr class="total-row">
          <td colspan="3">TOTAL À PAYER</td>
          <td>${Number(order.totalPrice || 0).toLocaleString('fr-FR')} FCFA</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="footer">
    Merci pour votre confiance ! · <strong>IUT DOUALA</strong> · contact@IUT DOUALA.cm · +237 651 21 75 00
  </div>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank');
    setTimeout(() => win?.print(), 800);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar/>

      {/* Banner */}
      <div className="bg-linear-to-r from-slate-900 to-blue-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-1">Mes commandes</h1>
          <p className="text-slate-300">Suivez et gérez toutes vos commandes</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
                <div className="h-3 bg-gray-100 rounded w-1/2 mb-3"/>
                <div className="h-4 bg-gray-100 rounded w-3/4 mb-2"/>
                <div className="h-3 bg-gray-100 rounded w-full mb-4"/>
                <div className="h-8 bg-gray-100 rounded-xl"/>
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
            <ShoppingBag size={64} className="mx-auto text-gray-200 mb-4"/>
            <p className="text-gray-500 text-lg font-medium">Aucune commande pour le moment</p>
            <p className="text-gray-400 text-sm mt-1 mb-6">Vos commandes apparaîtront ici après votre premier achat</p>
            <button onClick={() => router.push('/catalogue')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition">
              Voir le catalogue
            </button>
          </div>
        ) : (
          <>
            {/* Compteur */}
            <p className="text-gray-500 text-sm mb-5">
              <span className="font-bold text-gray-800">{orders.length}</span> commande{orders.length > 1 ? 's' : ''}
            </p>

            {/* Grille de blocs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {orders.map(order => {
                const items = parseItems(order.items);
                const status = statusConfig[order.status] || statusConfig.EN_ATTENTE;

                return (
                  <button
                    key={order.id}
                    onClick={() => setSelected(order)}
                    className="bg-white rounded-2xl border border-gray-100 p-5 text-left hover:shadow-md hover:border-blue-200 transition group"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-bold text-gray-800 text-sm">
                          #{String(order.id).padStart(5, '0')}
                        </p>
                        <div className="flex items-center gap-1 text-gray-400 text-xs mt-0.5">
                          <Clock size={11}/>
                          <span>{formatDate(order.createdAt)}</span>
                        </div>
                      </div>
                      <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${status.color}`}>
                        {status.icon} {status.label}
                      </span>
                    </div>

                    {/* Produits résumé */}
                    <div className="mb-3">
                     {items.slice(0, 2).map((item, i) => (
                      <p key={i} className="text-xs text-gray-500 truncate">
                        • {item.name || item.productName || item.product?.name || 'Produit'} × {item.quantity}
                        </p>
                      ))}
                      {items.length > 2 && (
                        <p className="text-xs text-gray-400">+{items.length - 2} autre{items.length - 2 > 1 ? 's' : ''}</p>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                      <span className="font-bold text-blue-600 text-sm">
                        {Number(order.totalPrice || 0).toLocaleString()} FCFA
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-400 group-hover:text-blue-500 transition">
                        Voir détails <ChevronRight size={13}/>
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* ── MODAL DÉTAIL ── */}
      {selected && (() => {
        const items = parseItems(selected.items);
        const status = statusConfig[selected.status] || statusConfig.EN_ATTENTE;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Fond */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelected(null)}/>

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

              {/* Header modal */}
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
                <div>
                  <h2 className="font-bold text-gray-800 text-lg">
                    Commande #{String(selected.id).padStart(5, '0')}
                  </h2>
                  <p className="text-gray-400 text-xs mt-0.5">{formatDateTime(selected.createdAt)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => downloadPDF(selected)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition"
                  >
                    <Download size={15}/> Télécharger PDF
                  </button>
                  <button onClick={() => setSelected(null)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition">
                    <X size={18}/>
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">

                {/* Statut */}
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${status.color}`}>
                  {status.icon}
                  <div>
                    <p className="font-bold text-sm">Statut : {status.label}</p>
                    <p className="text-xs opacity-70">Mis à jour le {formatDate(selected.createdAt)}</p>
                  </div>
                </div>

                {/* Infos client */}
                <div>
                  <h3 className="font-bold text-gray-700 text-sm mb-3 uppercase tracking-wide">
                    Informations client
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Nom complet', value: selected.clientName, icon: <Package size={14}/> },
                      { label: 'Téléphone', value: selected.clientPhone, icon: <Phone size={14}/> },
                      { label: 'Adresse', value: selected.clientAddress, icon: <MapPin size={14}/> },
                      { label: 'Email', value: selected.clientEmail || '—', icon: <Mail size={14}/> },
                    ].map((info, i) => (
                      <div key={i} className="bg-gray-50 rounded-xl p-3">
                        <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-1">
                          {info.icon} {info.label}
                        </div>
                        <p className="font-semibold text-gray-800 text-sm">{info.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Produits commandés */}
                <div>
                  <h3 className="font-bold text-gray-700 text-sm mb-3 uppercase tracking-wide">
                    Produits commandés
                  </h3>
                  <div className="border border-gray-100 rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Produit</th>
                          <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Prix</th>
                          <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Qté</th>
                          <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, i) => (
                          <tr key={i} className="border-b border-gray-50 last:border-0">
                            <td className="px-4 py-3 font-medium text-gray-800">{item.name}</td>
                            <td className="px-4 py-3 text-right text-gray-500">
                              {Number(item.price || 0).toLocaleString()} FCFA
                            </td>
                            <td className="px-4 py-3 text-right text-gray-500">× {item.quantity}</td>
                            <td className="px-4 py-3 text-right font-bold text-gray-800">
                              {(Number(item.price || 0) * item.quantity).toLocaleString()} FCFA
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-blue-50 border-t-2 border-blue-100">
                          <td colSpan={3} className="px-4 py-4 font-bold text-gray-800">TOTAL</td>
                          <td className="px-4 py-4 text-right font-bold text-blue-600 text-lg">
                            {Number(selected.totalPrice || 0).toLocaleString()} FCFA
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

              </div>
            </div>
          </div>
        );
      })()}

      <Footer/>
    </div>
  );
}