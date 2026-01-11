"use client"

import React, { useRef, useEffect, useState } from "react"
import * as THREE from "three"

interface Globe3DProps {
  className?: string
  markerLat?: number
  markerLng?: number
  markerLabel?: string
  autoRotate?: boolean
  rotateSpeed?: number
}

// Convert lat/lng to 3D position on sphere
function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  
  const x = -(radius * Math.sin(phi) * Math.cos(theta))
  const z = radius * Math.sin(phi) * Math.sin(theta)
  const y = radius * Math.cos(phi)
  
  return new THREE.Vector3(x, y, z)
}

export function Globe3D({ 
  className = "",
  markerLat = 12.9716,
  markerLng = 77.5946,
  markerLabel = "Bangalore, India",
  autoRotate = true,
  rotateSpeed = 0.3
}: Globe3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  useEffect(() => {
    if (!mounted || !containerRef.current) return
    
    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight
    
    // Check theme
    const isDark = document.documentElement.classList.contains('dark')
    
    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.z = 5
    
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true 
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)
    
    // Globe group
    const globeGroup = new THREE.Group()
    scene.add(globeGroup)
    
    const radius = 1.5
    
    // ============ OUTER ATMOSPHERE GLOW ============
    const atmosphereGeometry = new THREE.SphereGeometry(radius * 1.15, 64, 64)
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true
    })
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial)
    globeGroup.add(atmosphere)
    
    // ============ INNER GLOW SPHERE ============
    const innerGlowGeometry = new THREE.SphereGeometry(radius * 0.99, 64, 64)
    const innerGlowMaterial = new THREE.MeshBasicMaterial({
      color: isDark ? 0x1a365d : 0xdbeafe,
      transparent: true,
      opacity: 0.6
    })
    const innerGlow = new THREE.Mesh(innerGlowGeometry, innerGlowMaterial)
    globeGroup.add(innerGlow)
    
    // ============ GRADIENT SPHERE ============
    const globeGeometry = new THREE.SphereGeometry(radius, 64, 64)
    const globeMaterial = new THREE.MeshPhongMaterial({
      color: isDark ? 0x1e3a5f : 0x93c5fd,
      transparent: true,
      opacity: 0.4,
      shininess: 25
    })
    const globe = new THREE.Mesh(globeGeometry, globeMaterial)
    globeGroup.add(globe)
    
    // ============ LATITUDE LINES (Glowing) ============
    const lineColor = isDark ? 0x60a5fa : 0x3b82f6
    
    for (let lat = -80; lat <= 80; lat += 15) {
      const points: THREE.Vector3[] = []
      for (let lng = 0; lng <= 360; lng += 3) {
        points.push(latLngToVector3(lat, lng, radius * 1.005))
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      const material = new THREE.LineBasicMaterial({ 
        color: lineColor, 
        transparent: true, 
        opacity: lat === 0 ? 0.8 : 0.35  // Equator brighter
      })
      const line = new THREE.Line(geometry, material)
      globeGroup.add(line)
    }
    
    // ============ LONGITUDE LINES ============
    for (let lng = 0; lng < 360; lng += 15) {
      const points: THREE.Vector3[] = []
      for (let lat = -90; lat <= 90; lat += 3) {
        points.push(latLngToVector3(lat, lng, radius * 1.005))
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      const material = new THREE.LineBasicMaterial({ 
        color: lineColor, 
        transparent: true, 
        opacity: 0.35 
      })
      const line = new THREE.Line(geometry, material)
      globeGroup.add(line)
    }
    
    // ============ CONTINENTS DOTS (Simulated land masses) ============
    const continentDots: THREE.Mesh[] = []
    // Generate random "land" dots for visual effect
    for (let i = 0; i < 200; i++) {
      const lat = (Math.random() - 0.5) * 160
      const lng = Math.random() * 360
      
      const pos = latLngToVector3(lat, lng, radius * 1.01)
      const dotGeometry = new THREE.SphereGeometry(0.008 + Math.random() * 0.01, 8, 8)
      const dotMaterial = new THREE.MeshBasicMaterial({ 
        color: isDark ? 0x22d3ee : 0x06b6d4,
        transparent: true,
        opacity: 0.5 + Math.random() * 0.5
      })
      const dot = new THREE.Mesh(dotGeometry, dotMaterial)
      dot.position.copy(pos)
      globeGroup.add(dot)
      continentDots.push(dot)
    }
    
    // ============ FLOATING PARTICLES AROUND GLOBE ============
    const particleCount = 100
    const particlesGeometry = new THREE.BufferGeometry()
    const particlePositions = new Float32Array(particleCount * 3)
    const particleSpeeds = new Float32Array(particleCount)
    
    for (let i = 0; i < particleCount; i++) {
      const angle1 = Math.random() * Math.PI * 2
      const angle2 = Math.random() * Math.PI * 2
      const r = radius * 1.3 + Math.random() * 0.8
      
      particlePositions[i * 3] = Math.sin(angle1) * Math.cos(angle2) * r
      particlePositions[i * 3 + 1] = Math.sin(angle2) * r
      particlePositions[i * 3 + 2] = Math.cos(angle1) * Math.cos(angle2) * r
      particleSpeeds[i] = 0.5 + Math.random() * 1.5
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
    
    const particlesMaterial = new THREE.PointsMaterial({
      color: isDark ? 0x60a5fa : 0x3b82f6,
      size: 0.03,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    })
    
    const particles = new THREE.Points(particlesGeometry, particlesMaterial)
    globeGroup.add(particles)
    
    // ============ CITY MARKERS ============
    const cities = [
      { lat: 40.7128, lng: -74.006, name: "New York" },
      { lat: 51.5074, lng: -0.1278, name: "London" },
      { lat: 35.6762, lng: 139.6503, name: "Tokyo" },
      { lat: -33.8688, lng: 151.2093, name: "Sydney" },
      { lat: 48.8566, lng: 2.3522, name: "Paris" },
      { lat: 1.3521, lng: 103.8198, name: "Singapore" },
      { lat: 55.7558, lng: 37.6173, name: "Moscow" },
      { lat: 25.2048, lng: 55.2708, name: "Dubai" },
    ]
    
    cities.forEach(city => {
      const pos = latLngToVector3(city.lat, city.lng, radius * 1.015)
      
      // City dot
      const dotGeometry = new THREE.SphereGeometry(0.02, 16, 16)
      const dotMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x22d3ee
      })
      const dot = new THREE.Mesh(dotGeometry, dotMaterial)
      dot.position.copy(pos)
      globeGroup.add(dot)
      
      // City glow
      const glowGeometry = new THREE.SphereGeometry(0.035, 16, 16)
      const glowMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x22d3ee,
        transparent: true,
        opacity: 0.3
      })
      const glow = new THREE.Mesh(glowGeometry, glowMaterial)
      glow.position.copy(pos)
      globeGroup.add(glow)
    })
    
    // ============ MAIN LOCATION MARKER ============
    const markerPos = latLngToVector3(markerLat, markerLng, radius * 1.025)
    
    // Marker pin (cone shape)
    const pinGeometry = new THREE.ConeGeometry(0.04, 0.12, 16)
    const pinMaterial = new THREE.MeshBasicMaterial({ color: 0xef4444 })
    const pin = new THREE.Mesh(pinGeometry, pinMaterial)
    pin.position.copy(markerPos)
    pin.position.add(markerPos.clone().normalize().multiplyScalar(0.06))
    pin.lookAt(0, 0, 0)
    pin.rotateX(Math.PI / 2)
    globeGroup.add(pin)
    
    // Marker dot
    const markerGeometry = new THREE.SphereGeometry(0.05, 32, 32)
    const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xef4444 })
    const marker = new THREE.Mesh(markerGeometry, markerMaterial)
    marker.position.copy(markerPos)
    globeGroup.add(marker)
    
    // Marker glow
    const markerGlowGeometry = new THREE.SphereGeometry(0.09, 32, 32)
    const markerGlowMaterial = new THREE.MeshBasicMaterial({
      color: 0xef4444,
      transparent: true,
      opacity: 0.4
    })
    const markerGlow = new THREE.Mesh(markerGlowGeometry, markerGlowMaterial)
    markerGlow.position.copy(markerPos)
    globeGroup.add(markerGlow)
    
    // Pulse rings
    const rings: THREE.Mesh[] = []
    for (let i = 0; i < 3; i++) {
      const ringGeometry = new THREE.RingGeometry(0.08, 0.1, 32)
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0xef4444,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide
      })
      const ring = new THREE.Mesh(ringGeometry, ringMaterial)
      ring.position.copy(markerPos)
      ring.lookAt(0, 0, 0)
      ring.userData.delay = i * 0.3
      globeGroup.add(ring)
      rings.push(ring)
    }
    
    // ============ ANIMATED CONNECTION ARCS ============
    const arcs: { line: THREE.Line, progress: number, speed: number }[] = []
    const arcMaterial = new THREE.LineBasicMaterial({
      color: isDark ? 0xfbbf24 : 0xf59e0b,
      transparent: true,
      opacity: 0.7
    })
    
    cities.forEach((city, index) => {
      const start = latLngToVector3(markerLat, markerLng, radius * 1.01)
      const end = latLngToVector3(city.lat, city.lng, radius * 1.01)
      const mid = start.clone().add(end).multiplyScalar(0.5)
      const dist = start.distanceTo(end)
      mid.normalize().multiplyScalar(radius * (1.2 + dist * 0.15))
      
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end)
      const points = curve.getPoints(100)
      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      
      const arc = new THREE.Line(geometry, arcMaterial.clone())
      arc.geometry.setDrawRange(0, 0)
      globeGroup.add(arc)
      
      arcs.push({
        line: arc,
        progress: 0,
        speed: 0.8 + Math.random() * 0.5
      })
    })
    
    // ============ LIGHTING ============
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
    scene.add(ambientLight)
    
    const pointLight1 = new THREE.PointLight(0x3b82f6, 1.5)
    pointLight1.position.set(5, 5, 5)
    scene.add(pointLight1)
    
    const pointLight2 = new THREE.PointLight(0x8b5cf6, 1)
    pointLight2.position.set(-5, -3, 3)
    scene.add(pointLight2)
    
    const pointLight3 = new THREE.PointLight(0x06b6d4, 0.8)
    pointLight3.position.set(0, 5, -5)
    scene.add(pointLight3)
    
    // ============ MOUSE INTERACTION ============
    let isDragging = false
    let previousMouseX = 0
    let previousMouseY = 0
    let targetRotationY = 0
    let targetRotationX = 0
    
    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true
      previousMouseX = e.clientX
      previousMouseY = e.clientY
      container.style.cursor = 'grabbing'
    }
    
    const handleMouseUp = () => {
      isDragging = false
      container.style.cursor = 'grab'
    }
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      
      const deltaX = e.clientX - previousMouseX
      const deltaY = e.clientY - previousMouseY
      
      targetRotationY += deltaX * 0.005
      targetRotationX += deltaY * 0.005
      
      targetRotationX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, targetRotationX))
      
      previousMouseX = e.clientX
      previousMouseY = e.clientY
    }
    
    container.addEventListener('mousedown', handleMouseDown)
    container.addEventListener('mouseup', handleMouseUp)
    container.addEventListener('mouseleave', handleMouseUp)
    container.addEventListener('mousemove', handleMouseMove)
    
    // ============ ANIMATION LOOP ============
    let animationId: number
    let time = 0
    
    const animate = () => {
      animationId = requestAnimationFrame(animate)
      time += 0.016
      
      // Auto rotation
      if (autoRotate && !isDragging) {
        targetRotationY += rotateSpeed * 0.002
      }
      
      // Smooth rotation
      globeGroup.rotation.y += (targetRotationY - globeGroup.rotation.y) * 0.05
      globeGroup.rotation.x += (targetRotationX - globeGroup.rotation.x) * 0.05
      
      // Animate floating particles
      const positions = particlesGeometry.attributes.position.array as Float32Array
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3
        const speed = particleSpeeds[i]
        
        // Orbital motion
        const x = positions[i3]
        const z = positions[i3 + 2]
        const angle = Math.atan2(z, x) + 0.002 * speed
        const r = Math.sqrt(x * x + z * z)
        
        positions[i3] = Math.cos(angle) * r
        positions[i3 + 2] = Math.sin(angle) * r
        positions[i3 + 1] += Math.sin(time * speed) * 0.002
      }
      particlesGeometry.attributes.position.needsUpdate = true
      
      // Animate connection arcs
      arcs.forEach((arc, i) => {
        arc.progress += arc.speed * 0.01
        if (arc.progress > 2) arc.progress = 0
        
        const drawEnd = Math.min(arc.progress, 1) * 100
        const drawStart = Math.max(0, arc.progress - 1) * 100
        
        arc.line.geometry.setDrawRange(Math.floor(drawStart), Math.floor(drawEnd - drawStart))
        
        const mat = arc.line.material as THREE.LineBasicMaterial
        mat.opacity = arc.progress > 1 ? 1 - (arc.progress - 1) : Math.min(arc.progress * 2, 0.7)
      })
      
      // Pulse rings animation
      rings.forEach((ring, i) => {
        const t = (time + ring.userData.delay) % 2
        const scale = 1 + t * 1.5
        ring.scale.setScalar(scale)
        ;(ring.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.6 - t * 0.4)
      })
      
      // Animate continent dots (subtle pulse)
      continentDots.forEach((dot, i) => {
        const mat = dot.material as THREE.MeshBasicMaterial
        mat.opacity = 0.4 + Math.sin(time * 2 + i * 0.1) * 0.2
      })
      
      // Update label position
      if (labelRef.current) {
        const markerWorldPos = new THREE.Vector3()
        marker.getWorldPosition(markerWorldPos)
        markerWorldPos.project(camera)
        
        const x = (markerWorldPos.x * 0.5 + 0.5) * width
        const y = (-markerWorldPos.y * 0.5 + 0.5) * height
        
        const isVisible = markerWorldPos.z < 0.3
        
        labelRef.current.style.left = `${x + 20}px`
        labelRef.current.style.top = `${y - 20}px`
        labelRef.current.style.opacity = isVisible ? '1' : '0'
      }
      
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
      innerGlowMaterial.color.set(nowDark ? 0x1a365d : 0xdbeafe)
      globeMaterial.color.set(nowDark ? 0x1e3a5f : 0x93c5fd)
      particlesMaterial.color.set(nowDark ? 0x60a5fa : 0x3b82f6)
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    
    // Cleanup
    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
      container.removeEventListener('mousedown', handleMouseDown)
      container.removeEventListener('mouseup', handleMouseUp)
      container.removeEventListener('mouseleave', handleMouseUp)
      container.removeEventListener('mousemove', handleMouseMove)
      observer.disconnect()
      
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
        if (object instanceof THREE.Line) {
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
  }, [mounted, markerLat, markerLng, markerLabel, autoRotate, rotateSpeed])
  
  if (!mounted) {
    return <div className={`w-full h-full ${className}`} />
  }
  
  return (
    <div 
      className={`relative w-full h-full ${className}`}
      style={{ cursor: 'grab' }}
    >
      <div 
        ref={containerRef} 
        className="w-full h-full"
        style={{ position: 'absolute', inset: 0 }}
      />
      {/* Location label */}
      <div
        ref={labelRef}
        className="absolute pointer-events-none transition-opacity duration-300"
        style={{ transform: 'translate(-50%, -100%)' }}
      >
        <div className="flex items-center gap-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-3 py-2 rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 whitespace-nowrap">
          <div className="relative">
            <div className="w-2.5 h-2.5 bg-red-500 rounded-full" />
            <div className="absolute inset-0 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
          </div>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {markerLabel}
          </span>
        </div>
      </div>
    </div>
  )
}

export default Globe3D
