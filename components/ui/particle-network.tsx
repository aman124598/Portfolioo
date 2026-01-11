"use client"

import React, { useRef, useEffect, useState } from "react"
import * as THREE from "three"

interface ParticleNetworkProps {
  count?: number
  color?: string
  darkColor?: string
  speed?: number
  connectionDistance?: number
  className?: string
}

export function ParticleNetwork({ 
  count = 150, 
  color = "#3b82f6",
  darkColor = "#60a5fa",
  speed = 0.3,
  connectionDistance = 150,
  className = "" 
}: ParticleNetworkProps) {
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
    const activeColor = isDark ? darkColor : color
    
    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.z = 300
    
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true 
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)
    
    // Multiple particle layers for depth
    const particleLayers: {
      particles: { x: number; y: number; z: number; vx: number; vy: number; vz: number; size: number }[]
      points: THREE.Points
      color: THREE.Color
    }[] = []
    
    const colors = [
      new THREE.Color(activeColor),
      new THREE.Color("#8b5cf6"), // purple
      new THREE.Color("#06b6d4"), // cyan
    ]
    
    colors.forEach((layerColor, layerIndex) => {
      const layerCount = Math.floor(count / 3)
      const particles: { x: number; y: number; z: number; vx: number; vy: number; vz: number; size: number }[] = []
      
      for (let i = 0; i < layerCount; i++) {
        particles.push({
          x: (Math.random() - 0.5) * width,
          y: (Math.random() - 0.5) * height,
          z: (Math.random() - 0.5) * 200 - layerIndex * 50,
          vx: (Math.random() - 0.5) * speed * 0.8,
          vy: (Math.random() - 0.5) * speed * 0.8,
          vz: (Math.random() - 0.5) * speed * 0.3,
          size: 2 + Math.random() * 3
        })
      }
      
      const positions = new Float32Array(layerCount * 3)
      const sizes = new Float32Array(layerCount)
      
      particles.forEach((p, i) => {
        positions[i * 3] = p.x
        positions[i * 3 + 1] = p.y
        positions[i * 3 + 2] = p.z
        sizes[i] = p.size
      })
      
      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
      
      const material = new THREE.PointsMaterial({
        color: layerColor,
        size: 4,
        transparent: true,
        opacity: 0.7 - layerIndex * 0.15,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending
      })
      
      const points = new THREE.Points(geometry, material)
      scene.add(points)
      
      particleLayers.push({ particles, points, color: layerColor })
    })
    
    // Lines for primary layer connections
    const lineGeometry = new THREE.BufferGeometry()
    const maxLines = count * 8
    const linePositions = new Float32Array(maxLines * 6)
    const lineColors = new Float32Array(maxLines * 6)
    
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))
    lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3))
    
    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    })
    
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial)
    scene.add(lines)
    
    // Glowing orbs at random positions
    const orbs: THREE.Mesh[] = []
    const orbCount = 5
    
    for (let i = 0; i < orbCount; i++) {
      const orbGeometry = new THREE.SphereGeometry(20 + Math.random() * 30, 32, 32)
      const orbMaterial = new THREE.MeshBasicMaterial({
        color: colors[i % colors.length],
        transparent: true,
        opacity: 0.1
      })
      const orb = new THREE.Mesh(orbGeometry, orbMaterial)
      orb.position.set(
        (Math.random() - 0.5) * width * 0.8,
        (Math.random() - 0.5) * height * 0.8,
        -100 - Math.random() * 100
      )
      orb.userData.speed = 0.3 + Math.random() * 0.5
      orb.userData.offset = Math.random() * Math.PI * 2
      scene.add(orb)
      orbs.push(orb)
    }
    
    // Mouse tracking
    let mouseX = 0
    let mouseY = 0
    let targetMouseX = 0
    let targetMouseY = 0
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      targetMouseX = ((e.clientX - rect.left) / width - 0.5) * width
      targetMouseY = -((e.clientY - rect.top) / height - 0.5) * height
    }
    
    container.addEventListener('mousemove', handleMouseMove)
    
    const threeColor = new THREE.Color(activeColor)
    
    // Animation
    let animationId: number
    let time = 0
    
    const animate = () => {
      animationId = requestAnimationFrame(animate)
      time += 0.016
      
      // Smooth mouse following
      mouseX += (targetMouseX - mouseX) * 0.05
      mouseY += (targetMouseY - mouseY) * 0.05
      
      // Update all particle layers
      particleLayers.forEach((layer, layerIndex) => {
        const posAttr = layer.points.geometry.attributes.position
        const positions = posAttr.array as Float32Array
        
        layer.particles.forEach((p, i) => {
          // Apply velocity
          p.x += p.vx
          p.y += p.vy
          p.z += p.vz
          
          // Mouse influence (stronger for front layers)
          const influence = 1 - layerIndex * 0.3
          const dx = mouseX - p.x
          const dy = mouseY - p.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          
          if (dist < 200) {
            const force = (200 - dist) * 0.001 * influence
            p.x -= dx * force
            p.y -= dy * force
          }
          
          // Boundary wrap
          const halfW = width / 2 + 100
          const halfH = height / 2 + 100
          if (p.x > halfW) p.x = -halfW
          if (p.x < -halfW) p.x = halfW
          if (p.y > halfH) p.y = -halfH
          if (p.y < -halfH) p.y = halfH
          if (p.z > 100) p.z = -200
          if (p.z < -200) p.z = 100
          
          positions[i * 3] = p.x
          positions[i * 3 + 1] = p.y
          positions[i * 3 + 2] = p.z
        })
        
        posAttr.needsUpdate = true
        
        // Gentle rotation
        layer.points.rotation.y = time * 0.02 * (1 + layerIndex * 0.5)
      })
      
      // Update connections (only for first layer)
      const primaryParticles = particleLayers[0].particles
      let lineIndex = 0
      
      for (let i = 0; i < primaryParticles.length; i++) {
        for (let j = i + 1; j < primaryParticles.length; j++) {
          const p1 = primaryParticles[i]
          const p2 = primaryParticles[j]
          
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const dz = p1.z - p2.z
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
          
          if (dist < connectionDistance && lineIndex < maxLines) {
            const alpha = 1 - dist / connectionDistance
            
            linePositions[lineIndex * 6] = p1.x
            linePositions[lineIndex * 6 + 1] = p1.y
            linePositions[lineIndex * 6 + 2] = p1.z
            linePositions[lineIndex * 6 + 3] = p2.x
            linePositions[lineIndex * 6 + 4] = p2.y
            linePositions[lineIndex * 6 + 5] = p2.z
            
            // Gradient colors
            lineColors[lineIndex * 6] = threeColor.r * alpha
            lineColors[lineIndex * 6 + 1] = threeColor.g * alpha
            lineColors[lineIndex * 6 + 2] = threeColor.b * alpha
            lineColors[lineIndex * 6 + 3] = threeColor.r * alpha * 0.5
            lineColors[lineIndex * 6 + 4] = threeColor.g * alpha * 0.5
            lineColors[lineIndex * 6 + 5] = threeColor.b * alpha * 0.8
            
            lineIndex++
          }
        }
      }
      
      // Clear remaining
      for (let i = lineIndex * 6; i < maxLines * 6; i++) {
        linePositions[i] = 0
        lineColors[i] = 0
      }
      
      lineGeometry.attributes.position.needsUpdate = true
      lineGeometry.attributes.color.needsUpdate = true
      lineGeometry.setDrawRange(0, lineIndex * 2)
      
      lines.rotation.y = time * 0.02
      
      // Animate orbs
      orbs.forEach((orb, i) => {
        const s = orb.userData.speed
        const o = orb.userData.offset
        orb.position.x += Math.sin(time * s + o) * 0.3
        orb.position.y += Math.cos(time * s * 0.7 + o) * 0.2
        orb.scale.setScalar(1 + Math.sin(time * s * 2 + o) * 0.1)
      })
      
      renderer.render(scene, camera)
    }
    
    animate()
    
    // Resize handler
    const handleResize = () => {
      const newWidth = container.clientWidth
      const newHeight = container.clientHeight
      
      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, newHeight)
    }
    
    window.addEventListener('resize', handleResize)
    
    // Theme observer
    const observer = new MutationObserver(() => {
      const nowDark = document.documentElement.classList.contains('dark')
      const newColor = nowDark ? darkColor : color
      threeColor.set(newColor)
      particleLayers[0].points.material.color.set(newColor)
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    
    // Cleanup
    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
      container.removeEventListener('mousemove', handleMouseMove)
      observer.disconnect()
      
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      
      particleLayers.forEach(layer => {
        layer.points.geometry.dispose()
        ;(layer.points.material as THREE.Material).dispose()
      })
      lineGeometry.dispose()
      lineMaterial.dispose()
      orbs.forEach(orb => {
        orb.geometry.dispose()
        ;(orb.material as THREE.Material).dispose()
      })
      renderer.dispose()
    }
  }, [mounted, count, color, darkColor, speed, connectionDistance])
  
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

export default ParticleNetwork
