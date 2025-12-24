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

// Initialize database tables
export async function initDB() {
  try {
    // Create projects table
    await sql`
      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        technologies TEXT[] NOT NULL,
        imageUrl TEXT,
        liveUrl TEXT,
        githubUrl TEXT,
        featured BOOLEAN DEFAULT false,
        createdAt TIMESTAMP DEFAULT NOW(),
        updatedAt TIMESTAMP DEFAULT NOW()
      )
    `;

    // Create blogs table
    await sql`
      CREATE TABLE IF NOT EXISTS blogs (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        excerpt TEXT NOT NULL,
        content TEXT NOT NULL,
        author TEXT NOT NULL,
        tags TEXT[] NOT NULL,
        coverImage TEXT,
        published BOOLEAN DEFAULT false,
        createdAt TIMESTAMP DEFAULT NOW(),
        updatedAt TIMESTAMP DEFAULT NOW()
      )
    `;

    // Create experiences table
    await sql`
      CREATE TABLE IF NOT EXISTS experiences (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        company TEXT NOT NULL,
        location TEXT NOT NULL,
        startDate TEXT NOT NULL,
        endDate TEXT,
        current BOOLEAN DEFAULT false,
        description TEXT NOT NULL,
        responsibilities TEXT[] NOT NULL,
        createdAt TIMESTAMP DEFAULT NOW(),
        updatedAt TIMESTAMP DEFAULT NOW()
      )
    `;

    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Projects CRUD
export async function getProjects(): Promise<Project[]> {
  const { rows } = await sql`SELECT * FROM projects ORDER BY createdAt DESC`;
  return rows.map(row => ({
    ...row,
    createdAt: row.createdat?.toISOString() || new Date().toISOString(),
    updatedAt: row.updatedat?.toISOString() || new Date().toISOString(),
  })) as Project[];
}

export async function createProject(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
  const id = Date.now().toString();
  const now = new Date().toISOString();
  
  await sql`
    INSERT INTO projects (id, title, description, technologies, imageUrl, liveUrl, githubUrl, featured, createdAt, updatedAt)
    VALUES (${id}, ${data.title}, ${data.description}, ${data.technologies}, ${data.imageUrl || null}, ${data.liveUrl || null}, ${data.githubUrl || null}, ${data.featured}, ${now}, ${now})
  `;
  
  return { ...data, id, createdAt: now, updatedAt: now };
}

export async function updateProject(id: string, data: Partial<Omit<Project, 'id' | 'createdAt'>>): Promise<Project | null> {
  const now = new Date().toISOString();
  
  const { rows } = await sql`
    UPDATE projects 
    SET 
      title = COALESCE(${data.title || null}, title),
      description = COALESCE(${data.description || null}, description),
      technologies = COALESCE(${data.technologies || null}, technologies),
      imageUrl = COALESCE(${data.imageUrl || null}, imageUrl),
      liveUrl = COALESCE(${data.liveUrl || null}, liveUrl),
      githubUrl = COALESCE(${data.githubUrl || null}, githubUrl),
      featured = COALESCE(${data.featured !== undefined ? data.featured : null}, featured),
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

// Blogs CRUD
export async function getBlogs(): Promise<Blog[]> {
  const { rows } = await sql`SELECT * FROM blogs ORDER BY createdAt DESC`;
  return rows.map(row => ({
    ...row,
    createdAt: row.createdat?.toISOString() || new Date().toISOString(),
    updatedAt: row.updatedat?.toISOString() || new Date().toISOString(),
  })) as Blog[];
}

export async function createBlog(data: Omit<Blog, 'id' | 'createdAt' | 'updatedAt'>): Promise<Blog> {
  const id = Date.now().toString();
  const now = new Date().toISOString();
  
  await sql`
    INSERT INTO blogs (id, title, slug, excerpt, content, author, tags, coverImage, published, createdAt, updatedAt)
    VALUES (${id}, ${data.title}, ${data.slug}, ${data.excerpt}, ${data.content}, ${data.author}, ${data.tags}, ${data.coverImage || null}, ${data.published}, ${now}, ${now})
  `;
  
  return { ...data, id, createdAt: now, updatedAt: now };
}

export async function updateBlog(id: string, data: Partial<Omit<Blog, 'id' | 'createdAt'>>): Promise<Blog | null> {
  const now = new Date().toISOString();
  
  const { rows } = await sql`
    UPDATE blogs 
    SET 
      title = COALESCE(${data.title || null}, title),
      slug = COALESCE(${data.slug || null}, slug),
      excerpt = COALESCE(${data.excerpt || null}, excerpt),
      content = COALESCE(${data.content || null}, content),
      author = COALESCE(${data.author || null}, author),
      tags = COALESCE(${data.tags || null}, tags),
      coverImage = COALESCE(${data.coverImage || null}, coverImage),
      published = COALESCE(${data.published !== undefined ? data.published : null}, published),
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

export async function getBlogById(id: string): Promise<Blog | null> {
  const { rows } = await sql`SELECT * FROM blogs WHERE id = ${id} LIMIT 1`;
  return rows[0] ? {
    ...rows[0],
    createdAt: rows[0].createdat?.toISOString() || new Date().toISOString(),
    updatedAt: rows[0].updatedat?.toISOString() || new Date().toISOString(),
  } as Blog : null;
}

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  const { rows } = await sql`SELECT * FROM blogs WHERE slug = ${slug} AND published = true LIMIT 1`;
  return rows[0] ? {
    ...rows[0],
    createdAt: rows[0].createdat?.toISOString() || new Date().toISOString(),
    updatedAt: rows[0].updatedat?.toISOString() || new Date().toISOString(),
  } as Blog : null;
}

// Experiences CRUD
export async function getExperiences(): Promise<Experience[]> {
  const { rows } = await sql`
    SELECT * FROM experiences 
    ORDER BY current DESC, startDate DESC
  `;
  return rows.map(row => ({
    ...row,
    createdAt: row.createdat?.toISOString() || new Date().toISOString(),
    updatedAt: row.updatedat?.toISOString() || new Date().toISOString(),
  })) as Experience[];
}

export async function createExperience(data: Omit<Experience, 'id' | 'createdAt' | 'updatedAt'>): Promise<Experience> {
  const id = Date.now().toString();
  const now = new Date().toISOString();
  
  await sql`
    INSERT INTO experiences (id, title, company, location, startDate, endDate, current, description, responsibilities, createdAt, updatedAt)
    VALUES (${id}, ${data.title}, ${data.company}, ${data.location}, ${data.startDate}, ${data.endDate || null}, ${data.current}, ${data.description}, ${data.responsibilities}, ${now}, ${now})
  `;
  
  return { ...data, id, createdAt: now, updatedAt: now };
}

export async function updateExperience(id: string, data: Partial<Omit<Experience, 'id' | 'createdAt'>>): Promise<Experience | null> {
  const now = new Date().toISOString();
  
  const { rows } = await sql`
    UPDATE experiences 
    SET 
      title = COALESCE(${data.title || null}, title),
      company = COALESCE(${data.company || null}, company),
      location = COALESCE(${data.location || null}, location),
      startDate = COALESCE(${data.startDate || null}, startDate),
      endDate = COALESCE(${data.endDate || null}, endDate),
      current = COALESCE(${data.current !== undefined ? data.current : null}, current),
      description = COALESCE(${data.description || null}, description),
      responsibilities = COALESCE(${data.responsibilities || null}, responsibilities),
      updatedAt = ${now}
    WHERE id = ${id}
    RETURNING *
  `;
  
  return rows[0] ? {
    ...rows[0],
    createdAt: rows[0].createdat?.toISOString() || new Date().toISOString(),
    updatedAt: now,
  } as Experience : null;
}

export async function deleteExperience(id: string): Promise<boolean> {
  const { rowCount } = await sql`DELETE FROM experiences WHERE id = ${id}`;
  return (rowCount ?? 0) > 0;
}
