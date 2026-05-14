import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import DynamicMetadata from '@/components/DynamicMetadata';
import { connectToDatabase } from "@/lib/mongodb";
import Profile from "@/lib/models/Profile";

export const revalidate = 0;

export default async function SiteLayout({ children }) {
  let profileData = {};
  try {
    await connectToDatabase();
    const data = await Profile.findOne().lean();
    profileData = data ? JSON.parse(JSON.stringify(data)) : {};
  } catch (e) {
    console.error("Layout fetch error:", e);
  }

  return (
    <>
      <Header />
      {children}
      <Footer profile={profileData} />
      <ScrollToTop />
      <DynamicMetadata />
    </>
  );
}
