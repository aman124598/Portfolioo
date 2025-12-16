import { getBlogs } from '@/lib/data';
import Link from 'next/link';
import DeleteButton from '@/components/DeleteButton';

export default function BlogsPage() {
  const blogs = getBlogs();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Blog Posts</h1>
        <Link
          href="/dashboard/blogs/new"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
        >
          Write New Post
        </Link>
      </div>

      {blogs.length === 0 ? (
        <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 text-center">
          <p className="text-gray-400">No blog posts yet. Write your first post!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-gray-800 p-6 rounded-lg border border-gray-700"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-white mb-2">
                    {blog.title}
                    <span
                      className={`ml-2 px-2 py-1 text-xs rounded ${
                        blog.published
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-600 text-gray-300'
                      }`}
                    >
                      {blog.published ? 'Published' : 'Draft'}
                    </span>
                  </h2>
                  <p className="text-gray-400 mb-3">{blog.excerpt}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {blog.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-blue-900 text-blue-300 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">
                    By {blog.author} | Slug: /{blog.slug}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Link
                    href={`/dashboard/blogs/${blog.id}/edit`}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                  >
                    Edit
                  </Link>
                  <DeleteButton id={blog.id} type="blog" itemName={blog.title} />
                </div>
              </div>
              <div className="mt-4 text-xs text-gray-500">
                Created: {new Date(blog.createdAt).toLocaleString()} | Updated:{' '}
                {new Date(blog.updatedAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
