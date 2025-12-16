"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Blog } from "@/lib/portfolio-data"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Search, Calendar, Clock, Tag, BookOpen, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"

interface BlogClientProps {
  blogs: Blog[]
}

export default function BlogClient({ blogs }: BlogClientProps) {
  const [filteredBlogs, setFilteredBlogs] = useState(blogs)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState("All")

  // Get all unique tags
  const allTags = ["All", ...Array.from(new Set(blogs.flatMap(blog => blog.tags)))]

  useEffect(() => {
    let result = blogs
    
    if (searchQuery) {
      result = result.filter(blog => 
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    if (selectedTag !== "All") {
      result = result.filter(blog => blog.tags.includes(selectedTag))
    }
    
    setFilteredBlogs(result)
  }, [searchQuery, selectedTag, blogs])

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
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full mb-6">
            <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              {blogs.length} {blogs.length === 1 ? 'Article' : 'Articles'} Published
            </span>
          </div>
          
          <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Blog & Insights
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Exploring web development, cybersecurity, and everything in between. 
            Sharing knowledge, experiences, and lessons learned along the way.
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input 
                placeholder="Search articles by title, content, or keywords..." 
                className="pl-12 h-14 text-lg border-2 focus:border-blue-500 dark:focus:border-blue-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Tags Filter */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            <Tag className="h-4 w-4 text-gray-500 flex-shrink-0" />
            {allTags.map(tag => (
              <Button
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                onClick={() => setSelectedTag(tag)}
                size="sm"
                className="whitespace-nowrap rounded-full"
              >
                {tag}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Blog Grid */}
        {filteredBlogs.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredBlogs.map((blog, index) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/blog/${blog.slug}`}>
                  <Card className="h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group overflow-hidden border-2 hover:border-blue-500 dark:hover:border-blue-400">
                    {/* Cover Image */}
                    {blog.coverImage && (
                      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30">
                        <img 
                          src={blog.coverImage} 
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </div>
                    )}
                    
                    <CardHeader className="space-y-4">
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {blog.tags.slice(0, 3).map(tag => (
                          <Badge 
                            key={tag} 
                            variant="secondary" 
                            className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {blog.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{blog.tags.length - 3}
                          </Badge>
                        )}
                      </div>

                      {/* Title */}
                      <h2 className="font-playfair text-2xl font-bold line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {blog.title}
                      </h2>

                      {/* Meta Info */}
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(blog.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          <span>{calculateReadTime(blog.content)}</span>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      {/* Excerpt */}
                      <p className="text-gray-600 dark:text-gray-300 line-clamp-3 mb-4 leading-relaxed">
                        {blog.excerpt}
                      </p>

                      {/* Author */}
                      <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                          {blog.author.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{blog.author}</p>
                        </div>
                        <div className="text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                          <BookOpen className="h-5 w-5" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No articles found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {searchQuery || selectedTag !== "All" 
                ? "Try adjusting your search or filter criteria" 
                : "No blog posts have been published yet. Check back soon!"}
            </p>
            {(searchQuery || selectedTag !== "All") && (
              <Button 
                onClick={() => {
                  setSearchQuery("")
                  setSelectedTag("All")
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            )}
          </motion.div>
        )}
      </section>

      <Footer />
    </div>
  )
}
