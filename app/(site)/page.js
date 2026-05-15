import { connectToDatabase } from "@/lib/mongodb";
import Profile from "@/lib/models/Profile";
import Experience from "@/lib/models/Experience";
import Project from "@/lib/models/Project";
import Skill from "@/lib/models/Skill";
import Hero from "@/components/Hero";
import About from "@/components/About";
import ProjectsGrid from "@/components/ProjectsGrid";
import ContactSection from "@/components/ContactSection";
import ScrollReveal from "@/components/ScrollReveal";
import StructuredData from "@/components/StructuredData";

// Disable static caching so admin updates show immediately
export const revalidate = 0;

export const metadata = {
  metadataBase: new URL("https://thabo-portfolio.vercel.app"),
  title: "Thabo.Projects | Thabotharan Balachandran",
  description:
    "Portfolio of Thabotharan Balachandran, an experienced Infrastructure Engineer & IT Professional specializing in System Administration and Web Development.",
  openGraph: {
    title: "Thabo.Projects | Thabotharan Balachandran",
    description: "Infrastructure Engineer & IT Solutions Professional",
    url: "https://thabo-portfolio.vercel.app",
    siteName: "Thabo Portfolio",
    images: [
      {
        url: "https://res.cloudinary.com/dk4kvk0kw/image/upload/v1/thabo-portfolio/profileImageUrl.png",
        width: 800,
        height: 800,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Thabo.Projects | Thabotharan Balachandran",
    description: "Infrastructure Engineer & IT Solutions Professional",
    images: ["https://res.cloudinary.com/dk4kvk0kw/image/upload/v1/thabo-portfolio/profileImageUrl.png"],
  },
  icons: {
    icon: "https://img.icons8.com/ios-filled/50/000000/home.png",
    shortcut: "https://img.icons8.com/ios-filled/50/000000/home.png",
  },
};

export default async function HomePage() {
  let profileData = {};
  let achievements = [];
  let voluntary = [];
  let educationExperience = [];
  let workExperience = [];
  let dbProjects = [];
  let dbSkills = {};

  try {
    // Attempt database connection
    await connectToDatabase();

    // 1. Fetch Profile Data
    const rawProfile = await Profile.findOne().lean();
    profileData = rawProfile ? JSON.parse(JSON.stringify(rawProfile)) : {};

    // 2. Fetch All Experiences and group them (Exclude drafts)
    const rawExperiences = await Experience.find({ status: { $ne: "draft" } }).sort({ order: 1 }).lean();
    const allExperiences = JSON.parse(JSON.stringify(rawExperiences));
    
    // Grouping by type
    achievements = allExperiences.filter((e) => e.type === "achievement");
    voluntary = allExperiences.filter((e) => e.type === "voluntary");
    educationExperience = allExperiences.filter((e) => e.type === "education");
    workExperience = allExperiences.filter((e) => e.type === "work");

    // 3. Fetch Projects (Exclude drafts)
    const rawProjects = await Project.find({ status: { $ne: "draft" } }).sort({ order: 1 }).lean();
    dbProjects = JSON.parse(JSON.stringify(rawProjects));

    // 4. Fetch Skills (Exclude drafts)
    const rawSkills = await Skill.find({ status: { $ne: "draft" } }).sort({ order: 1 }).lean();
    const skillsList = JSON.parse(JSON.stringify(rawSkills));
    dbSkills = skillsList.reduce((acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    }, {});

  } catch (error) {
    console.error("Database sync notice (using static fallbacks):", error.message);
  }

  return (
    <>
      <StructuredData profile={profileData} />
      
      <Hero profile={profileData} />

      <div className="section-divider"></div>

      <About 
        profile={profileData}
        dbSkills={dbSkills} 
        achievements={achievements} 
        voluntary={voluntary} 
        educationExperience={educationExperience}
        workExperience={workExperience}
      />

      <div className="section-divider"></div>

      <ProjectsGrid dbProjects={dbProjects} />

      <div className="section-divider"></div>

      <ContactSection profile={profileData} />
      
      <ScrollReveal />
    </>
  );
}
