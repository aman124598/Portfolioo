import { sql } from '@vercel/postgres';

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

// Project CRUD operations
export function getProjects(): Project[] {
  // This will be called from server components, we need to make it async
  // For now, return empty and we'll fix the page component
  return [];
}

// Async version for API routes
export async function getProjectsAsync(): Promise<Project[]> {
  try {
    const { rows } = await sql`SELECT * FROM projects ORDER BY createdAt DESC`;
    return rows.map(row => ({
      ...row,
      createdAt: row.createdat?.toISOString() || new Date().toISOString(),
      updatedAt: row.updatedat?.toISOString() || new Date().toISOString(),
    })) as Project[];
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  try {
    const { rows } = await sql`SELECT * FROM projects WHERE id = ${id} LIMIT 1`;
    if (rows[0]) {
      return {
        ...rows[0],
        createdAt: rows[0].createdat?.toISOString() || new Date().toISOString(),
        updatedAt: rows[0].updatedat?.toISOString() || new Date().toISOString(),
      } as Project;
    }
    return undefined;
  } catch (error) {
    console.error('Error fetching project:', error);
    return undefined;
  }
}

export async function createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
  const id = Date.now().toString();
  const now = new Date().toISOString();
  
  await sql`
    INSERT INTO projects (id, title, description, technologies, imageUrl, liveUrl, githubUrl, featured, createdAt, updatedAt)
    VALUES (${id}, ${project.title}, ${project.description}, ${project.technologies}, ${project.imageUrl || null}, ${project.liveUrl || null}, ${project.githubUrl || null}, ${project.featured}, ${now}, ${now})
  `;
  
  return { ...project, id, createdAt: now, updatedAt: now };
}

export async function updateProject(id: string, updates: Partial<Omit<Project, 'id' | 'createdAt'>>): Promise<Project | null> {
  const now = new Date().toISOString();
  
  const { rows } = await sql`
    UPDATE projects 
    SET 
      title = COALESCE(${updates.title || null}, title),
      description = COALESCE(${updates.description || null}, description),
      technologies = COALESCE(${updates.technologies || null}, technologies),
      imageUrl = COALESCE(${updates.imageUrl || null}, imageUrl),
      liveUrl = COALESCE(${updates.liveUrl || null}, liveUrl),
      githubUrl = COALESCE(${updates.githubUrl || null}, githubUrl),
      featured = COALESCE(${updates.featured !== undefined ? updates.featured : null}, featured),
      updatedAt = ${now}
    WHERE id = ${id}
    RETURNING *
  `;
  
  return rows[0] ? {
    ...rows[0],
    createdAt: rows[0].createdat?.toISOString() || new Date().toISOString(),
    updatedAt: now,
  } as Project : null;
}

export async function deleteProject(id: string): Promise<boolean> {
  const { rowCount } = await sql`DELETE FROM projects WHERE id = ${id}`;
  return (rowCount ?? 0) > 0;
}

// Blog CRUD operations
export function getBlogs(): Blog[] {
  // This will be called from server components, we need to make it async
  // For now, return empty and we'll fix the page component
  return [];
}

// Async version for API routes
export async function getBlogsAsync(): Promise<Blog[]> {
  try {
    const { rows } = await sql`SELECT * FROM blogs ORDER BY createdAt DESC`;
    return rows.map(row => ({
      ...row,
      createdAt: row.createdat?.toISOString() || new Date().toISOString(),
      updatedAt: row.updatedat?.toISOString() || new Date().toISOString(),
    })) as Blog[];
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
}

export async function getBlogById(id: string): Promise<Blog | undefined> {
  try {
    const { rows } = await sql`SELECT * FROM blogs WHERE id = ${id} LIMIT 1`;
    if (rows[0]) {
      return {
        ...rows[0],
        createdAt: rows[0].createdat?.toISOString() || new Date().toISOString(),
        updatedAt: rows[0].updatedat?.toISOString() || new Date().toISOString(),
      } as Blog;
    }
    return undefined;
  } catch (error) {
    console.error('Error fetching blog:', error);
    return undefined;
  }
}

export async function getBlogBySlug(slug: string): Promise<Blog | undefined> {
  try {
    const { rows } = await sql`SELECT * FROM blogs WHERE slug = ${slug} LIMIT 1`;
    if (rows[0]) {
      return {
        ...rows[0],
        createdAt: rows[0].createdat?.toISOString() || new Date().toISOString(),
        updatedAt: rows[0].updatedat?.toISOString() || new Date().toISOString(),
      } as Blog;
    }
    return undefined;
  } catch (error) {
    console.error('Error fetching blog by slug:', error);
    return undefined;
  }
}

export async function createBlog(blog: Omit<Blog, 'id' | 'createdAt' | 'updatedAt'>): Promise<Blog> {
  const id = Date.now().toString();
  const now = new Date().toISOString();
  
  await sql`
    INSERT INTO blogs (id, title, slug, excerpt, content, author, tags, coverImage, published, createdAt, updatedAt)
    VALUES (${id}, ${blog.title}, ${blog.slug}, ${blog.excerpt}, ${blog.content}, ${blog.author}, ${blog.tags}, ${blog.coverImage || null}, ${blog.published}, ${now}, ${now})
  `;
  
  return { ...blog, id, createdAt: now, updatedAt: now };
}

export async function updateBlog(id: string, updates: Partial<Omit<Blog, 'id' | 'createdAt'>>): Promise<Blog | null> {
  const now = new Date().toISOString();
  
  const { rows } = await sql`
    UPDATE blogs 
    SET 
      title = COALESCE(${updates.title || null}, title),
      slug = COALESCE(${updates.slug || null}, slug),
      excerpt = COALESCE(${updates.excerpt || null}, excerpt),
      content = COALESCE(${updates.content || null}, content),
      author = COALESCE(${updates.author || null}, author),
      tags = COALESCE(${updates.tags || null}, tags),
      coverImage = COALESCE(${updates.coverImage || null}, coverImage),
      published = COALESCE(${updates.published !== undefined ? updates.published : null}, published),
      updatedAt = ${now}
    WHERE id = ${id}
    RETURNING *
  `;
  
  return rows[0] ? {
    ...rows[0],
    createdAt: rows[0].createdat?.toISOString() || new Date().toISOString(),
    updatedAt: now,
  } as Blog : null;
}

export async function deleteBlog(id: string): Promise<boolean> {
  const { rowCount } = await sql`DELETE FROM blogs WHERE id = ${id}`;
  return (rowCount ?? 0) > 0;
}

