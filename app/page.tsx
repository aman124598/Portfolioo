"use client"

import React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowUp,
  Download,
  Mail,
  Shield,
  MessageCircle,
  Linkedin,
  Github,
  MapPin,
  Code,
  Target,
  Users,
  Globe
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight"
import { TextGenerateEffect } from "@/components/ui/text-generate-effect"
import { Button as MovingButton } from "@/components/ui/moving-border"
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card"
import { SparklesCore } from "@/components/ui/sparkles"
import { TracingBeam } from "@/components/ui/tracing-beam"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import Link from "next/link"
import { CardStack } from "@/components/ui/card-stack"

export default function AmanPortfolio() {
  const [showScrollTop, setShowScrollTop] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Message sent!",
      description: "Thank you for reaching out. I'll get back to you soon!",
    })
  }

  const skillCategories = {
    Programming: ["C", "Python", "Java", "HTML", "CSS", "JavaScript"],
    "Frameworks & Tools": ["React", "Next.js", "Git", "Tailwind CSS", "Express.js", "MongoDB"],
    Cybersecurity: ["Penetration Testing", "Vulnerability Analysis", "Nmap", "Wireshark", "Burp Suite"],
    "Soft Skills": ["Communication", "Problem-Solving", "Creativity", "Cooperation"],
    Languages: ["English", "Hindi"],
  };

  const projects = [
    {
      title: "Placement Notifier System",
      description:
        "A comprehensive placement management system designed to streamline the recruitment process. It features automated email notifications, Excel data parsing for bulk student uploads, and intelligent filtering based on CGPA and skills. Built with Next.js for a responsive frontend and FastAPI for high-performance backend processing.",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000&auto=format&fit=crop",
      tech: ["Next.js", "FastAPI", "TypeScript", "Python"],
      github: "https://github.com/aman124598/placement_notifier.git",
      live: "#",
      featured: true,
    },
    {
      title: "Location Based Attendance System",
      description:
        "An intelligent attendance tracking solution that leverages geolocation technology to verify teacher presence. The system uses AI-powered validation to ensure authenticity and provides real-time location-based check-ins, eliminating manual registers and reducing proxy attendance.",
      image: "https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?q=80&w=1000&auto=format&fit=crop",
      tech: ["React", "Express.js", "MongoDB", "Gemini API"],
      github: "https://github.com/aman124598/attendence.git",
      live: "#",
      featured: true,
    },
    {
      title: "Water Delivery Ecommerce Platform",
      description:
        "A multi-vendor e-commerce platform revolutionizing water delivery. It features a unique ad-supported model allowing users to waive delivery fees. The platform supports real-time order tracking, vendor management, and a seamless checkout experience using Supabase for reliable data handling.",
      image: "https://images.unsplash.com/photo-1543165796-5426273eaab3?q=80&w=1000&auto=format&fit=crop",
      tech: ["React", "Supabase"],
      github: "https://github.com/aman124598/AquaFlow.git",
      live: "#",
      featured: true,
    },
  ];

  const projectCards = projects.map((project, index) => ({
    id: index,
    content: (
      <div className="flex flex-col h-full justify-between">
        <div>
            <img
                src={project.image}
                alt={project.title}
                className="h-40 w-full object-cover rounded-xl mb-4"
            />
            <h3 className="font-bold text-lg text-neutral-800 dark:text-neutral-200 mb-2">
                {project.title}
            </h3>
            <p className="text-neutral-600 dark:text-neutral-300 text-sm line-clamp-3">
                {project.description}
            </p>
        </div>
        <div className="mt-4">
            <div className="flex flex-wrap gap-2 mb-4">
                {project.tech.slice(0, 3).map(t => (
                    <Badge key={t} variant="secondary" className="text-[10px] px-1 py-0">{t}</Badge>
                ))}
                {project.tech.length > 3 && <Badge variant="secondary" className="text-[10px] px-1 py-0">+{project.tech.length - 3}</Badge>}
            </div>
            <div className="flex justify-between items-center">
                <a href={project.live} target="_blank" className="text-xs text-blue-500 hover:underline">Live Demo</a>
                <a href={project.github} target="_blank" className="text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-white">View Code</a>
            </div>
        </div>
      </div>
    )
  }))

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <Navbar />

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white dark:bg-black">
        <div className="absolute inset-0 w-full h-full bg-white dark:bg-black bg-grid-black/[0.2] dark:bg-grid-white/[0.2]">
            {/* Radial gradient for the container to give a faded look */}
            <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        </div>
        <div className="absolute inset-0 w-full h-full">
          <SparklesCore
            id="tsparticlesfullpage"
            background="transparent"
            minSize={1}
            maxSize={3}
            particleDensity={50}
            className="w-full h-full"
            particleColor="#888888"
            speed={2}
          />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: [20, -5, 0],
            }}
            transition={{
              duration: 0.5,
              ease: [0.4, 0.0, 0.2, 1],
            }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug mx-auto mb-8"
          >
            Hi, I'm <span className="font-calistoga text-blue-600 dark:text-blue-400">AMAN</span> <br />
            <span className="text-2xl md:text-4xl lg:text-5xl block mt-2">
              Web Developer & Cybersecurity Enthusiast
            </span>
          </motion.h1>
          
          <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <MovingButton
                borderRadius="1.75rem"
                className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
                onClick={() => window.open("/resume.pdf", "_blank")}
              >
                <Download className="mr-2 h-5 w-5" />
                Resume
              </MovingButton>
              <Button size="lg" variant="outline" onClick={() => scrollToSection("contact")} className="h-16 w-40 rounded-[1.75rem]">
                <Mail className="mr-2 h-5 w-5" />
                Contact Me
              </Button>
            </motion.div>
        </div>
      </section>

      <TracingBeam className="px-6">
        {/* About Section */}
        <section id="about" className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-4">About Me</h2>
              <TextGenerateEffect words="Passionate about technology, security, and building meaningful solutions" className="text-center text-gray-600 dark:text-gray-300 max-w-2xl mx-auto" />
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center md:text-left"
              >
                <div className="w-64 h-64 mx-auto md:mx-0 mb-8 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 via-purple-500 to-indigo-600 p-1">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-800">
                    <img
                      src="/profile.png"
                      alt="AMAN"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed text-justify">
                  I'm a Computer Science undergraduate based in Bangalore. I enjoy crafting real-world full-stack
                  applications with React, Express, and MongoDB—and I'm equally passionate about cybersecurity, ethical
                  hacking, and securing digital systems.
                </p>

                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed text-justify">
                  My journey combines the creativity of web development with the analytical mindset of cybersecurity,
                  allowing me to build applications that are not just functional, but also secure and robust.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm">Bangalore, India</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Code className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span className="text-sm">React, Tailwind, MongoDB</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <span className="text-sm">Cybersecurity Intern @ CFSS</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Mail className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                    <span className="text-sm break-all">amanraj89969@gmail.com</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-4">Skills & Expertise</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                A comprehensive toolkit for modern web development and cybersecurity
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(skillCategories).map(([category, skills], index) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        {category === "Programming" && <Code className="h-5 w-5 text-blue-600" />}
                        {category === "Frameworks & Tools" && <Target className="h-5 w-5 text-green-600" />}
                        {category === "Cybersecurity" && <Shield className="h-5 w-5 text-purple-600" />}
                        {category === "Soft Skills" && <Users className="h-5 w-5 text-orange-600" />}
                        {category === "Languages" && <Globe className="h-5 w-5 text-indigo-600" />}
                        <h3 className="font-semibold text-lg">{category}</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="text-sm hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-4">Featured Projects</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Real-world applications showcasing my technical skills and problem-solving approach
              </p>
            </motion.div>

            <div className="flex items-center justify-center w-full h-full py-10">
                <CardStack items={projectCards} />
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-4">Experience</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Professional experience in cybersecurity and hands-on learning
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <Shield className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                        <h3 className="font-semibold text-xl text-gray-900 dark:text-white">Cybersecurity Intern</h3>
                        <Badge variant="secondary" className="w-fit">
                          Mar 2024 – Apr 2024
                        </Badge>
                      </div>
                      <p className="text-blue-600 dark:text-blue-400 font-medium mb-3">
                        CFSS Cyber and Forensics Security Solutions, Bangalore
                      </p>
                      <div className="space-y-2 text-gray-600 dark:text-gray-300">
                        <p className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                          Performed vulnerability testing with tools like Nmap, Wireshark, and Burp Suite
                        </p>
                        <p className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                          Practiced ethical hacking and security assessment methodologies in real-world environments
                        </p>
                        <p className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                          Gained hands-on experience with penetration testing frameworks and security protocols
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Blog Preview Section */}
        <section id="thoughts" className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-4">Thoughts & Notes</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
                I write about web development, cybersecurity, and my learning journey.
              </p>
              <Link href="/blog">
                <Button size="lg" className="rounded-full">
                    Read My Blog
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-4">Get In Touch</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Have a project in mind or want to discuss cybersecurity? Let's connect!
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardContent className="p-8">
                    <form onSubmit={handleContactSubmit} className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-sm font-medium">
                            Name
                          </label>
                          <Input id="name" placeholder="John Doe" required />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="email" className="text-sm font-medium">
                            Email
                          </label>
                          <Input id="email" type="email" placeholder="john@example.com" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="subject" className="text-sm font-medium">
                          Subject
                        </label>
                        <Input id="subject" placeholder="Project Inquiry" required />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-medium">
                          Message
                        </label>
                        <Textarea id="message" placeholder="Tell me about your project..." className="min-h-[150px]" required />
                      </div>
                      <Button type="submit" className="w-full">
                        Send Message
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold font-playfair">Contact Information</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    I'm currently available for freelance work and internship opportunities.
                  </p>

                  <div className="space-y-4">
                    <a
                      href="mailto:amanraj89969@gmail.com"
                      className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                    >
                      <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center group-hover:bg-red-200 dark:group-hover:bg-red-900/40 transition-colors">
                        <Mail className="h-5 w-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">amanraj89969@gmail.com</p>
                      </div>
                    </a>

                    <a
                      href="https://www.linkedin.com/in/aman-83169b204/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                    >
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-900/40 transition-colors">
                        <Linkedin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium">LinkedIn</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Connect with me</p>
                      </div>
                    </a>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-blue-600" />
                    Quick Response
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    I typically respond to emails within 24 hours. For urgent matters or collaboration opportunities,
                    feel free to reach out on LinkedIn.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </TracingBeam>

      <Footer />

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-3 rounded-full shadow-lg z-50 transition-all duration-300"
          >
            <ArrowUp className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
