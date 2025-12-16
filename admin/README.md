# Portfolio Admin Panel

A separate admin panel for managing your portfolio projects and blog posts.

## Features

- 🔐 Secure authentication
- 📝 Blog post management (create, edit, delete, publish/unpublish)
- 💼 Project management (create, edit, delete, feature)
- 📊 Dashboard with analytics
- 🎨 Dark mode UI
- 💾 JSON-based storage (shared with main portfolio)

## Getting Started

### Installation

```bash
cd admin
npm install
```

### Configuration

1. Copy the `.env.local` file and update the values:

```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
DATA_DIR=../data
```

⚠️ **Important**: Change the default credentials before deploying to production!

### Development

```bash
npm run dev
```

Visit [http://localhost:3001](http://localhost:3001) and login with your credentials.

### Production Build

```bash
npm run build
npm start
```

## Deployment to Render

1. Push your code to a Git repository
2. Create a new Web Service on [Render](https://render.com)
3. Connect your repository
4. Configure the service:
   - **Build Command**: `cd admin && npm install && npm run build`
   - **Start Command**: `cd admin && npm start`
   - **Environment Variables**:
     - `JWT_SECRET`: Your secret key
     - `ADMIN_USERNAME`: Your admin username
     - `ADMIN_PASSWORD`: Your admin password
     - `NODE_ENV`: `production`

## Project Structure

```
admin/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   └── login/             # Login page
├── components/            # React components
├── lib/                   # Utility functions
│   ├── auth.ts           # Authentication logic
│   └── data.ts           # Data management
└── public/               # Static assets

data/                      # Shared data directory
├── projects.json         # Projects data
└── blogs.json            # Blog posts data
```

## Data Storage

The admin panel uses JSON files stored in the `../data` directory, which is shared with your main portfolio. This allows your portfolio to read the projects and blog posts created through the admin panel.

### Projects Schema

```typescript
{
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
```

### Blog Posts Schema

```typescript
{
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;  // Markdown format
  author: string;
  tags: string[];
  coverImage?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}
```

## Using Data in Main Portfolio

You can read the data in your main portfolio using the same data functions:

```typescript
import { getProjects, getBlogs } from '../data/lib';

// Get all projects
const projects = getProjects();

// Get published blogs only
const blogs = getBlogs().filter(blog => blog.published);
```

## Security

- Authentication uses JWT tokens stored in HTTP-only cookies
- Passwords are hashed using bcrypt
- All data-modifying operations require authentication
- Remember to change default credentials in production

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- JWT for authentication
- JSON file storage

## License

MIT
