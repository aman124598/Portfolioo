import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  tags: string[];
  coverImage?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  responsibilities: string[];
  createdAt: string;
  updatedAt: string;
}

// Helper function to safely read JSON files
function safeReadJson<T>(filePath: string, defaultValue: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
  }
  return defaultValue;
}

// Project functions
export function getProjects(): Project[] {
  const projectsFile = path.join(dataDir, 'projects.json');
  return safeReadJson<Project[]>(projectsFile, []);
}

export function getFeaturedProjects(): Project[] {
  return getProjects().filter(p => p.featured);
}

export function getProjectById(id: string): Project | undefined {
  return getProjects().find(p => p.id === id);
}

// Blog functions
export function getBlogs(): Blog[] {
  const blogsFile = path.join(dataDir, 'blogs.json');
  return safeReadJson<Blog[]>(blogsFile, []);
}

export function getPublishedBlogs(): Blog[] {
  return getBlogs()
    .filter(b => b.published)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getBlogById(id: string): Blog | undefined {
  return getBlogs().find(b => b.id === id);
}

export function getBlogBySlug(slug: string): Blog | undefined {
  return getBlogs().find(b => b.slug === slug && b.published);
}

export function getBlogsByTag(tag: string): Blog[] {
  return getPublishedBlogs().filter(b => 
    b.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  );
}

// Experience functions
export function getExperiences(): Experience[] {
  const experiencesFile = path.join(dataDir, 'experiences.json');
  return safeReadJson<Experience[]>(experiencesFile, [])
    .sort((a, b) => {
      // Sort by current first, then by start date (latest first)
      if (a.current && !b.current) return -1;
      if (!a.current && b.current) return 1;
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    });
}

export function getExperienceById(id: string): Experience | undefined {
  const experiencesFile = path.join(dataDir, 'experiences.json');
  const experiences = safeReadJson<Experience[]>(experiencesFile, []);
  return experiences.find(e => e.id === id);
}
