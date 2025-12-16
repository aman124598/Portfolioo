/**
 * Example: How to integrate admin panel data into your portfolio
 * 
 * This file shows example code for displaying projects and blogs
 * from the admin panel in your main portfolio website.
 */

// ============================================
// Example 1: Display Projects on Homepage
// ============================================

// File: app/page.tsx or app/projects/page.tsx
import { getProjects, getFeaturedProjects } from '@/lib/portfolio-data';

export default function ProjectsSection() {
  // Get all projects
  const allProjects = getProjects();
  
  // Or get only featured projects
  const featuredProjects = getFeaturedProjects();

  return (
    <section className="projects">
      <h2>My Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredProjects.map((project) => (
          <div key={project.id} className="project-card">
            {project.imageUrl && (
              <img src={project.imageUrl} alt={project.title} />
            )}
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            
            <div className="technologies">
              {project.technologies.map((tech, i) => (
                <span key={i} className="tech-badge">{tech}</span>
              ))}
            </div>
            
            <div className="links">
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  Live Demo
                </a>
              )}
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================
// Example 2: Display Blog Posts List
// ============================================

// File: app/blog/page.tsx
import { getPublishedBlogs } from '@/lib/portfolio-data';
import Link from 'next/link';

export default function BlogPage() {
  const blogs = getPublishedBlogs();

  return (
    <div className="blog-container">
      <h1>Blog</h1>
      <div className="blog-grid">
        {blogs.map((blog) => (
          <article key={blog.id} className="blog-card">
            {blog.coverImage && (
              <img src={blog.coverImage} alt={blog.title} />
            )}
            
            <div className="blog-content">
              <h2>{blog.title}</h2>
              <p className="excerpt">{blog.excerpt}</p>
              
              <div className="meta">
                <span>By {blog.author}</span>
                <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
              </div>
              
              <div className="tags">
                {blog.tags.map((tag, i) => (
                  <span key={i} className="tag">#{tag}</span>
                ))}
              </div>
              
              <Link href={`/blog/${blog.slug}`}>
                Read more →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

// ============================================
// Example 3: Individual Blog Post Page
// ============================================

// File: app/blog/[slug]/page.tsx
import { getBlogBySlug, getPublishedBlogs } from '@/lib/portfolio-data';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

export async function generateStaticParams() {
  const blogs = getPublishedBlogs();
  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const blog = getBlogBySlug(params.slug);

  if (!blog) {
    notFound();
  }

  return (
    <article className="blog-post">
      <header>
        {blog.coverImage && (
          <img src={blog.coverImage} alt={blog.title} className="cover-image" />
        )}
        <h1>{blog.title}</h1>
        <div className="meta">
          <span>By {blog.author}</span>
          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="tags">
          {blog.tags.map((tag, i) => (
            <span key={i} className="tag">#{tag}</span>
          ))}
        </div>
      </header>
      
      <div className="content">
        <ReactMarkdown>{blog.content}</ReactMarkdown>
      </div>
    </article>
  );
}

// ============================================
// Example 4: Filter Blogs by Tag
// ============================================

// File: app/blog/tag/[tag]/page.tsx
import { getBlogsByTag } from '@/lib/portfolio-data';
import Link from 'next/link';

export default function TagPage({ params }: { params: { tag: string } }) {
  const blogs = getBlogsByTag(params.tag);

  return (
    <div>
      <h1>Posts tagged with #{params.tag}</h1>
      {blogs.length === 0 ? (
        <p>No posts found with this tag.</p>
      ) : (
        <div className="blog-grid">
          {blogs.map((blog) => (
            <article key={blog.id}>
              <h2>{blog.title}</h2>
              <p>{blog.excerpt}</p>
              <Link href={`/blog/${blog.slug}`}>Read more →</Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================
// Example 5: Recent Projects Component
// ============================================

// File: components/RecentProjects.tsx
'use client';

import { getProjects } from '@/lib/portfolio-data';
import { useEffect, useState } from 'react';

export default function RecentProjects() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    // If you need to fetch projects client-side
    // (though it's better to do server-side in Next.js)
    fetch('/api/public/projects')
      .then(res => res.json())
      .then(data => setProjects(data.slice(0, 3)));
  }, []);

  return (
    <section>
      <h3>Recent Projects</h3>
      {projects.map((project) => (
        <div key={project.id}>
          <h4>{project.title}</h4>
          <p>{project.description}</p>
        </div>
      ))}
    </section>
  );
}

// ============================================
// Example 6: Public API Route (Optional)
// ============================================

// File: app/api/public/projects/route.ts
import { NextResponse } from 'next/server';
import { getProjects } from '@/lib/portfolio-data';

export async function GET() {
  const projects = getProjects();
  return NextResponse.json(projects);
}

// File: app/api/public/blogs/route.ts
import { NextResponse } from 'next/server';
import { getPublishedBlogs } from '@/lib/portfolio-data';

export async function GET() {
  const blogs = getPublishedBlogs();
  return NextResponse.json(blogs);
}

// ============================================
// Example 7: Search Functionality
// ============================================

// File: app/search/page.tsx
import { getPublishedBlogs } from '@/lib/portfolio-data';

export default function SearchPage({ searchParams }: { searchParams: { q: string } }) {
  const query = searchParams.q?.toLowerCase() || '';
  const blogs = getPublishedBlogs();
  
  const results = blogs.filter(blog => 
    blog.title.toLowerCase().includes(query) ||
    blog.excerpt.toLowerCase().includes(query) ||
    blog.tags.some(tag => tag.toLowerCase().includes(query))
  );

  return (
    <div>
      <h1>Search Results for "{query}"</h1>
      <p>{results.length} results found</p>
      {results.map(blog => (
        <article key={blog.id}>
          <h2>{blog.title}</h2>
          <p>{blog.excerpt}</p>
        </article>
      ))}
    </div>
  );
}

// ============================================
// Installation Note
// ============================================

/**
 * To use ReactMarkdown for rendering blog content:
 * 
 * npm install react-markdown
 * 
 * Then import and use as shown in Example 3 above.
 */

/**
 * These examples show different ways to integrate the admin panel
 * data into your main portfolio. Choose the approach that best fits
 * your needs and customize the styling to match your design.
 */
