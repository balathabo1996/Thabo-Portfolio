/**
 * Root Layout  —  app/layout.js
 * ==============================
 * The foundational layout wrapping the entire HTML document.
 * Configures global typography fonts, Next.js page metadata, global viewports,
 * and initializes smooth lenis scrolling.
 * 
 * Note: Routing is split between (site) and (admin) route groups to allow 
 * layout/style isolation (the landing page uses customized headers and standard
 * styles, while the admin dashboard loads custom charts, forms, and tools).
 */

import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Outfit, Inter } from 'next/font/google';
import SmoothScrolling from '@/components/SmoothScrolling';
import '@/styles/globals.css';

// Configure the Outfit font with subsets and variable token mapping
const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

// Configure the Inter font with subsets and variable token mapping
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

/**
 * Root site-wide SEO metadata parameters.
 * Used as fallback SEO data if not overridden by child pages.
 */
export const metadata = {
  title: 'Thabo.Portfolio',
  description: 'Portfolio of Balachandran Thabotharan',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.png',
    apple: '/apple-icon.png',
  },
};

/**
 * Root dynamic viewport parameters configuration.
 * Configures the mobile viewport scaling and dark background color.
 */
export const generateViewport = () => ({
  themeColor: '#0a0c10',
  width: 'device-width',
  initialScale: 1,
});

/**
 * RootLayout Component
 * Wraps all pages. suppression warnings are enabled to prevent hydration warnings from
 * theme toggling or dynamic browser features.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Route segments to render inside the body layout
 */
export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={`${outfit.variable}  ${inter.variable}`} suppressHydrationWarning>
        <SmoothScrolling>
          {children}
        </SmoothScrolling>
      </body>
    </html>
  );
}

