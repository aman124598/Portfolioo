import React from "react"
import { getBlogBySlug, getPublishedBlogs } from "@/lib/portfolio-data"
import { notFound } from "next/navigation"
import BlogPostClient from "./BlogPostClient"

export async function generateStaticParams() {
  const blogs = getPublishedBlogs()
  return blogs.map((blog) => ({
    id: blog.slug,
  }))
}

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const blog = getBlogBySlug(params.id)

  if (!blog) {
    notFound()
  }

  // Get related posts (same tags, exclude current)
  const allBlogs = getPublishedBlogs()
  const relatedPosts = allBlogs
    .filter(b => b.id !== blog.id && b.tags.some(tag => blog.tags.includes(tag)))
    .slice(0, 3)

  return <BlogPostClient blog={blog} relatedPosts={relatedPosts} />
}
