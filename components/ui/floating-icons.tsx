"use client"

import React, { useRef, useEffect, useState } from "react"
import * as THREE from "three"

interface FloatingIconsProps {
  className?: string
}

export function FloatingIcons({ className = "" }: FloatingIconsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  useEffect(() => {
    if (!mounted || !containerRef.current) return
    
    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight
    
    const isDark = document.documentElement.classList.contains('dark')
    
    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000)
    camera.position.z = 10
    
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true 
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)
    
    // Create floating icons (geometric shapes representing contact methods)
    const icons: { 
      mesh: THREE.Group
      originalPos: THREE.Vector3
      speed: number
      offset: number
    }[] = []
    
    const colors = [
      0x3b82f6, // blue - email
      0x0ea5e9, // sky - twitter
      0x0077b5, // linkedin blue
      0x6366f1, // indigo - github
      0xec4899, // pink
    ]
    
    // Email icon (envelope shape)
    const createEnvelope = () => {
      const group = new THREE.Group()
      
      const bodyGeometry = new THREE.BoxGeometry(1.2, 0.8, 0.1)
      const bodyMaterial = new THREE.MeshPhongMaterial({ 
        color: colors[0],
        transparent: true,
        opacity: 0.9
      })
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
      group.add(body)
      
      // Flap
      const flapShape = new THREE.Shape()
      flapShape.moveTo(-0.6, 0)
      flapShape.lineTo(0, -0.4)
      flapShape.lineTo(0.6, 0)
      flapShape.lineTo(-0.6, 0)
      
      const flapGeometry = new THREE.ShapeGeometry(flapShape)
      const flap = new THREE.Mesh(flapGeometry, bodyMaterial)
      flap.position.y = 0.4
      flap.position.z = 0.06
      group.add(flap)
      
      return group
    }
    
    // Twitter/X icon (simplified bird/X shape)
    const createTwitter = () => {
      const group = new THREE.Group()
      
      const geometry = new THREE.OctahedronGeometry(0.5)
      const material = new THREE.MeshPhongMaterial({ 
        color: colors[1],
        transparent: true,
        opacity: 0.9,
        flatShading: true
      })
      const mesh = new THREE.Mesh(geometry, material)
      group.add(mesh)
      
      return group
    }
    
    // LinkedIn icon (square with rounded corners)
    const createLinkedIn = () => {
      const group = new THREE.Group()
      
      const geometry = new THREE.BoxGeometry(0.9, 0.9, 0.15)
      const material = new THREE.MeshPhongMaterial({ 
        color: colors[2],
        transparent: true,
        opacity: 0.9
      })
      const mesh = new THREE.Mesh(geometry, material)
      
      // Add rounded corner effect with smaller spheres
      const cornerGeometry = new THREE.SphereGeometry(0.12, 16, 16)
      const corners = [[-0.35, -0.35], [-0.35, 0.35], [0.35, -0.35], [0.35, 0.35]]
      corners.forEach(([x, y]) => {
        const corner = new THREE.Mesh(cornerGeometry, material)
        corner.position.set(x, y, 0)
        group.add(corner)
      })
      
      group.add(mesh)
      return group
    }
    
    // GitHub icon (octahedron)
    const createGitHub = () => {
      const group = new THREE.Group()
      
      const geometry = new THREE.DodecahedronGeometry(0.5)
      const material = new THREE.MeshPhongMaterial({ 
        color: isDark ? 0xffffff : 0x333333,
        transparent: true,
        opacity: 0.9,
        flatShading: true
      })
      const mesh = new THREE.Mesh(geometry, material)
      group.add(mesh)
      
      return group
    }
    
    // Heart/Love icon
    const createHeart = () => {
      const group = new THREE.Group()
      
      const geometry = new THREE.IcosahedronGeometry(0.45)
      const material = new THREE.MeshPhongMaterial({ 
        color: colors[4],
        transparent: true,
        opacity: 0.9,
        flatShading: true
      })
      const mesh = new THREE.Mesh(geometry, material)
      group.add(mesh)
      
      return group
    }
    
    const iconCreators = [createEnvelope, createTwitter, createLinkedIn, createGitHub, createHeart]
    
    // Create and position icons
    iconCreators.forEach((creator, i) => {
      const icon = creator()
      
      const angle = (i / iconCreators.length) * Math.PI * 2
      const radius = 3.5
      
      icon.position.x = Math.cos(angle) * radius
      icon.position.y = Math.sin(angle) * radius
      icon.position.z = (Math.random() - 0.5) * 2
      
      scene.add(icon)
      
      icons.push({
        mesh: icon,
        originalPos: icon.position.clone(),
        speed: 0.5 + Math.random() * 0.5,
        offset: Math.random() * Math.PI * 2
      })
      
      // Add glow ring around each icon
      const ringGeometry = new THREE.RingGeometry(0.7, 0.8, 32)
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: colors[i],
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
      })
      const ring = new THREE.Mesh(ringGeometry, ringMaterial)
      ring.position.copy(icon.position)
      icon.userData.ring = ring
      scene.add(ring)
    })
    
    // Add connecting lines between icons
    const lineGeometry = new THREE.BufferGeometry()
    const linePositions = new Float32Array(icons.length * 6)
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))
    
    const lineMaterial = new THREE.LineBasicMaterial({
      color: isDark ? 0x60a5fa : 0x3b82f6,
      transparent: true,
      opacity: 0.2
    })
    
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial)
    scene.add(lines)
    
    // Central hub
    const hubGeometry = new THREE.SphereGeometry(0.4, 32, 32)
    const hubMaterial = new THREE.MeshPhongMaterial({
      color: isDark ? 0x60a5fa : 0x3b82f6,
      transparent: true,
      opacity: 0.7
    })
    const hub = new THREE.Mesh(hubGeometry, hubMaterial)
    scene.add(hub)
    
    // Hub glow
    const hubGlowGeometry = new THREE.SphereGeometry(0.6, 32, 32)
    const hubGlowMaterial = new THREE.MeshBasicMaterial({
      color: isDark ? 0x60a5fa : 0x3b82f6,
      transparent: true,
      opacity: 0.2
    })
    const hubGlow = new THREE.Mesh(hubGlowGeometry, hubGlowMaterial)
    scene.add(hubGlow)
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)
    
    const pointLight1 = new THREE.PointLight(0x3b82f6, 1)
    pointLight1.position.set(5, 5, 5)
    scene.add(pointLight1)
    
    const pointLight2 = new THREE.PointLight(0x8b5cf6, 0.8)
    pointLight2.position.set(-5, -3, 5)
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
      
      // Animate icons
      icons.forEach((icon, i) => {
        // Floating motion
        icon.mesh.position.y = icon.originalPos.y + Math.sin(time * icon.speed + icon.offset) * 0.3
        icon.mesh.position.x = icon.originalPos.x + Math.cos(time * icon.speed * 0.7 + icon.offset) * 0.2
        
        // Rotation
        icon.mesh.rotation.x += 0.005
        icon.mesh.rotation.y += 0.008
        
        // Update ring position
        const ring = icon.mesh.userData.ring as THREE.Mesh
        if (ring) {
          ring.position.copy(icon.mesh.position)
          ring.rotation.x = time * 0.5
          ring.rotation.y = time * 0.3
          ;(ring.material as THREE.MeshBasicMaterial).opacity = 0.2 + Math.sin(time * 2 + icon.offset) * 0.1
        }
        
        // Update connecting lines to hub
        linePositions[i * 6] = icon.mesh.position.x
        linePositions[i * 6 + 1] = icon.mesh.position.y
        linePositions[i * 6 + 2] = icon.mesh.position.z
        linePositions[i * 6 + 3] = 0
        linePositions[i * 6 + 4] = 0
        linePositions[i * 6 + 5] = 0
      })
      
      lineGeometry.attributes.position.needsUpdate = true
      
      // Hub pulse
      const hubScale = 1 + Math.sin(time * 2) * 0.1
      hub.scale.setScalar(hubScale)
      hubGlow.scale.setScalar(hubScale * 1.2)
      
      // Camera follows mouse slightly
      camera.position.x += (mouseX * 1 - camera.position.x) * 0.02
      camera.position.y += (mouseY * 1 - camera.position.y) * 0.02
      camera.lookAt(0, 0, 0)
      
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
  }, [mounted])
  
  if (!mounted) {
    return <div className={`w-full h-full ${className}`} />
  }
  
  return (
    <div 
      ref={containerRef} 
      className={`w-full h-full ${className}`}
      style={{ position: 'absolute', inset: 0 }}
    />
  )
}

export default FloatingIcons
