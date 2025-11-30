export interface BlogPost {
  id: string
  title: string
  description: string
  content: string
  date: string
  author: string
  category: string
  readTime?: string
}

export const defaultPosts: BlogPost[] = [
  {
    id: "1",
    title: "The Art of Clean Code",
    description: "Why writing readable code is just as important as writing working code.",
    content: "Clean code is not just about formatting. It's about making your code understandable for others and your future self. In this post, we explore the principles of DRY, KISS, and SOLID, and how they apply to modern web development.",
    date: "2025-01-15",
    author: "Aman",
    category: "Development",
    readTime: "5 min read"
  },
  {
    id: "2",
    title: "Cybersecurity Trends 2025",
    description: "Emerging threats and how we can prepare for the future of digital security.",
    content: "As we move into 2025, the cybersecurity landscape is evolving rapidly. AI-driven attacks are becoming more common, and traditional defense mechanisms are being challenged. We discuss Zero Trust architecture and the importance of proactive security.",
    date: "2025-02-01",
    author: "Aman",
    category: "Cybersecurity",
    readTime: "8 min read"
  },
  {
    id: "3",
    title: "My Learning Journey",
    description: "Reflecting on the path from Hello World to Full Stack Development.",
    content: "It started with a simple HTML file. Then CSS. Then JavaScript. The journey has been long but rewarding. From struggling with flexbox to building complex full-stack applications with Next.js and MongoDB, here is my story.",
    date: "2025-03-10",
    author: "Aman",
    category: "Personal",
    readTime: "4 min read"
  }
]
