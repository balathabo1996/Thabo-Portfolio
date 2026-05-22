/**
 * Site Layout Segment — app/(site)/layout.js
 * ===========================================
 * Orchestrates the public-facing section layout.
 * Connects directly to MongoDB server-side to fetch the owner's profile document,
 * passing identity data directly into the custom Footer component,
 * and loading persistent global widgets (Header, ScrollToTop, DynamicMetadata).
 */

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import DynamicMetadata from '@/components/DynamicMetadata';
import { connectToDatabase } from "@/lib/mongodb";
import Profile from "@/lib/models/Profile";

// Disable Next.js data caching to guarantee that modifications from the admin panel propagate instantly
export const revalidate = 0;

/**
 * SiteLayout Component (Server Component)
 * Establishes DB sync to get profile properties and renders public shell components.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Inner route segments (e.g. public page)
 */
export default async function SiteLayout({ children }) {
  let profileData = {};
  try {
    // Sync with database
    await connectToDatabase();
    // Retrieve the owner identity record
    const data = await Profile.findOne().lean();
    profileData = data ? JSON.parse(JSON.stringify(data)) : {};
  } catch (e) {
    console.error("Layout fetch error:", e);
  }

  return (
    <>
      {/* Top sticky responsive website navigation bar */}
      <Header />
      
      {/* Primary child pages content wrapper */}
      {children}
      
      {/* Public footer displaying shared contact coordinates and copyrights */}
      <Footer profile={profileData} />
      
      {/* Interactive sticky dynamic scroll-to-top micro-animation widget */}
      <ScrollToTop />
      
      {/* Helper component injecting custom favicon configurations */}
      <DynamicMetadata />
    </>
  );
}

