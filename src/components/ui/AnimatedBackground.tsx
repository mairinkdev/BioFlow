'use client'

import { useEffect, useRef } from 'react'

/**
 * AnimatedBackground.tsx
 * 
 * Simplified background animation with minimal particles and subtle connections.
 * Redesigned to match the clean aesthetic of e-z.bio.
 * 
 * @version 2.0.0
 */
export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    let particles: Particle[] = []
    let animationFrameId: number
    
    // Minimal particle configuration
    const particleCount = 15
    const colors = ['#4263eb', '#4f46e5']
    
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
      alpha: number
      
      constructor(x: number, y: number) {
        this.x = x
        this.y = y
        this.size = Math.random() * 2 + 0.3 // Smaller particles
        this.speedX = Math.random() * 0.3 - 0.15 // Slower movement
        this.speedY = Math.random() * 0.3 - 0.15
        this.color = colors[Math.floor(Math.random() * colors.length)]
        this.alpha = Math.random() * 0.4 + 0.1 // Lower opacity
      }
      
      update() {
        this.x += this.speedX
        this.y += this.speedY
        
        if (this.x < 0 || (canvas && this.x > canvas.width)) {
          this.speedX = -this.speedX
        }
        
        if (this.y < 0 || (canvas && this.y > canvas.height)) {
          this.speedY = -this.speedY
        }
      }
      
      draw() {
        if (!ctx) return
        ctx.globalAlpha = this.alpha
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1
      }
    }
    
    const init = () => {
      if (!canvas) return
      
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      
      particles = []
      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        particles.push(new Particle(x, y))
      }
    }
    
    const animate = () => {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      particles.forEach(particle => {
        particle.update()
        particle.draw()
      })
      
      // Subtle connections
      connectParticles()
      
      animationFrameId = requestAnimationFrame(animate)
    }
    
    const connectParticles = () => {
      if (!ctx) return
      const maxDistance = 150
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.15 // Very subtle connections
            ctx.strokeStyle = `rgba(100, 116, 230, ${opacity})`
            ctx.lineWidth = 0.3
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
    }
    
    // Initialize and handle window resize
    init()
    animate()
    
    const handleResize = () => {
      init()
    }
    
    window.addEventListener('resize', handleResize)
    
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  
  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-5 opacity-40" />
}