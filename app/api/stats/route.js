import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Project from '@/lib/models/Project';
import Experience from '@/lib/models/Experience';
import Skill from '@/lib/models/Skill';
import Analytics from '@/lib/models/Analytics';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();

    const [
      totalProjects,
      draftProjects,
      totalExperience,
      draftExperience,
      totalSkills,
      draftSkills,
      resumeDownloads,
    ] = await Promise.all([
      Project.countDocuments(),
      Project.countDocuments({ status: 'draft' }),
      Experience.countDocuments(),
      Experience.countDocuments({ status: 'draft' }),
      Skill.countDocuments(),
      Skill.countDocuments({ status: 'draft' }),
      Analytics.findOne({ event: 'resume_download' }),
    ]);

    return NextResponse.json({
      totalProjects,
      publishedProjects: totalProjects - draftProjects,
      draftProjects,
      totalExperience,
      draftExperience,
      totalSkills,
      draftSkills,
      resumeDownloads: resumeDownloads?.count ?? 0,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
