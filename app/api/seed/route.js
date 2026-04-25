import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Project from '@/lib/models/Project';
import Experience from '@/lib/models/Experience';
import Profile from '@/lib/models/Profile';

export async function POST(request) {
  try {
    const apiKey = request.headers.get('x-api-key');
    if (apiKey !== process.env.ADMIN_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    // 1. Seed Profile
    const profileData = {
      name: 'Thabotharan Balachandran',
      role: 'Infrastructure Engineer | IT Solutions Student | Cybersecurity Enthusiast',
      location: 'Scarborough, Ontario, Canada',
      email: 'balathabo96@gmail.com',
      phone: '+1 (437) 383-1996',
      profileImageUrl: '/images/portf.png',
      bio: 'Experienced IT professional specialising in infrastructure and cybersecurity.'
    };
    await Profile.findOneAndUpdate({}, profileData, { upsert: true });

    // 2. Seed Experience/Education
    await Experience.deleteMany({});
    const experiences = [
      {
        role: 'IT Solutions (Graduate Certificate)',
        company: 'Humber IGS',
        location: 'Ontario, Canada',
        period: 'Sep 2024 – Present',
        type: 'education',
        order: 1
      },
      {
        role: 'Bachelor of Information and Communication Technology (Hons)',
        company: 'University of Sri Jayewardenepura',
        location: 'Colombo, Sri Lanka',
        period: 'Aug 2016 – Apr 2021',
        type: 'education',
        order: 2
      },
      // 3. Achievements & Certifications
      {
        role: 'Diploma in Information and Communication Technology',
        company: 'DMI',
        type: 'achievement',
        order: 1
      },
      {
        role: 'Business Communication Course',
        company: 'British Council',
        type: 'achievement',
        order: 2
      },
      // 4. Voluntary Contributions
      {
        role: 'Student Volunteer',
        company: 'Humber International Graduate School (IGS)',
        type: 'voluntary',
        order: 1
      },
      {
        role: 'Infotel Conference Volunteer',
        company: '2018',
        type: 'voluntary',
        order: 2
      },
      {
        role: 'Scout Volunteer',
        company: 'Temple Festival (2011)',
        type: 'voluntary',
        order: 3
      },
      {
        role: 'St John’s Ambulance Volunteer',
        company: 'Athletic meets (2008, 2009, 2010)',
        type: 'voluntary',
        order: 4
      }
    ];
    await Experience.insertMany(experiences);

    // 3. Seed Projects
    await Project.deleteMany({});
    const projects = [
      {
        title: 'Infrastructure Modernization',
        description: 'Led a project to migrate legacy server environments to a modern, virtualized infrastructure using VMware and Windows Server 2022.',
        imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&w=800&q=80',
        features: ['Zero-downtime Migration', 'Active Directory Restructure', 'Storage Optimization'],
        techStack: ['Windows Server', 'VMware'],
        order: 1
      },
      {
        title: 'Secure Web Framework',
        description: 'Developed a robust web application backend with integrated security protocols, optimized database queries, and RESTful APIs.',
        imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
        features: ['Secure Authentication (JWT)', 'Database Optimization', 'API Rate Limiting'],
        techStack: ['Node.js', 'Express', 'MongoDB'],
        order: 2
      }
    ];
    await Project.insertMany(projects);

    return NextResponse.json({ message: 'Database seeded successfully' });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
