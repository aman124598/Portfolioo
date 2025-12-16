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

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize files if they don't exist
const projectsFile = path.join(dataDir, 'projects.json');
const blogsFile = path.join(dataDir, 'blogs.json');

if (!fs.existsSync(projectsFile)) {
  fs.writeFileSync(projectsFile, JSON.stringify([], null, 2));
}

if (!fs.existsSync(blogsFile)) {
  fs.writeFileSync(blogsFile, JSON.stringify([], null, 2));
}

// Project CRUD operations
export function getProjects(): Project[] {
  const data = fs.readFileSync(projectsFile, 'utf-8');
  return JSON.parse(data);
}

export function getProjectById(id: string): Project | undefined {
  const projects = getProjects();
  return projects.find(p => p.id === id);
}

export function createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project {
  const projects = getProjects();
  const newProject: Project = {
    ...project,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  projects.push(newProject);
  fs.writeFileSync(projectsFile, JSON.stringify(projects, null, 2));
  return newProject;
}

export function updateProject(id: string, updates: Partial<Omit<Project, 'id' | 'createdAt'>>): Project | null {
  const projects = getProjects();
  const index = projects.findIndex(p => p.id === id);
  if (index === -1) return null;
  
  projects[index] = {
    ...projects[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(projectsFile, JSON.stringify(projects, null, 2));
  return projects[index];
}

export function deleteProject(id: string): boolean {
  const projects = getProjects();
  const filtered = projects.filter(p => p.id !== id);
  if (filtered.length === projects.length) return false;
  
  fs.writeFileSync(projectsFile, JSON.stringify(filtered, null, 2));
  return true;
}

// Blog CRUD operations
export function getBlogs(): Blog[] {
  const data = fs.readFileSync(blogsFile, 'utf-8');
  return JSON.parse(data);
}

export function getBlogById(id: string): Blog | undefined {
  const blogs = getBlogs();
  return blogs.find(b => b.id === id);
}

export function getBlogBySlug(slug: string): Blog | undefined {
  const blogs = getBlogs();
  return blogs.find(b => b.slug === slug);
}

export function createBlog(blog: Omit<Blog, 'id' | 'createdAt' | 'updatedAt'>): Blog {
  const blogs = getBlogs();
  const newBlog: Blog = {
    ...blog,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  blogs.push(newBlog);
  fs.writeFileSync(blogsFile, JSON.stringify(blogs, null, 2));
  return newBlog;
}

export function updateBlog(id: string, updates: Partial<Omit<Blog, 'id' | 'createdAt'>>): Blog | null {
  const blogs = getBlogs();
  const index = blogs.findIndex(b => b.id === id);
  if (index === -1) return null;
  
  blogs[index] = {
    ...blogs[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(blogsFile, JSON.stringify(blogs, null, 2));
  return blogs[index];
}

export function deleteBlog(id: string): boolean {
  const blogs = getBlogs();
  const filtered = blogs.filter(b => b.id !== id);
  if (filtered.length === blogs.length) return false;
  
  fs.writeFileSync(blogsFile, JSON.stringify(filtered, null, 2));
  return true;
}
