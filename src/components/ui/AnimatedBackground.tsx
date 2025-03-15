'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    let particles: Particle[] = []
    let animationFrameId: number
    
    // Configurações - reduzindo a quantidade de partículas para um visual mais espaçado
    const particleCount = 30
    const colors = ['#8b5cf6', '#a78bfa', '#2dd4bf', '#f472b6']
    
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
        this.size = Math.random() * 3 + 0.5 // Partículas menores
        this.speedX = Math.random() * 0.5 - 0.25 // Movimentos mais lentos
        this.speedY = Math.random() * 0.5 - 0.25
        this.color = colors[Math.floor(Math.random() * colors.length)]
        this.alpha = Math.random() * 0.6 + 0.2 // Maior variação de opacidade
      }
      
      update() {
        this.x += this.speedX
        this.y += this.speedY
        
        if (this.x < 0 || this.x > canvas.width) {
          this.speedX = -this.speedX
        }
        
        if (this.y < 0 || this.y > canvas.height) {
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
        
        // Adiciona um pequeno brilho ao redor das partículas
        ctx.globalAlpha = this.alpha * 0.3
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2)
        ctx.fill()
        
        ctx.globalAlpha = 1
      }
    }
    
    const init = () => {
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
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      particles.forEach(particle => {
        particle.update()
        particle.draw()
      })
      
      // Criar conexões entre partículas próximas
      connectParticles()
      
      animationFrameId = requestAnimationFrame(animate)
    }
    
    const connectParticles = () => {
      if (!ctx) return
      const maxDistance = 200 // Aumentando a distância de conexão
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < maxDistance) {
            // Opacidade baseada na distância
            const opacity = 1 - (distance / maxDistance)
            const gradient = ctx.createLinearGradient(
              particles[i].x, particles[i].y, 
              particles[j].x, particles[j].y
            )
            gradient.addColorStop(0, `rgba(139, 92, 246, ${opacity * 0.15})`)
            gradient.addColorStop(1, `rgba(45, 212, 191, ${opacity * 0.15})`)
            
            ctx.strokeStyle = gradient
            ctx.lineWidth = 0.6
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
    }
    
    const handleResize = () => {
      init()
    }
    
    window.addEventListener('resize', handleResize)
    init()
    animate()
    
    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 -z-10 w-full h-full opacity-30 dark:opacity-40"
    />
  )
} 