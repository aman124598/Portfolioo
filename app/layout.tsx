import type React from "react"
import type { Metadata } from "next"
import { Outfit, Playfair_Display, Calistoga } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

const calistoga = Calistoga({
  subsets: ["latin"],
  variable: "--font-calistoga",
  weight: ["400"],
})

export const metadata: Metadata = {
  title: "AMAN - Web Developer & Cybersecurity Enthusiast",
  description:
    "Portfolio of AMAN, a Computer Science undergraduate passionate about web development and cybersecurity. Specializing in React, full-stack development, and ethical hacking.",
  keywords:
    "web developer, cybersecurity, react developer, full-stack developer, ethical hacking, computer science, bangalore",
  authors: [{ name: "AMAN" }],
  openGraph: {
    title: "AMAN - Web Developer & Cybersecurity Enthusiast",
    description: "Building secure, innovative web applications and exploring cybersecurity",
    type: "website",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${playfair.variable} ${calistoga.variable}`} suppressHydrationWarning>
      <body className={outfit.className}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
