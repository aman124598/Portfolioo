import React from "react"
import { getPublishedBlogs } from "@/lib/portfolio-data"
import BlogClient from "./BlogClient"

export default function BlogPage() {
  const blogs = getPublishedBlogs()

  return <BlogClient blogs={blogs} />
}
