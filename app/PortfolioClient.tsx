"use client"

import React, { useState, useEffect, useRef } from "react"
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
  Globe,
  Twitter,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { TextGenerateEffect } from "@/components/ui/text-generate-effect"
import { Button as MovingButton } from "@/components/ui/moving-border"
import { SparklesCore } from "@/components/ui/sparkles"
import { TracingBeam } from "@/components/ui/tracing-beam"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import Link from "next/link"

interface ProjectProps {
  title: string;
  description: string;
  image: string;
  tech: string[];
  github: string;
  live: string;
  featured: boolean;
}

interface Experience {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  responsibilities: string[];
}

export default function PortfolioClient({ projects, experiences }: { projects: ProjectProps[], experiences: Experience[] }) {
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const { toast } = useToast()
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Auto-scroll functionality
  useEffect(() => {
    if (isAutoPlaying && projects.length > 0) {
      autoPlayRef.current = setInterval(() => {
        setCurrentProjectIndex((prev) => (prev + 1) % projects.length)
      }, 4000) // Change slide every 4 seconds
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [isAutoPlaying, projects.length])

  const nextProject = () => {
    setIsAutoPlaying(false)
    setCurrentProjectIndex((prev) => (prev + 1) % projects.length)
  }

  const prevProject = () => {
    setIsAutoPlaying(false)
    setCurrentProjectIndex((prev) => (prev - 1 + projects.length) % projects.length)
  }

  const goToProject = (index: number) => {
    setIsAutoPlaying(false)
    setCurrentProjectIndex(index)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const skillCategories = {
    Programming: ["C", "Python", "Java", "HTML", "CSS", "JavaScript"],
    "Frameworks & Tools": ["React", "Next.js", "Git", "Tailwind CSS", "Express.js", "MongoDB"],
    Cybersecurity: ["Penetration Testing", "Vulnerability Analysis", "Nmap", "Wireshark", "Burp Suite"],
    "Soft Skills": ["Communication", "Problem-Solving", "Creativity", "Cooperation"],
    Languages: ["English", "Hindi"],
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <Navbar />

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white dark:bg-black">
        <div className="absolute inset-0 w-full h-full bg-white dark:bg-black bg-grid-black/[0.2] dark:bg-grid-white/[0.2]">
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
              Full Stack Developer & Cybersecurity Enthusiast
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

            {/* Carousel Container */}
            <div className="relative max-w-4xl mx-auto">
              {/* Main Carousel */}
              <div className="relative overflow-hidden rounded-2xl">
                <AnimatePresence mode="wait">
                  {projects.length > 0 && (
                    <motion.div
                      key={currentProjectIndex}
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Card className="overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                        <div className="grid md:grid-cols-5 gap-0">
                          {/* Image Section - 2/5 width */}
                          <div className="relative h-64 md:h-96 md:col-span-2 overflow-hidden bg-gray-100 dark:bg-gray-800">
                            <img
                              src={projects[currentProjectIndex].image}
                              alt={projects[currentProjectIndex].title}
                              className="w-full h-full object-cover"
                            />
                            {projects[currentProjectIndex].featured && (
                              <Badge className="absolute top-3 right-3 bg-blue-600 text-white text-xs">Featured</Badge>
                            )}
                          </div>
                          
                          {/* Content Section - 3/5 width */}
                          <CardContent className="p-6 md:col-span-3 flex flex-col justify-between h-64 md:h-96">
                            <div className="overflow-y-auto">
                              <h3 className="font-bold text-xl mb-3 text-gray-900 dark:text-white line-clamp-2">
                                {projects[currentProjectIndex].title}
                              </h3>
                              
                              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed line-clamp-4">
                                {projects[currentProjectIndex].description}
                              </p>
                              
                              <div className="flex flex-wrap gap-2 mb-4">
                                {projects[currentProjectIndex].tech.map((tech, i) => (
                                  <Badge
                                    key={i}
                                    variant="secondary"
                                    className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                                  >
                                    {tech}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div className="flex gap-3 pt-3 mt-auto border-t border-gray-200 dark:border-gray-700">
                              {projects[currentProjectIndex].github && projects[currentProjectIndex].github !== "#" && (
                                <a
                                  href={projects[currentProjectIndex].github}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors"
                                >
                                  <Github className="h-4 w-4" />
                                  <span>Code</span>
                                </a>
                              )}
                              {projects[currentProjectIndex].live && projects[currentProjectIndex].live !== "#" && (
                                <a
                                  href={projects[currentProjectIndex].live}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 px-3 py-2 text-sm border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                  <Globe className="h-4 w-4" />
                                  <span>Demo</span>
                                </a>
                              )}
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevProject}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-14 bg-white dark:bg-gray-800 p-2.5 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 border-2 border-gray-200 dark:border-gray-700 z-10"
                aria-label="Previous project"
              >
                <ChevronLeft className="h-5 w-5 text-gray-900 dark:text-white" />
              </button>
              
              <button
                onClick={nextProject}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-14 bg-white dark:bg-gray-800 p-2.5 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 border-2 border-gray-200 dark:border-gray-700 z-10"
                aria-label="Next project"
              >
                <ChevronRight className="h-5 w-5 text-gray-900 dark:text-white" />
              </button>

              {/* Dots Indicator */}
              <div className="flex justify-center gap-2 mt-6">
                {projects.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToProject(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentProjectIndex
                        ? "w-8 bg-blue-600"
                        : "w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                    }`}
                    aria-label={`Go to project ${index + 1}`}
                  />
                ))}
              </div>

              {/* Auto-play indicator */}
              <div className="text-center mt-3">
                <button
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  {isAutoPlaying ? "⏸ Pause" : "▶ Play"}
                </button>
              </div>
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
                Professional journey and hands-on learning experiences
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto space-y-6">
              {experiences.map((experience, index) => {
                const formatDate = (dateString: string) => {
                  if (!dateString) return "Present"
                  const date = new Date(dateString)
                  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
                }
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
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
                              <h3 className="font-semibold text-xl text-gray-900 dark:text-white">{experience.title}</h3>
                              <Badge variant={experience.current ? "default" : "secondary"} className="w-fit">
                                {formatDate(experience.startDate)} – {experience.current ? "Present" : formatDate(experience.endDate)}
                              </Badge>
                            </div>
                            <p className="text-blue-600 dark:text-blue-400 font-medium mb-1">
                              {experience.company}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                              {experience.location}
                            </p>
                            {experience.description && (
                              <p className="text-gray-600 dark:text-gray-300 mb-3">
                                {experience.description}
                              </p>
                            )}
                            <div className="space-y-2 text-gray-600 dark:text-gray-300">
                              {experience.responsibilities.map((resp, idx) => (
                                <p key={idx} className="flex items-start gap-2">
                                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                                  {resp}
                                </p>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
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

            <div className="max-w-md mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold font-playfair text-center">Connect With Me</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-center">
                    Let's connect on social media!
                  </p>

                  <div className="space-y-4">
                    <a
                      href="https://x.com/Stranzerzz"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                    >
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-900/40 transition-colors">
                        <Twitter className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium">Twitter</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Follow me</p>
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
                    For urgent matters or collaboration opportunities,
                    feel free to reach out on LinkedIn or Twitter.
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
