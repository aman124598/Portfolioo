# Portfolio Admin Panel - Quick Start Guide

## 🚀 Setup Instructions

### 1. Install Dependencies
```bash
cd admin
npm install
```

### 2. Configure Environment Variables

Edit the `.env.local` file in the `admin` folder:

```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

⚠️ **IMPORTANT**: Change these default credentials before deploying!

### 3. Start the Admin Panel

```bash
npm run dev
```

The admin panel will be available at: http://localhost:3001

### 4. Login

Use the credentials you set in `.env.local`:
- **Username**: admin (or your custom username)
- **Password**: admin123 (or your custom password)

---

## 📁 What's Created

### Admin Panel (`/admin` folder)
A complete Next.js application with:
- ✅ Authentication system
- ✅ Dashboard with statistics
- ✅ Project management (add, edit, delete)
- ✅ Blog management (write, edit, publish, delete)
- ✅ Dark mode UI
- ✅ Responsive design

### Shared Data (`/data` folder)
- `projects.json` - All your projects
- `blogs.json` - All your blog posts

Both your admin panel and main portfolio read from these files.

### Main Portfolio Integration
- `lib/portfolio-data.ts` - Helper functions to read projects and blogs in your main portfolio

---

## 📖 Using Data in Your Main Portfolio

### In your pages or components:

```typescript
import { getPublishedBlogs, getFeaturedProjects } from '@/lib/portfolio-data';

// Get all published blog posts
const blogs = getPublishedBlogs();

// Get featured projects
const projects = getFeaturedProjects();

// Get a specific blog by slug
const blog = getBlogBySlug('my-first-post');
```

### Example: Update your blog page

```typescript
// app/blog/page.tsx
import { getPublishedBlogs } from '@/lib/portfolio-data';

export default function BlogPage() {
  const blogs = getPublishedBlogs();
  
  return (
    <div>
      {blogs.map(blog => (
        <article key={blog.id}>
          <h2>{blog.title}</h2>
          <p>{blog.excerpt}</p>
          <a href={`/blog/${blog.slug}`}>Read more →</a>
        </article>
      ))}
    </div>
  );
}
```

---

## 🚀 Deploying to Render

1. **Push your code to GitHub/GitLab**

2. **Create a new Web Service on Render**
   - Go to https://render.com
   - Click "New +" → "Web Service"
   - Connect your repository

3. **Configure the service**:
   - **Root Directory**: `admin`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

4. **Add Environment Variables**:
   - `JWT_SECRET`: Your secret key (use a strong random string)
   - `ADMIN_USERNAME`: Your admin username
   - `ADMIN_PASSWORD`: Your admin password
   - `NODE_ENV`: `production`

5. **Deploy!**

---

## 🔧 Troubleshooting

### "Failed to fetch projects/blogs"
- Make sure the `/data` folder exists
- Check that `projects.json` and `blogs.json` exist and contain valid JSON

### "Unauthorized" errors
- Check your `.env.local` file has correct credentials
- Make sure you're logged in (visit `/login`)
- Try clearing cookies and logging in again

### Port already in use
The admin panel runs on port 3001 by default. If you need to change it:
```bash
# In package.json, modify:
"dev": "next dev -p YOUR_PORT"
```

---

## 📝 Features Overview

### Dashboard
- Total projects count
- Total blogs count  
- Published blogs count
- Recent projects and blogs

### Project Management
- Add new projects with title, description, technologies
- Upload project images
- Add live demo and GitHub links
- Mark projects as "featured"
- Edit and delete projects

### Blog Management
- Write blog posts in Markdown
- Auto-generate slugs from titles
- Add tags and categories
- Upload cover images
- Save as draft or publish immediately
- Edit and delete posts

---

## 🎯 Next Steps

1. **Customize the admin panel**: Modify colors, add more fields, etc.
2. **Update your portfolio**: Use the data functions to display projects and blogs
3. **Add more features**: Image upload, comments, analytics, etc.
4. **Deploy**: Host on Render, Vercel, or any Node.js hosting platform

---

## 📧 Support

If you encounter any issues, check:
1. Console logs in the browser (F12)
2. Terminal output where the dev server is running
3. File permissions on the `/data` folder

Happy blogging! 🎉
