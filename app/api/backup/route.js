import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Profile from '@/lib/models/Profile';
import Project from '@/lib/models/Project';
import Experience from '@/lib/models/Experience';
import Skill from '@/lib/models/Skill';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();

    const [profile, projects, experiences, skills] = await Promise.all([
      Profile.findOne().lean(),
      Project.find().lean(),
      Experience.find().lean(),
      Skill.find().lean(),
    ]);

    const backup = {
      exportedAt: new Date().toISOString(),
      version: '1.0',
      data: { profile, projects, experiences, skills },
    };

    return new NextResponse(JSON.stringify(backup, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="portfolio-backup-${new Date().toISOString().split('T')[0]}.json"`,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
