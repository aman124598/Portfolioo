import { getProjects, getBlogs } from '@/lib/data';
import StatsCard from '@/components/StatsCard';

export default function DashboardPage() {
  const projects = getProjects();
  const blogs = getBlogs();
  const publishedBlogs = blogs.filter(b => b.published);
  const featuredProjects = projects.filter(p => p.featured);

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard title="Total Projects" value={projects.length} icon="📁" />
        <StatsCard title="Featured Projects" value={featuredProjects.length} icon="⭐" />
        <StatsCard title="Published Blogs" value={publishedBlogs.length} icon="📝" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Projects</h2>
          {projects.length === 0 ? (
            <p className="text-gray-400">No projects yet. Create your first project!</p>
          ) : (
            <ul className="space-y-3">
              {projects.slice(0, 5).map((project) => (
                <li key={project.id} className="text-gray-300">
                  <div className="flex justify-between items-center">
                    <span>{project.title}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Blogs</h2>
          {blogs.length === 0 ? (
            <p className="text-gray-400">No blog posts yet. Write your first post!</p>
          ) : (
            <ul className="space-y-3">
              {blogs.slice(0, 5).map((blog) => (
                <li key={blog.id} className="text-gray-300">
                  <div className="flex justify-between items-center">
                    <span>{blog.title}</span>
                    <span className="text-xs text-gray-500">
                      {blog.published ? '✓ Published' : '○ Draft'}
                    </span>
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
