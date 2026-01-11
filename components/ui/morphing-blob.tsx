"use client"

import React, { useRef, useEffect, useState } from "react"
import * as THREE from "three"

interface MorphingBlobProps {
  className?: string
  colors?: string[]
}

export function MorphingBlob({ 
  className = "",
  colors = ["#3b82f6", "#8b5cf6", "#06b6d4"]
}: MorphingBlobProps) {
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
    
    // Create morphing blob with custom shader
    const geometry = new THREE.IcosahedronGeometry(1.5, 64)
    
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor1: { value: new THREE.Color(colors[0]) },
        uColor2: { value: new THREE.Color(colors[1]) },
        uColor3: { value: new THREE.Color(colors[2]) },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) }
      },
      vertexShader: `
        uniform float uTime;
        uniform vec2 uMouse;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying float vDisplacement;
        
        // Simplex noise function
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
        
        float snoise(vec3 v) {
          const vec2 C = vec2(1.0/6.0, 1.0/3.0);
          const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
          
          vec3 i  = floor(v + dot(v, C.yyy));
          vec3 x0 = v - i + dot(i, C.xxx);
          
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min(g.xyz, l.zxy);
          vec3 i2 = max(g.xyz, l.zxy);
          
          vec3 x1 = x0 - i1 + C.xxx;
          vec3 x2 = x0 - i2 + C.yyy;
          vec3 x3 = x0 - D.yyy;
          
          i = mod289(i);
          vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
          
          float n_ = 0.142857142857;
          vec3 ns = n_ * D.wyz - D.xzx;
          
          vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
          
          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_);
          
          vec4 x = x_ *ns.x + ns.yyyy;
          vec4 y = y_ *ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);
          
          vec4 b0 = vec4(x.xy, y.xy);
          vec4 b1 = vec4(x.zw, y.zw);
          
          vec4 s0 = floor(b0)*2.0 + 1.0;
          vec4 s1 = floor(b1)*2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));
          
          vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
          vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
          
          vec3 p0 = vec3(a0.xy, h.x);
          vec3 p1 = vec3(a0.zw, h.y);
          vec3 p2 = vec3(a1.xy, h.z);
          vec3 p3 = vec3(a1.zw, h.w);
          
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
          p0 *= norm.x;
          p1 *= norm.y;
          p2 *= norm.z;
          p3 *= norm.w;
          
          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
        }
        
        void main() {
          vUv = uv;
          vNormal = normal;
          
          // Multiple noise layers for organic movement
          float noise1 = snoise(position * 1.5 + uTime * 0.3);
          float noise2 = snoise(position * 3.0 + uTime * 0.5) * 0.5;
          float noise3 = snoise(position * 5.0 + uTime * 0.7) * 0.25;
          
          // Mouse influence
          float mouseInfluence = (uMouse.x - 0.5) * 0.3;
          
          float displacement = (noise1 + noise2 + noise3) * 0.3 + mouseInfluence;
          vDisplacement = displacement;
          
          vec3 newPosition = position + normal * displacement;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        
        varying vec2 vUv;
        varying vec3 vNormal;
        varying float vDisplacement;
        
        void main() {
          // Dynamic color mixing based on position and time
          float mixFactor1 = sin(vUv.x * 3.14159 + uTime * 0.5) * 0.5 + 0.5;
          float mixFactor2 = cos(vUv.y * 3.14159 + uTime * 0.3) * 0.5 + 0.5;
          
          vec3 color = mix(uColor1, uColor2, mixFactor1);
          color = mix(color, uColor3, mixFactor2 * 0.5);
          
          // Fresnel effect for edge glow
          float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0);
          color += fresnel * 0.5;
          
          // Add displacement-based highlights
          color += vDisplacement * 0.3;
          
          gl_FragColor = vec4(color, 0.85);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide
    })
    
    const blob = new THREE.Mesh(geometry, material)
    scene.add(blob)
    
    // Outer glow
    const glowGeometry = new THREE.IcosahedronGeometry(1.7, 32)
    const glowMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(colors[0]) }
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          gl_FragColor = vec4(uColor, intensity * 0.5);
        }
      `,
      transparent: true,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    })
    
    const glow = new THREE.Mesh(glowGeometry, glowMaterial)
    scene.add(glow)
    
    // Orbiting particles
    const particleCount = 50
    const particleGeometry = new THREE.BufferGeometry()
    const particlePositions = new Float32Array(particleCount * 3)
    const particleData: { angle: number; radius: number; speed: number; y: number }[] = []
    
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 2 + Math.random() * 0.5
      const y = (Math.random() - 0.5) * 2
      
      particlePositions[i * 3] = Math.cos(angle) * radius
      particlePositions[i * 3 + 1] = y
      particlePositions[i * 3 + 2] = Math.sin(angle) * radius
      
      particleData.push({
        angle,
        radius,
        speed: 0.2 + Math.random() * 0.3,
        y
      })
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
    
    const particleMaterial = new THREE.PointsMaterial({
      color: colors[1],
      size: 0.05,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    })
    
    const particles = new THREE.Points(particleGeometry, particleMaterial)
    scene.add(particles)
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
    scene.add(ambientLight)
    
    const pointLight = new THREE.PointLight(0xffffff, 1)
    pointLight.position.set(5, 5, 5)
    scene.add(pointLight)
    
    // Mouse tracking
    let mouseX = 0.5
    let mouseY = 0.5
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mouseX = (e.clientX - rect.left) / width
      mouseY = (e.clientY - rect.top) / height
    }
    
    container.addEventListener('mousemove', handleMouseMove)
    
    // Animation
    let animationId: number
    let time = 0
    
    const animate = () => {
      animationId = requestAnimationFrame(animate)
      time += 0.016
      
      material.uniforms.uTime.value = time
      material.uniforms.uMouse.value.set(mouseX, mouseY)
      
      // Rotate blob
      blob.rotation.x = time * 0.1
      blob.rotation.y = time * 0.15
      glow.rotation.x = time * 0.1
      glow.rotation.y = time * 0.15
      
      // Animate orbiting particles
      const positions = particleGeometry.attributes.position.array as Float32Array
      for (let i = 0; i < particleCount; i++) {
        particleData[i].angle += particleData[i].speed * 0.02
        positions[i * 3] = Math.cos(particleData[i].angle) * particleData[i].radius
        positions[i * 3 + 2] = Math.sin(particleData[i].angle) * particleData[i].radius
        positions[i * 3 + 1] = particleData[i].y + Math.sin(time + i) * 0.1
      }
      particleGeometry.attributes.position.needsUpdate = true
      
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
      
      geometry.dispose()
      material.dispose()
      glowGeometry.dispose()
      glowMaterial.dispose()
      particleGeometry.dispose()
      particleMaterial.dispose()
      renderer.dispose()
    }
  }, [mounted, colors])
  
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

export default MorphingBlob
