import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { getAuthUser } from '@/lib/auth';

export async function POST() {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const results = {
      projects: { added: 0, skipped: false },
      experiences: { added: 0, skipped: false },
    };

    // Check if projects table has data
    const { rows: existingProjects } = await sql`SELECT COUNT(*) as count FROM projects`;
    const projectCount = parseInt(existingProjects[0].count);
    
    if (projectCount === 0) {
      const projects = [
        {
          title: "Placement Notifier System",
          description: "A comprehensive placement management system designed to streamline the recruitment process. It features automated email notifications, Excel data parsing for bulk student uploads, and intelligent filtering based on CGPA and skills. Built with Next.js for a responsive frontend and FastAPI for high-performance backend processing.",
          technologies: ["Next.js", "FastAPI", "TypeScript", "Python"],
          imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000&auto=format&fit=crop",
          githubUrl: "https://github.com/aman124598/placement_notifier.git",
          liveUrl: "",
          featured: true,
        },
        {
          title: "Location Based Attendance System",
          description: "An intelligent attendance tracking solution that leverages geolocation technology to verify teacher presence. The system uses AI-powered validation to ensure authenticity and provides real-time location-based check-ins, eliminating manual registers and reducing proxy attendance.",
          technologies: ["React", "Express.js", "MongoDB", "Gemini API"],
          imageUrl: "https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?q=80&w=1000&auto=format&fit=crop",
          githubUrl: "https://github.com/aman124598/attendence.git",
          liveUrl: "",
          featured: true,
        },
        {
          title: "Water Delivery Ecommerce Platform",
          description: "A multi-vendor e-commerce platform revolutionizing water delivery. It features a unique ad-supported model allowing users to waive delivery fees. The platform supports real-time order tracking, vendor management, and a seamless checkout experience using Supabase for reliable data handling.",
          technologies: ["React", "Supabase"],
          imageUrl: "https://images.unsplash.com/photo-1543165796-5426273eaab3?q=80&w=1000&auto=format&fit=crop",
          githubUrl: "https://github.com/aman124598/AquaFlow.git",
          liveUrl: "",
          featured: true,
        },
      ];

      for (const project of projects) {
        const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        const now = new Date().toISOString();
        
        await sql`
          INSERT INTO projects (id, title, description, technologies, imageUrl, liveUrl, githubUrl, featured, createdAt, updatedAt)
          VALUES (${id}, ${project.title}, ${project.description}, ${project.technologies}, ${project.imageUrl}, ${project.liveUrl}, ${project.githubUrl}, ${project.featured}, ${now}, ${now})
        `;
        results.projects.added++;
      }
    } else {
      results.projects.skipped = true;
    }

    // Check if experiences table has data
    const { rows: existingExperiences } = await sql`SELECT COUNT(*) as count FROM experiences`;
    const experienceCount = parseInt(existingExperiences[0].count);
    
    if (experienceCount === 0) {
      const experiences = [
        {
          title: "Cybersecurity Intern",
          company: "CFSS Cyber and Forensics Security Solutions",
          location: "Bangalore",
          startDate: "2024-03",
          endDate: "2024-04",
          current: false,
          description: "Internship focused on cybersecurity and penetration testing",
          responsibilities: [
            "Performed vulnerability testing with tools like Nmap, Wireshark, and Burp Suite",
            "Practiced ethical hacking and security assessment methodologies in real-world environments",
            "Gained hands-on experience with penetration testing frameworks and security protocols"
          ],
        },
      ];

      for (const exp of experiences) {
        const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        const now = new Date().toISOString();
        
        await sql`
          INSERT INTO experiences (id, title, company, location, startDate, endDate, current, description, responsibilities, createdAt, updatedAt)
          VALUES (${id}, ${exp.title}, ${exp.company}, ${exp.location}, ${exp.startDate}, ${exp.endDate}, ${exp.current}, ${exp.description}, ${exp.responsibilities}, ${now}, ${now})
        `;
        results.experiences.added++;
      }
    } else {
      results.experiences.skipped = true;
    }

    return NextResponse.json({
      success: true,
      message: 'Seed completed',
      results,
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: 'Failed to seed data', details: String(error) },
      { status: 500 }
    );
  }
}
