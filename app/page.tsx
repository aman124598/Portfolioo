import React from "react"
import { getProjects, getExperiences } from "@/lib/portfolio-data"
import PortfolioClient from "./PortfolioClient"

export default function AmanPortfolio() {
  // Fetch projects from admin panel data
  const adminProjects = getProjects();
  
  // Fetch experiences from admin panel data
  const adminExperiences = getExperiences();

  // Static fallback projects (your original projects)
  const staticProjects = [
    {
      title: "Placement Notifier System",
      description:
        "A comprehensive placement management system designed to streamline the recruitment process. It features automated email notifications, Excel data parsing for bulk student uploads, and intelligent filtering based on CGPA and skills. Built with Next.js for a responsive frontend and FastAPI for high-performance backend processing.",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000&auto=format&fit=crop",
      tech: ["Next.js", "FastAPI", "TypeScript", "Python"],
      github: "https://github.com/aman124598/placement_notifier.git",
      live: "#",
      featured: true,
    },
    {
      title: "Location Based Attendance System",
      description:
        "An intelligent attendance tracking solution that leverages geolocation technology to verify teacher presence. The system uses AI-powered validation to ensure authenticity and provides real-time location-based check-ins, eliminating manual registers and reducing proxy attendance.",
      image: "https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?q=80&w=1000&auto=format&fit=crop",
      tech: ["React", "Express.js", "MongoDB", "Gemini API"],
      github: "https://github.com/aman124598/attendence.git",
      live: "#",
      featured: true,
    },
    {
      title: "Water Delivery Ecommerce Platform",
      description:
        "A multi-vendor e-commerce platform revolutionizing water delivery. It features a unique ad-supported model allowing users to waive delivery fees. The platform supports real-time order tracking, vendor management, and a seamless checkout experience using Supabase for reliable data handling.",
      image: "https://images.unsplash.com/photo-1543165796-5426273eaab3?q=80&w=1000&auto=format&fit=crop",
      tech: ["React", "Supabase"],
      github: "https://github.com/aman124598/AquaFlow.git",
      live: "#",
      featured: true,
    },
  ];

  // Transform admin projects to match the format
  const transformedAdminProjects = adminProjects.map(project => ({
    title: project.title,
    description: project.description,
    image: project.imageUrl || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1000&auto=format&fit=crop",
    tech: project.technologies,
    github: project.githubUrl || "#",
    live: project.liveUrl || "#",
    featured: project.featured,
  }));

  // Combine admin projects with static projects (admin projects first)
  const allProjects = [...transformedAdminProjects, ...staticProjects];
  
  // Show ALL projects (both featured and non-featured)
  const projects = allProjects;
  
  // Static fallback experience (in case admin has no experiences)
  const staticExperience = {
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
    ]
  };
  
  // Use admin experiences if available, otherwise use static
  const experiences = adminExperiences.length > 0 ? adminExperiences : [staticExperience];

  return <PortfolioClient projects={projects} experiences={experiences} />
}
