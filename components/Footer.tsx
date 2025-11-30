import { Github, Linkedin, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="font-playfair text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            AMAN
          </div>
          <p className="text-gray-400 mb-6">© 2025 AMAN – Built with ❤️ using React & Tailwind CSS</p>
          <div className="flex justify-center space-x-6 mb-6">
            <a
              href="mailto:amanraj89969@gmail.com"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Email"
            >
              <Mail className="h-6 w-6" />
            </a>
            <a
              href="https://www.linkedin.com/in/aman-83169b204/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="GitHub">
              <Github className="h-6 w-6" />
            </a>
          </div>
          <p className="text-gray-500 text-sm">Web Developer • Cybersecurity Enthusiast • Problem Solver</p>
        </div>
      </div>
    </footer>
  )
}
