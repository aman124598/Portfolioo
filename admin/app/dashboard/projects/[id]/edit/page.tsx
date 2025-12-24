'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';

interface ProjectFormData {
  title: string;
  description: string;
  technologies: string;
  imageUrl: string;
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
}

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    technologies: '',
    imageUrl: '',
    liveUrl: '',
    githubUrl: '',
    featured: false,
  });

  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then(res => res.json())
      .then(data => {
        setFormData({
          title: data.title,
          description: data.description,
          technologies: data.technologies.join(', '),
          imageUrl: data.imageUrl || '',
          liveUrl: data.liveUrl || '',
          githubUrl: data.githubUrl || '',
          featured: data.featured,
        });
        setFetching(false);
      })
      .catch(() => {
        alert('Failed to load project');
        router.push('/dashboard/projects');
      });
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean),
        }),
      });

      if (res.ok) {
        router.push('/dashboard/projects');
        router.refresh();
      } else {
        alert('Failed to update project');
        setLoading(false);
      }
    } catch (error) {
      alert('An error occurred');
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Edit Project</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              required
              rows={4}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Technologies (comma-separated) *
            </label>
            <input
              type="text"
              required
              placeholder="React, TypeScript, Next.js"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.technologies}
              onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Image URL
            </label>
            <input
              type="url"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Live URL
            </label>
            <input
              type="url"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.liveUrl}
              onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              GitHub URL
            </label>
            <input
              type="url"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.githubUrl}
              onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              className="w-4 h-4 text-indigo-600 bg-gray-800 border-gray-700 rounded focus:ring-indigo-500"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            />
            <label htmlFor="featured" className="ml-2 text-sm text-gray-300">
              Mark as featured project
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Project'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
