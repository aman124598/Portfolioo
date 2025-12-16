'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewBlogPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: '',
    tags: '',
    coverImage: '',
    published: false,
  });

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: formData.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        }),
      });

      if (res.ok) {
        router.push('/dashboard/blogs');
        router.refresh();
      } else {
        alert('Failed to create blog post');
        setLoading(false);
      }
    } catch (error) {
      alert('An error occurred');
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Write New Blog Post</h1>

      <form onSubmit={handleSubmit} className="max-w-3xl">
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
              onChange={(e) => handleTitleChange(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Slug *
            </label>
            <input
              type="text"
              required
              placeholder="my-blog-post"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            />
            <p className="mt-1 text-xs text-gray-500">
              URL-friendly version of the title
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Excerpt *
            </label>
            <textarea
              required
              rows={3}
              placeholder="A brief summary of your blog post..."
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Content * (Markdown supported)
            </label>
            <textarea
              required
              rows={15}
              placeholder="Write your blog post content here using Markdown..."
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Author *
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              placeholder="javascript, react, tutorial"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Cover Image URL
            </label>
            <input
              type="url"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.coverImage}
              onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="published"
              className="w-4 h-4 text-indigo-600 bg-gray-800 border-gray-700 rounded focus:ring-indigo-500"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
            />
            <label htmlFor="published" className="ml-2 text-sm text-gray-300">
              Publish immediately
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Blog Post'}
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
