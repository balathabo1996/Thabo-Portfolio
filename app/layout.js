/**
 * Root Layout  —  app/layout.js
 * ==============================
 * Barebones layout that applies to the entire application.
 * Routing is separated into (site) and (admin) groups for style isolation.
 */
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Outfit, Inter } from 'next/font/google';
import SmoothScrolling from '@/components/SmoothScrolling';
import '@/styles/globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: 'Thabo.Portfolio',
  description: 'Portfolio of Balachandran Thabotharan',
  icons: {
    icon: '/favicon.png',
  },
};

export const generateViewport = () => ({
  themeColor: '#0a0c10',
  width: 'device-width',
  initialScale: 1,
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body className={`${outfit.variable} ${inter.variable}`} suppressHydrationWarning>
        <SmoothScrolling>
          {children}
        </SmoothScrolling>
      </body>
    </html>
  );
}
