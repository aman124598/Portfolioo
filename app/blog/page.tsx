"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { BlogPost, defaultPosts } from "@/lib/blog"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  useEffect(() => {
    const storedPosts = localStorage.getItem("blogPosts")
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts))
      setFilteredPosts(JSON.parse(storedPosts))
    } else {
      setPosts(defaultPosts)
      setFilteredPosts(defaultPosts)
      localStorage.setItem("blogPosts", JSON.stringify(defaultPosts))
    }
  }, [])

  useEffect(() => {
    let result = posts
    if (searchQuery) {
      result = result.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    if (selectedCategory !== "All") {
      result = result.filter(post => post.category === selectedCategory)
    }
    setFilteredPosts(result)
  }, [searchQuery, selectedCategory, posts])

  const categories = ["All", ...Array.from(new Set(posts.map(post => post.category || "General")))]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <Navbar />
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
              <div>
                <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-2">Blog</h1>
                <p className="text-gray-600 dark:text-gray-400">Thoughts, tutorials, and insights.</p>
              </div>
              <Link href="/blog/manage">
                  <Button>Manage Posts</Button>
              </Link>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Search posts..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category)}
                    className="whitespace-nowrap"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
                <Link href={`/blog/${post.id}`} key={post.id}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="secondary">{post.category || "General"}</Badge>
                        <span className="text-xs text-gray-500">{post.readTime || "5 min read"}</span>
                      </div>
                      <CardTitle className="font-playfair text-xl line-clamp-2">{post.title}</CardTitle>
                      <CardDescription>{post.date}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                          {post.description}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <span className="text-blue-600 dark:text-blue-400 text-sm font-medium group-hover:underline">
                        Read more →
                      </span>
                    </CardFooter>
                </Card>
                </Link>
            ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-20 text-gray-500">
                No posts found matching your criteria.
              </div>
            )}
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}
