import { getProjectsAsync } from '@/lib/data';
import Link from 'next/link';
import DeleteButton from '@/components/DeleteButton';

// Force dynamic rendering to always fetch fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProjectsPage() {
  const projects = await getProjectsAsync();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Projects</h1>
        <Link
          href="/dashboard/projects/new"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
        >
          Add New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 text-center">
          <p className="text-gray-400">No projects yet. Create your first project!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-gray-800 p-6 rounded-lg border border-gray-700"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-white mb-2">
                    {project.title}
                    {project.featured && (
                      <span className="ml-2 px-2 py-1 text-xs bg-yellow-600 text-white rounded">
                        Featured
                      </span>
                    )}
                  </h2>
                  <p className="text-gray-400 mb-3">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4 text-sm text-gray-400">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-indigo-400"
                      >
                        Live Demo →
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-indigo-400"
                      >
                        GitHub →
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Link
                    href={`/dashboard/projects/${project.id}/edit`}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                  >
                    Edit
                  </Link>
                  <DeleteButton id={project.id} type="project" itemName={project.title} />
                </div>
              </div>
              <div className="mt-4 text-xs text-gray-500">
                Created: {new Date(project.createdAt).toLocaleString()} | Updated:{' '}
                {new Date(project.updatedAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

