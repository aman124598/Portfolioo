import { getProjects as dbGetProjects, getBlogs as dbGetBlogs, getExperiences as dbGetExperiences } from './db';
import type { Project, Blog, Experience } from './db';

export type { Project, Blog, Experience };

// Project functions
export async function getProjects(): Promise<Project[]> {
  try {
    return await dbGetProjects();
  } catch {
    return [];
  }
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await getProjects();
  return projects.filter(p => p.featured);
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  const projects = await getProjects();
  return projects.find(p => p.id === id);
}

// Blog functions
export async function getBlogs(): Promise<Blog[]> {
  try {
    return await dbGetBlogs();
  } catch {
    return [];
  }
}

export async function getPublishedBlogs(): Promise<Blog[]> {
  const blogs = await getBlogs();
  return blogs
    .filter(b => b.published)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getBlogById(id: string): Promise<Blog | undefined> {
  const blogs = await getBlogs();
  return blogs.find(b => b.id === id);
}

export async function getBlogBySlug(slug: string): Promise<Blog | undefined> {
  const blogs = await getBlogs();
  return blogs.find(b => b.slug === slug && b.published);
}

export async function getBlogsByTag(tag: string): Promise<Blog[]> {
  const published = await getPublishedBlogs();
  return published.filter(b => 
    b.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  );
}

// Experience functions
export async function getExperiences(): Promise<Experience[]> {
  try {
    return await dbGetExperiences();
  } catch {
    return [];
  }
}

export async function getExperienceById(id: string): Promise<Experience | undefined> {
  const experiences = await getExperiences();
  return experiences.find(e => e.id === id);
}
