import { getProjects, getBlogs } from '@/lib/data';
import { getExperiences } from '@/lib/portfolio-data';
import StatsCard from '@/components/StatsCard';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function DashboardPage() {
  const projects = getProjects();
  const blogs = getBlogs();
  const experiences = getExperiences();
  const publishedBlogs = blogs.filter(b => b.published);
  const featuredProjects = projects.filter(p => p.featured);
  const currentExperiences = experiences.filter(e => e.current);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard title="Total Projects" value={projects.length} icon="📁" />
        <StatsCard title="Published Blogs" value={publishedBlogs.length} icon="📝" />
        <StatsCard title="Experiences" value={experiences.length} icon="💼" />
        <StatsCard title="Current Jobs" value={currentExperiences.length} icon="⚡" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Projects</h2>
            <Link href="/dashboard/projects/new">
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </Link>
          </div>
          {projects.length === 0 ? (
            <p className="text-gray-400">No projects yet. Create your first project!</p>
          ) : (
            <ul className="space-y-3">
              {projects.slice(0, 5).map((project) => (
                <li key={project.id} className="text-gray-600 dark:text-gray-300">
                  <div className="flex justify-between items-center">
                    <span className="truncate">{project.title}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Blogs</h2>
            <Link href="/dashboard/blogs/new">
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </Link>
          </div>
          {blogs.length === 0 ? (
            <p className="text-gray-400">No blog posts yet. Write your first post!</p>
          ) : (
            <ul className="space-y-3">
              {blogs.slice(0, 5).map((blog) => (
                <li key={blog.id} className="text-gray-600 dark:text-gray-300">
                  <div className="flex justify-between items-center">
                    <span className="truncate">{blog.title}</span>
                    <span className="text-xs text-gray-500">
                      {blog.published ? '✓ Published' : '○ Draft'}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Experiences</h2>
            <Link href="/dashboard/experiences">
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </Link>
          </div>
          {experiences.length === 0 ? (
            <p className="text-gray-400">No experiences yet. Add your work history!</p>
          ) : (
            <ul className="space-y-3">
              {experiences.slice(0, 5).map((exp) => (
                <li key={exp.id} className="text-gray-600 dark:text-gray-300">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <span className="truncate block font-medium">{exp.title}</span>
                      <span className="text-xs text-gray-500 truncate block">{exp.company}</span>
                    </div>
                    {exp.current && (
                      <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded ml-2 flex-shrink-0">
                        Current
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
