/**
 * Migration Script
 * 
 * This script helps you migrate existing blog data to the new admin panel format
 * Run this if you have existing blog posts that you want to import into the admin panel
 */

import fs from 'fs';
import path from 'path';

// Your existing blog posts (from lib/blog.ts)
const existingPosts = [
  {
    id: "1",
    title: "The Art of Clean Code",
    description: "Why writing readable code is just as important as working code.",
    content: "Clean code is not just about formatting. It's about making your code understandable for others and your future self. In this post, we explore the principles of DRY, KISS, and SOLID, and how they apply to modern web development.",
    date: "2025-01-15",
    author: "Aman",
    category: "Development",
    readTime: "5 min read"
  },
  {
    id: "2",
    title: "Cybersecurity Trends 2025",
    description: "Emerging threats and how we can prepare for the future of digital security.",
    content: "As we move into 2025, the cybersecurity landscape is evolving rapidly. AI-driven attacks are becoming more common, and traditional defense mechanisms are being challenged. We discuss Zero Trust architecture and the importance of proactive security.",
    date: "2025-02-01",
    author: "Aman",
    category: "Cybersecurity",
    readTime: "8 min read"
  },
  {
    id: "3",
    title: "My Learning Journey",
    description: "Reflecting on the path from Hello World to Full Stack Development.",
    content: "It started with a simple HTML file. Then CSS. Then JavaScript. The journey has been long but rewarding. From struggling with flexbox to building complex full-stack applications with Next.js and MongoDB, here is my story.",
    date: "2025-03-10",
    author: "Aman",
    category: "Personal",
    readTime: "4 min read"
  }
];

// Convert to new format
const migratedBlogs = existingPosts.map((post) => ({
  id: post.id,
  title: post.title,
  slug: post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
  excerpt: post.description,
  content: post.content,
  author: post.author,
  tags: [post.category.toLowerCase()],
  coverImage: '',
  published: true,
  createdAt: new Date(post.date).toISOString(),
  updatedAt: new Date(post.date).toISOString(),
}));

// Write to data file
const dataDir = path.join(process.cwd(), 'data');
const blogsFile = path.join(dataDir, 'blogs.json');

// Ensure directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Read existing blogs if any
let existingBlogs = [];
if (fs.existsSync(blogsFile)) {
  const data = fs.readFileSync(blogsFile, 'utf-8');
  existingBlogs = JSON.parse(data);
}

// Merge (avoid duplicates)
const allBlogs = [...existingBlogs];
migratedBlogs.forEach(newBlog => {
  const exists = allBlogs.find(b => b.id === newBlog.id);
  if (!exists) {
    allBlogs.push(newBlog);
  }
});

// Write back
fs.writeFileSync(blogsFile, JSON.stringify(allBlogs, null, 2));

console.log(`✅ Migrated ${migratedBlogs.length} blog posts`);
console.log(`📁 Total blogs in database: ${allBlogs.length}`);
console.log(`📝 File: ${blogsFile}`);

/**
 * To run this script:
 * 
 * 1. Save your existing blog posts in this file
 * 2. Run: npx ts-node migrate-blogs.ts
 * 3. Check the data/blogs.json file
 */
