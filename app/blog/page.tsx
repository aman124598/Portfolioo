import React from "react"
import { getPublishedBlogs } from "@/lib/portfolio-data"
import BlogClient from "./BlogClient"

export default async function BlogPage() {
  const blogs = await getPublishedBlogs()

  return <BlogClient blogs={blogs} />
}
