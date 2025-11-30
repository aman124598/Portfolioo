"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { BlogPost, defaultPosts } from "@/lib/blog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ManageBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [newPost, setNewPost] = useState({ 
    title: "", 
    description: "", 
    content: "",
    category: "Tech",
    readTime: "5 min read"
  })
  const { toast } = useToast()

  useEffect(() => {
    const storedPosts = localStorage.getItem("blogPosts")
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts))
    } else {
      setPosts(defaultPosts)
    }
  }, [])

  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPost.title || !newPost.content) return

    const post: BlogPost = {
      id: Date.now().toString(),
      title: newPost.title,
      description: newPost.description || newPost.content.slice(0, 100) + "...",
      content: newPost.content,
      date: new Date().toISOString().split('T')[0],
      author: "Aman",
      category: newPost.category,
      readTime: newPost.readTime
    }

    const updatedPosts = [post, ...posts]
    setPosts(updatedPosts)
    localStorage.setItem("blogPosts", JSON.stringify(updatedPosts))
    setNewPost({ 
      title: "", 
      description: "", 
      content: "",
      category: "Tech",
      readTime: "5 min read"
    })
    toast({ title: "Post created", description: "Your blog post has been published." })
  }

  const handleDeletePost = (id: string) => {
    const updatedPosts = posts.filter(p => p.id !== id)
    setPosts(updatedPosts)
    localStorage.setItem("blogPosts", JSON.stringify(updatedPosts))
    toast({ title: "Post deleted", description: "The blog post has been removed." })
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <Navbar />
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className="font-playfair text-4xl font-bold mb-8">Manage Blog Posts</h1>
        
        <div className="grid gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Create New Post</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAddPost} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium mb-1">Title</label>
                                <Input 
                                    value={newPost.title} 
                                    onChange={e => setNewPost({...newPost, title: e.target.value})}
                                    placeholder="Enter post title"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Category</label>
                                <Select 
                                    value={newPost.category} 
                                    onValueChange={value => setNewPost({...newPost, category: value})}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Tech">Tech</SelectItem>
                                        <SelectItem value="Design">Design</SelectItem>
                                        <SelectItem value="Life">Life</SelectItem>
                                        <SelectItem value="Tutorial">Tutorial</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Read Time</label>
                                <Input 
                                    value={newPost.readTime} 
                                    onChange={e => setNewPost({...newPost, readTime: e.target.value})}
                                    placeholder="e.g. 5 min read"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <Input 
                                    value={newPost.description} 
                                    onChange={e => setNewPost({...newPost, description: e.target.value})}
                                    placeholder="Short description (optional)"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Content</label>
                            <Textarea 
                                value={newPost.content} 
                                onChange={e => setNewPost({...newPost, content: e.target.value})}
                                placeholder="Write your thoughts..."
                                className="min-h-[200px]"
                            />
                        </div>
                        <Button type="submit">
                            <Plus className="mr-2 h-4 w-4" /> Publish Post
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Existing Posts</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {posts.map(post => (
                            <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-medium">{post.title}</h3>
                                        <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full text-gray-600 dark:text-gray-400">
                                            {post.category || "General"}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500">{post.date} • {post.readTime || "5 min read"}</p>
                                </div>
                                <Button variant="destructive" size="icon" onClick={() => handleDeletePost(post.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
