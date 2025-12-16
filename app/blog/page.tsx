import React from "react"
import { getPublishedBlogs } from "@/lib/portfolio-data"
import BlogClient from "./BlogClient"

// Force dynamic rendering to always fetch fresh data
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function BlogPage() {
  const blogs = await getPublishedBlogs()

  return <BlogClient blogs={blogs} />
}
