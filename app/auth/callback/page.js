'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { saveToken, saveUser } from '@/lib/auth';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

 useEffect(() => {
  const token    = searchParams.get('token');
  const role     = searchParams.get('role');
  const username = searchParams.get('username');
  const userId   = searchParams.get('userId');

  if (!token) {
    window.location.href = 'http://localhost:8080/login';
    return;
  }

  saveToken(token);
  saveUser({ username, role, userId });
  router.replace('/catalogue');
// eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  // Page de transition — l'utilisateur la voit une fraction de seconde
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"/>
        <p className="text-gray-400 text-sm">Connexion en cours...</p>
      </div>
    </div>
  );
}