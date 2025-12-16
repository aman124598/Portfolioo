# 🎨 Portfolio Project

A modern portfolio website with a separate admin panel for content management.

## 📁 Project Structure

```
Portfolioo/
├── admin/                    # Admin Panel (Separate Next.js App)
│   └── Port 3001
├── app/                      # Main Portfolio Website
│   └── Port 3000 (default)
├── data/                     # Shared Data Storage
│   ├── projects.json
│   └── blogs.json
└── lib/                      # Shared Utilities
```

## 🚀 Quick Start

### Main Portfolio
```bash
npm install
npm run dev
# Visit: http://localhost:3000
```

### Admin Panel
```bash
cd admin
npm install
npm run dev
# Visit: http://localhost:3001
```

## 📚 Documentation

- **[ADMIN_COMPLETE.md](./ADMIN_COMPLETE.md)** - Complete admin panel overview
- **[ADMIN_SETUP.md](./ADMIN_SETUP.md)** - Quick start guide for admin panel
- **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** - Production deployment guide
- **[INTEGRATION_EXAMPLES.tsx](./INTEGRATION_EXAMPLES.tsx)** - Code examples for using admin data
- **[admin/README.md](./admin/README.md)** - Admin panel technical docs

## ✨ Features

### Main Portfolio
- 🎨 Modern UI with Tailwind CSS
- 📱 Responsive design
- 🌓 Dark/Light mode
- 📝 Dynamic blog from admin panel
- 💼 Dynamic projects from admin panel

### Admin Panel
- 🔐 Secure authentication
- 📊 Analytics dashboard
- 📝 Blog post management (Markdown support)
- 💼 Project management
- 🎯 Draft/Publish workflow
- ⭐ Featured projects highlighting

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: JWT + bcrypt
- **Storage**: JSON files (upgradeable to database)

## 📖 How It Works

1. **Admin Panel**: Manage content at http://localhost:3001
   - Add/edit projects
   - Write blog posts in Markdown
   - Publish or save as drafts

2. **Data Storage**: Content saved to `/data` folder
   - `projects.json` stores all projects
   - `blogs.json` stores all blog posts

3. **Main Portfolio**: Reads data from `/data` folder
   - Display published blogs
   - Show featured projects
   - Dynamic content updates

## 🔗 Integration

Use the helper library in your portfolio:

```typescript
import { getPublishedBlogs, getFeaturedProjects } from '@/lib/portfolio-data';

// Get data
const blogs = getPublishedBlogs();
const projects = getFeaturedProjects();
```

See [INTEGRATION_EXAMPLES.tsx](./INTEGRATION_EXAMPLES.tsx) for complete examples.

## 🚀 Deployment

### Deploy Admin Panel (Render)
1. Push code to GitHub
2. Connect to Render
3. Set root directory: `admin`
4. Add environment variables
5. Deploy!

See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) for detailed steps.

### Deploy Main Portfolio (Vercel/Netlify/Render)
Deploy as a standard Next.js application.

## 🔐 Security

- Passwords hashed with bcrypt
- JWT tokens in HTTP-only cookies
- Environment variables for secrets
- Authentication required for all write operations

## 📝 Default Credentials

⚠️ **IMPORTANT**: Change these before deploying!

```
Username: admin
Password: admin123
```

Edit `admin/.env.local` to change.

## 🎯 Getting Started Checklist

- [ ] Install dependencies: `npm install`
- [ ] Install admin dependencies: `cd admin && npm install`
- [ ] Configure admin: Edit `admin/.env.local`
- [ ] Start main portfolio: `npm run dev`
- [ ] Start admin panel: `cd admin && npm run dev`
- [ ] Login to admin panel
- [ ] Create your first project
- [ ] Write your first blog post
- [ ] Integrate data into portfolio

## 📦 Scripts

### Main Portfolio
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Admin Panel
```bash
cd admin
npm run dev      # Start on port 3001
npm run build    # Build for production
npm run start    # Start production server
```

## 🤝 Contributing

This is a personal portfolio project. Feel free to fork and customize!

## 📄 License

MIT License - feel free to use for your own portfolio!

---

**Need Help?** Check the documentation files or review the code comments.

**Happy Building!** 🚀
