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
 *   - Persistent shell: Header, Footer, ScrollToTop, ScrollReveal, DynamicMetadata
 */
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../styles/globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import ScrollReveal from '@/components/ScrollReveal';
import DynamicMetadata from '@/components/DynamicMetadata';

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
    icon: 'https://img.icons8.com/ios-filled/50/60a5fa/home.png',
    apple: 'https://img.icons8.com/ios-filled/180/60a5fa/home.png',
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
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <Header />
          {children}
          <Footer />
          <ScrollToTop />
          <ScrollReveal />
          <DynamicMetadata />
        </ThemeProvider>
      </body>
    </html>
  );
}
