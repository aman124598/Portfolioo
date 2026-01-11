"use client"

import React, { useRef, useEffect, useState } from "react"
import * as THREE from "three"

interface AnimatedTimelineProps {
  className?: string
  itemCount?: number
}

export function AnimatedTimeline({ 
  className = "",
  itemCount = 3
}: AnimatedTimelineProps) {
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
    camera.position.set(0, 0, 15)
    
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true 
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)
    
    // Create spiral timeline
    const spiralPoints: THREE.Vector3[] = []
    const spiralSegments = 200
    const spiralRadius = 3
    const spiralHeight = 8
    
    for (let i = 0; i <= spiralSegments; i++) {
      const t = i / spiralSegments
      const angle = t * Math.PI * 4 // 2 full rotations
      const y = (t - 0.5) * spiralHeight
      const r = spiralRadius * (1 - t * 0.3) // Spiral gets tighter at top
      
      spiralPoints.push(new THREE.Vector3(
        Math.cos(angle) * r,
        y,
        Math.sin(angle) * r
      ))
    }
    
    // Main timeline curve
    const spiralCurve = new THREE.CatmullRomCurve3(spiralPoints)
    const spiralGeometry = new THREE.TubeGeometry(spiralCurve, 200, 0.05, 16, false)
    
    const spiralMaterial = new THREE.MeshPhongMaterial({
      color: isDark ? 0x60a5fa : 0x3b82f6,
      transparent: true,
      opacity: 0.6,
      shininess: 100
    })
    
    const spiral = new THREE.Mesh(spiralGeometry, spiralMaterial)
    scene.add(spiral)
    
    // Glowing trail along spiral
    const trailGeometry = new THREE.TubeGeometry(spiralCurve, 200, 0.08, 16, false)
    const trailMaterial = new THREE.MeshBasicMaterial({
      color: isDark ? 0x60a5fa : 0x3b82f6,
      transparent: true,
      opacity: 0.2
    })
    const trail = new THREE.Mesh(trailGeometry, trailMaterial)
    scene.add(trail)
    
    // Timeline nodes (milestones)
    const nodes: { 
      mesh: THREE.Mesh
      ring: THREE.Mesh
      glow: THREE.Mesh
      t: number 
    }[] = []
    
    for (let i = 0; i < itemCount; i++) {
      const t = (i + 1) / (itemCount + 1)
      const point = spiralCurve.getPointAt(t)
      
      // Node sphere
      const nodeGeometry = new THREE.SphereGeometry(0.2, 32, 32)
      const nodeMaterial = new THREE.MeshPhongMaterial({
        color: [0x3b82f6, 0x8b5cf6, 0x06b6d4][i % 3],
        emissive: [0x3b82f6, 0x8b5cf6, 0x06b6d4][i % 3],
        emissiveIntensity: 0.3,
        shininess: 100
      })
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial)
      node.position.copy(point)
      scene.add(node)
      
      // Ring around node
      const ringGeometry = new THREE.RingGeometry(0.3, 0.4, 32)
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: [0x3b82f6, 0x8b5cf6, 0x06b6d4][i % 3],
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide
      })
      const ring = new THREE.Mesh(ringGeometry, ringMaterial)
      ring.position.copy(point)
      scene.add(ring)
      
      // Outer glow
      const glowGeometry = new THREE.SphereGeometry(0.35, 32, 32)
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: [0x3b82f6, 0x8b5cf6, 0x06b6d4][i % 3],
        transparent: true,
        opacity: 0.2
      })
      const glow = new THREE.Mesh(glowGeometry, glowMaterial)
      glow.position.copy(point)
      scene.add(glow)
      
      nodes.push({ mesh: node, ring, glow, t })
    }
    
    // Traveling light particle
    const particleGeometry = new THREE.SphereGeometry(0.1, 16, 16)
    const particleMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 1
    })
    const travelingParticle = new THREE.Mesh(particleGeometry, particleMaterial)
    scene.add(travelingParticle)
    
    // Particle trail
    const trailParticleCount = 20
    const trailParticles: THREE.Mesh[] = []
    
    for (let i = 0; i < trailParticleCount; i++) {
      const trailPGeometry = new THREE.SphereGeometry(0.05 * (1 - i / trailParticleCount), 8, 8)
      const trailPMaterial = new THREE.MeshBasicMaterial({
        color: isDark ? 0x60a5fa : 0x3b82f6,
        transparent: true,
        opacity: 0.5 * (1 - i / trailParticleCount)
      })
      const trailP = new THREE.Mesh(trailPGeometry, trailPMaterial)
      scene.add(trailP)
      trailParticles.push(trailP)
    }
    
    // Floating particles around timeline
    const ambientParticleCount = 100
    const ambientParticleGeometry = new THREE.BufferGeometry()
    const ambientParticlePositions = new Float32Array(ambientParticleCount * 3)
    
    for (let i = 0; i < ambientParticleCount; i++) {
      ambientParticlePositions[i * 3] = (Math.random() - 0.5) * 15
      ambientParticlePositions[i * 3 + 1] = (Math.random() - 0.5) * 12
      ambientParticlePositions[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    
    ambientParticleGeometry.setAttribute('position', new THREE.BufferAttribute(ambientParticlePositions, 3))
    
    const ambientParticleMaterial = new THREE.PointsMaterial({
      color: isDark ? 0x60a5fa : 0x3b82f6,
      size: 0.05,
      transparent: true,
      opacity: 0.4
    })
    
    const ambientParticles = new THREE.Points(ambientParticleGeometry, ambientParticleMaterial)
    scene.add(ambientParticles)
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)
    
    const pointLight1 = new THREE.PointLight(0x3b82f6, 1)
    pointLight1.position.set(5, 5, 5)
    scene.add(pointLight1)
    
    const pointLight2 = new THREE.PointLight(0x8b5cf6, 0.8)
    pointLight2.position.set(-5, -3, 5)
    scene.add(pointLight2)
    
    // Mouse tracking
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
    let particleT = 0
    
    const animate = () => {
      animationId = requestAnimationFrame(animate)
      time += 0.016
      
      // Rotate the entire scene gently
      spiral.rotation.y = time * 0.1
      trail.rotation.y = time * 0.1
      
      // Animate nodes
      nodes.forEach((node, i) => {
        const basePoint = spiralCurve.getPointAt(node.t)
        
        // Apply scene rotation to position
        const rotatedX = basePoint.x * Math.cos(time * 0.1) - basePoint.z * Math.sin(time * 0.1)
        const rotatedZ = basePoint.x * Math.sin(time * 0.1) + basePoint.z * Math.cos(time * 0.1)
        
        node.mesh.position.set(rotatedX, basePoint.y, rotatedZ)
        node.ring.position.copy(node.mesh.position)
        node.glow.position.copy(node.mesh.position)
        
        // Pulse effect
        const scale = 1 + Math.sin(time * 2 + i * 0.5) * 0.15
        node.mesh.scale.setScalar(scale)
        node.glow.scale.setScalar(scale * 1.5)
        
        // Ring rotation and pulse
        node.ring.rotation.x = time * 0.5 + i
        node.ring.rotation.y = time * 0.3 + i
        const ringScale = 1 + Math.sin(time * 3 + i) * 0.2
        node.ring.scale.setScalar(ringScale)
        ;(node.ring.material as THREE.MeshBasicMaterial).opacity = 0.3 + Math.sin(time * 2 + i) * 0.2
      })
      
      // Animate traveling particle
      particleT = (particleT + 0.002) % 1
      const particlePoint = spiralCurve.getPointAt(particleT)
      
      // Apply rotation
      const rotatedPX = particlePoint.x * Math.cos(time * 0.1) - particlePoint.z * Math.sin(time * 0.1)
      const rotatedPZ = particlePoint.x * Math.sin(time * 0.1) + particlePoint.z * Math.cos(time * 0.1)
      
      travelingParticle.position.set(rotatedPX, particlePoint.y, rotatedPZ)
      
      // Update trail particles
      for (let i = 0; i < trailParticleCount; i++) {
        const trailT = (particleT - i * 0.01 + 1) % 1
        const trailPoint = spiralCurve.getPointAt(trailT)
        
        const rotatedTX = trailPoint.x * Math.cos(time * 0.1) - trailPoint.z * Math.sin(time * 0.1)
        const rotatedTZ = trailPoint.x * Math.sin(time * 0.1) + trailPoint.z * Math.cos(time * 0.1)
        
        trailParticles[i].position.set(rotatedTX, trailPoint.y, rotatedTZ)
      }
      
      // Animate ambient particles
      const ambientPositions = ambientParticleGeometry.attributes.position.array as Float32Array
      for (let i = 0; i < ambientParticleCount; i++) {
        ambientPositions[i * 3 + 1] += Math.sin(time + i * 0.1) * 0.003
      }
      ambientParticleGeometry.attributes.position.needsUpdate = true
      ambientParticles.rotation.y = time * 0.02
      
      // Camera follows mouse
      camera.position.x += (mouseX * 2 - camera.position.x) * 0.02
      camera.position.y += (mouseY * 2 - camera.position.y) * 0.02
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
        if (object instanceof THREE.Points) {
          object.geometry.dispose()
          if (object.material instanceof THREE.Material) {
            object.material.dispose()
          }
        }
      })
      
      renderer.dispose()
    }
  }, [mounted, itemCount])
  
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

export default AnimatedTimeline
