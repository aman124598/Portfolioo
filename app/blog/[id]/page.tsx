import React from "react"
import { getBlogBySlug, getPublishedBlogs } from "@/lib/portfolio-data"
import { notFound } from "next/navigation"
import BlogPostClient from "./BlogPostClient"

// Force dynamic rendering to always fetch fresh data
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateStaticParams() {
  const blogs = await getPublishedBlogs()
  return blogs.map((blog) => ({
    id: blog.slug,
  }))
}

export default async function BlogPostPage({ params }: { params: { id: string } }) {
  const blog = await getBlogBySlug(params.id)

  if (!blog) {
    notFound()
  }

  // Get related posts (same tags, exclude current)
  const allBlogs = await getPublishedBlogs()
  const relatedPosts = allBlogs
    .filter(b => b.id !== blog.id && b.tags.some(tag => blog.tags.includes(tag)))
    .slice(0, 3)

  return <BlogPostClient blog={blog} relatedPosts={relatedPosts} />
}
