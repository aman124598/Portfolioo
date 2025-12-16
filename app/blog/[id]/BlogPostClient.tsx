"use client"

import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Blog } from "@/lib/portfolio-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Clock, Calendar, User, Tag, Share2, BookOpen } from "lucide-react"
import { motion } from "framer-motion"

interface BlogPostClientProps {
  blog: Blog
  relatedPosts: Blog[]
}

export default function BlogPostClient({ blog, relatedPosts }: BlogPostClientProps) {
  // Calculate read time (approx 200 words per minute)
  const calculateReadTime = (content: string) => {
    const words = content.split(/\s+/).length
    const minutes = Math.ceil(words / 200)
    return `${minutes} min read`
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-black text-gray-900 dark:text-white">
      <Navbar />
      
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="max-w-4xl mx-auto mb-8">
          <Link href="/blog">
            <Button variant="ghost" className="pl-0 hover:pl-2 transition-all group">
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> 
              Back to All Articles
            </Button>
          </Link>
        </div>

        {/* Hero Image */}
        {blog.coverImage && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto mb-12"
          >
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={blog.coverImage} 
                alt={blog.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </div>
          </motion.div>
        )}

        <article className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {blog.tags.map(tag => (
                <Badge 
                  key={tag} 
                  variant="secondary" 
                  className="text-sm py-1.5 px-4 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                >
                  <Tag className="w-3 h-3 mr-2" />
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Title */}
            <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              {blog.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed border-l-4 border-blue-500 pl-6 italic">
              {blog.excerpt}
            </p>
            
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-gray-500 dark:text-gray-400 mb-10 pb-8 border-b-2 border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white font-bold">
                  {blog.author.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                    <User className="w-4 h-4" />
                    {blog.author}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">{formatDate(blog.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{calculateReadTime(blog.content)}</span>
              </div>
              <Button variant="outline" size="sm" className="ml-auto">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>

            {/* Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none mb-16">
              <div className="text-lg leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                {blog.content}
              </div>
            </div>

            {/* Footer - Tags and Author */}
            <div className="border-t-2 border-gray-200 dark:border-gray-800 pt-8 mt-12">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                    {blog.author.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{blog.author}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Published on {formatDate(blog.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-20 pt-12 border-t-2 border-gray-200 dark:border-gray-800"
            >
              <h2 className="font-playfair text-3xl font-bold mb-8 flex items-center gap-3">
                <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                Related Articles
              </h2>
              <div className="grid gap-6 md:grid-cols-3">
                {relatedPosts.map(post => (
                  <Link href={`/blog/${post.slug}`} key={post.id}>
                    <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group border-2 hover:border-blue-500 dark:hover:border-blue-400">
                      {post.coverImage && (
                        <div className="relative h-40 overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30">
                          <img 
                            src={post.coverImage} 
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {post.tags.slice(0, 2).map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <h3 className="font-semibold line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {post.title}
                        </h3>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          {formatDate(post.createdAt)}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </article>
      </main>

      <Footer />
    </div>
  )
}
