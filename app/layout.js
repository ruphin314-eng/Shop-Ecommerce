import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata = {
  title: 'IUT DOUALA — Smartphones, Laptops & Tablets',
  description: 'Votre boutique tech en ligne',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="bg-gray-50 min-h-screen">
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}