// Sauvegarde le token après login
export function saveToken(token) {
  localStorage.setItem('token', token);
}

// Récupère le token
export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

// Supprime le token (déconnexion)
export function removeToken() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

// Sauvegarde les infos utilisateur
export function saveUser(user) {
  localStorage.setItem('user', JSON.stringify(user));
}

// Récupère les infos utilisateur
export function getUser() {
  if (typeof window === 'undefined') return null;
  const u = localStorage.getItem('user');
  return u ? JSON.parse(u) : null;
}

// Vérifie si connecté
export function isLoggedIn() {
  return !!getToken();
}
