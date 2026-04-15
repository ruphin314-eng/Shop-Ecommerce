'use client';
import { useEffect } from 'react';
import { removeToken } from '@/lib/auth';
import useCart from '@/lib/useCart';

export default function LogoutPage() {
  useEffect(() => {
    removeToken();
    window.location.href = 'http://localhost:8080/logout';
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-3"/>
        <p className="text-gray-400 text-sm">Déconnexion en cours...</p>
      </div>
    </div>
  );
}