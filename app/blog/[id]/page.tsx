"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { BlogPost, defaultPosts } from "@/lib/blog"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Clock, Calendar, User, Tag } from "lucide-react"

export default function BlogPostPage() {
  const { id } = useParams()
  const [post, setPost] = useState<BlogPost | null>(null)

  useEffect(() => {
    const storedPosts = localStorage.getItem("blogPosts")
    const posts = storedPosts ? JSON.parse(storedPosts) : defaultPosts
    const foundPost = posts.find((p: BlogPost) => p.id === id)
    setPost(foundPost || null)
  }, [id])

  if (!post) {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
            <Navbar />
            <div className="pt-32 text-center">Loading or Post not found...</div>
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <Navbar />
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <Link href="/blog">
            <Button variant="ghost" className="mb-8 pl-0 hover:pl-2 transition-all">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
            </Button>
        </Link>
        
        <article className="prose dark:prose-invert max-w-none">
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge variant="secondary" className="text-sm py-1 px-3">
                <Tag className="w-3 h-3 mr-2" />
                {post.category || "General"}
              </Badge>
              <Badge variant="outline" className="text-sm py-1 px-3">
                <Clock className="w-3 h-3 mr-2" />
                {post.readTime || "5 min read"}
              </Badge>
            </div>

            <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-6 leading-tight">{post.title}</h1>
            
            <div className="flex items-center gap-6 text-gray-500 dark:text-gray-400 mb-10 border-b border-gray-200 dark:border-gray-800 pb-8">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{post.author}</span>
                </div>
            </div>

            <div className="whitespace-pre-wrap text-lg leading-relaxed text-gray-800 dark:text-gray-200">
                {post.content}
            </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}
