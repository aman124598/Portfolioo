"use client"

import React, { useRef, useEffect, useState } from "react"
import * as THREE from "three"

interface FloatingSkillsProps {
  skills: string[]
  className?: string
}

export function FloatingSkills({ 
  skills,
  className = "" 
}: FloatingSkillsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  useEffect(() => {
    if (!mounted || !containerRef.current || skills.length === 0) return
    
    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight
    
    const isDark = document.documentElement.classList.contains('dark')
    
    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000)
    camera.position.z = 15
    
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true 
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)
    
    // Create floating skill cubes/shapes
    const shapes: { 
      mesh: THREE.Mesh
      originalY: number
      speed: number
      rotationSpeed: { x: number; y: number; z: number }
    }[] = []
    
    const colors = [
      0x3b82f6, // blue
      0x8b5cf6, // purple
      0x06b6d4, // cyan
      0x10b981, // green
      0xf59e0b, // amber
      0xef4444, // red
      0xec4899, // pink
    ]
    
    const geometries = [
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.OctahedronGeometry(0.7),
      new THREE.TetrahedronGeometry(0.8),
      new THREE.IcosahedronGeometry(0.6),
      new THREE.DodecahedronGeometry(0.6),
    ]
    
    skills.slice(0, 20).forEach((skill, i) => {
      const geometry = geometries[i % geometries.length]
      const color = colors[i % colors.length]
      
      const material = new THREE.MeshPhongMaterial({
        color: color,
        transparent: true,
        opacity: 0.85,
        shininess: 100,
        flatShading: true
      })
      
      const mesh = new THREE.Mesh(geometry, material)
      
      // Position in a sphere-like distribution
      const phi = Math.acos(-1 + (2 * i) / skills.length)
      const theta = Math.sqrt(skills.length * Math.PI) * phi
      
      const radius = 6 + Math.random() * 3
      mesh.position.x = radius * Math.cos(theta) * Math.sin(phi)
      mesh.position.y = radius * Math.sin(theta) * Math.sin(phi) 
      mesh.position.z = radius * Math.cos(phi) - 5
      
      mesh.rotation.x = Math.random() * Math.PI
      mesh.rotation.y = Math.random() * Math.PI
      
      scene.add(mesh)
      
      shapes.push({
        mesh,
        originalY: mesh.position.y,
        speed: 0.5 + Math.random() * 1,
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.02,
          y: (Math.random() - 0.5) * 0.02,
          z: (Math.random() - 0.5) * 0.02
        }
      })
      
      // Add wireframe overlay
      const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.1
      })
      const wireframe = new THREE.Mesh(geometry.clone(), wireframeMaterial)
      wireframe.position.copy(mesh.position)
      wireframe.rotation.copy(mesh.rotation)
      wireframe.scale.setScalar(1.05)
      mesh.userData.wireframe = wireframe
      scene.add(wireframe)
    })
    
    // Particle field background
    const particleCount = 200
    const particleGeometry = new THREE.BufferGeometry()
    const particlePositions = new Float32Array(particleCount * 3)
    
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 40
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 30
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 10
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
    
    const particleMaterial = new THREE.PointsMaterial({
      color: isDark ? 0x60a5fa : 0x3b82f6,
      size: 0.05,
      transparent: true,
      opacity: 0.5
    })
    
    const particles = new THREE.Points(particleGeometry, particleMaterial)
    scene.add(particles)
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)
    
    const pointLight1 = new THREE.PointLight(0x3b82f6, 1)
    pointLight1.position.set(10, 10, 10)
    scene.add(pointLight1)
    
    const pointLight2 = new THREE.PointLight(0x8b5cf6, 0.8)
    pointLight2.position.set(-10, -5, 5)
    scene.add(pointLight2)
    
    // Mouse interaction
    let mouseX = 0
    let mouseY = 0
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mouseX = ((e.clientX - rect.left) / width - 0.5) * 2
      mouseY = -((e.clientY - rect.top) / height - 0.5) * 2
    }
    
    container.addEventListener('mousemove', handleMouseMove)
    
    // Animation
    let animationId: number
    let time = 0
    
    const animate = () => {
      animationId = requestAnimationFrame(animate)
      time += 0.016
      
      // Animate shapes
      shapes.forEach((shape, i) => {
        // Floating motion
        shape.mesh.position.y = shape.originalY + Math.sin(time * shape.speed + i) * 0.5
        
        // Rotation
        shape.mesh.rotation.x += shape.rotationSpeed.x
        shape.mesh.rotation.y += shape.rotationSpeed.y
        shape.mesh.rotation.z += shape.rotationSpeed.z
        
        // Update wireframe
        const wireframe = shape.mesh.userData.wireframe as THREE.Mesh
        wireframe.position.copy(shape.mesh.position)
        wireframe.rotation.copy(shape.mesh.rotation)
      })
      
      // Camera follows mouse slightly
      camera.position.x += (mouseX * 2 - camera.position.x) * 0.02
      camera.position.y += (mouseY * 2 - camera.position.y) * 0.02
      camera.lookAt(0, 0, 0)
      
      // Rotate particles
      particles.rotation.y += 0.0005
      
      renderer.render(scene, camera)
    }
    
    animate()
    
    // Resize
    const handleResize = () => {
      const newWidth = container.clientWidth
      const newHeight = container.clientHeight
      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, newHeight)
    }
    
    window.addEventListener('resize', handleResize)
    
    // Cleanup
    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
      container.removeEventListener('mousemove', handleMouseMove)
      
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      
      geometries.forEach(g => g.dispose())
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose()
          if (object.material instanceof THREE.Material) {
            object.material.dispose()
          }
        }
      })
      
      renderer.dispose()
    }
  }, [mounted, skills])
  
  if (!mounted) {
    return <div className={`w-full h-full ${className}`} />
  }
  
  return (
    <div 
      ref={containerRef} 
      className={`w-full h-full ${className}`}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'auto' }}
    />
  )
}

export default FloatingSkills
