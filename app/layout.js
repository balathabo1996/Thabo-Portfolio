/**
 * Root Layout  —  app/layout.js
 * ==============================
 * Wraps every page in the application with:
 *   - Global CSS: Bootstrap 5, Font Awesome icons, custom globals
 *   - Site-wide metadata (title, description, PWA manifest, icons)
 *   - Viewport / theme-color settings via generateViewport (Next.js 15+)
 *   - Anti-flash inline <script> that applies the saved theme token to
 *     <html data-theme> before React hydrates, preventing a light-flash
 *   - ThemeProvider  – dark / light mode context for the whole tree
 *   - Persistent shell: Header, Footer, ScrollToTop, DynamicMetadata
 */
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../styles/globals.css';
import { Outfit, Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import ThemeToggle from '@/components/ThemeToggle';
import DynamicMetadata from '@/components/DynamicMetadata';

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
  description:
    'Portfolio of Balachandran Thabotharan, an experienced Infrastructure Engineer & IT Professional specializing in System Administration and Web Development.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Thabo.Portfolio',
  },
  icons: {
    icon: '/favicon.png',
    apple: '/apple-icon.png',
  },
};

export const generateViewport = () => ({
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Inline script prevents theme flash before hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var t = localStorage.getItem('theme') ||
                  (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
                document.documentElement.setAttribute('data-theme', t);
              } catch(e) {}
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Balachandran Thabotharan",
              jobTitle: "Infrastructure Engineer & IT Solutions Professional",
              url: "https://thabo-portfolio.vercel.app",
              image: "https://thabo-portfolio.vercel.app/images/portf.png",
              sameAs: [
                "https://www.linkedin.com/in/balachandran-thabotharan-261895131",
                "https://github.com/balathabo1996"
              ]
            })
          }}
        />
      </head>
      <body className={`${outfit.variable} ${inter.variable}`} suppressHydrationWarning>
        <ThemeProvider>
          <Header />
          {children}
          <Footer />
          <ThemeToggle />
          <ScrollToTop />
          <DynamicMetadata />
        </ThemeProvider>
      </body>
    </html>
  );
}
