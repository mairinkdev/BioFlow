'use client'

import { useEffect, useRef } from 'react'

// Remover o gsap se não estiver utilizando
// import { gsap } from 'gsap'

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return // Verifica se o canvas é null antes de acessá-lo
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
        
        // Garantindo que canvas não é nulo antes de acessar suas propriedades
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
        
        // Adiciona um pequeno brilho ao redor das partículas
        ctx.globalAlpha = this.alpha * 0.3
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2)
        ctx.fill()
        
        ctx.globalAlpha = 1
      }
    }
    
    const init = () => {
      // Canvas já foi verificado no início do useEffect, mas TypeScript precisa desta validação
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
            const opacity = 1 - distance / maxDistance
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
    }
    
    init()
    animate()
    
    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [])
  
  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0" />
}