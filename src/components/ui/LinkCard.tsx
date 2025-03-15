'use client'

import { useState, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface LinkCardProps {
  title: string
  url: string
  icon: React.ReactNode
  description?: string
  color?: string
  index: number
}

export function LinkCard({ title, url, icon, description, color = 'bg-primary', index }: LinkCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [showCopyMessage, setShowCopyMessage] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  
  // Configuração do efeito 3D de movimento
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const mouseX = useSpring(x, { stiffness: 150, damping: 15 })
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 })
  
  const rotateX = useTransform(mouseY, [-100, 100], [10, -10])
  const rotateY = useTransform(mouseX, [-100, 100], [-10, 10])
  const brightness = useTransform(mouseY, [-100, 100], [1.1, 0.9])
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !isHovered) return
    
    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const offsetX = e.clientX - centerX
    const offsetY = e.clientY - centerY
    
    x.set(offsetX)
    y.set(offsetY)
  }
  
  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    setIsHovered(false)
  }

  const handleEmailClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Verificar se o título é "Email"
    if (title === 'Email') {
      e.preventDefault() // Impedir comportamento padrão do link
      
      // Extrair o email do mailto: url
      const email = url.replace('mailto:', '')
      
      // Copiar o email para a área de transferência
      navigator.clipboard.writeText(email)
        .then(() => {
          // Mostrar mensagem de sucesso
          setShowCopyMessage(true)
          
          // Esconder a mensagem após 3 segundos
          setTimeout(() => {
            setShowCopyMessage(false)
          }, 3000)
        })
        .catch(err => {
          console.error('Falha ao copiar: ', err)
        })
    }
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 * index, ease: 'easeOut' }}
      style={{ 
        rotateX: isHovered ? rotateX : 0, 
        rotateY: isHovered ? rotateY : 0, 
        filter: isHovered ? `brightness(${brightness})` : "brightness(1)",
        perspective: 1200,
        transformStyle: 'preserve-3d'
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative cursor-pointer interactive-hover"
    >
      <Link 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer" 
        className={`block relative overflow-hidden ${color} rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 midnight-glow midnight-card`}
        onClick={handleEmailClick}
      >
        <motion.div
          animate={{ 
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1 : 0.8,
          }}
          transition={{ duration: 0.2 }}
          className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-primary-light/20 to-secondary/20 z-0"
          style={{ transformStyle: 'preserve-3d', transform: 'translateZ(-1px)' }}
        />
        
        <div className="relative z-10 flex items-center gap-4">
          <motion.div 
            animate={{
              scale: isHovered ? 1.1 : 1,
              rotateZ: isHovered ? [0, -10, 10, 0] : 0,
            }}
            transition={{ 
              duration: 0.5, 
              type: isHovered ? "tween" : "spring",
              ease: "easeInOut"
            }}
            className="text-white text-2xl bg-white/10 p-3 rounded-full backdrop-blur-sm"
          >
            {icon}
          </motion.div>
          <div>
            <h3 className="text-lg font-bold text-white">{title}</h3>
            {description && (
              <motion.p 
                animate={{ 
                  opacity: isHovered ? 1 : 0.8,
                  y: isHovered ? 0 : 2,
                }}
                transition={{ duration: 0.3 }}
                className="text-sm text-white/80"
              >
                {description}
              </motion.p>
            )}
          </div>
        </div>

        <motion.div 
          animate={{ 
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1 : 1.5 
          }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 pointer-events-none"
        />
        
        <motion.div
          animate={{ 
            x: isHovered ? ['100%', '0%'] : '100%',
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-primary-light/60 to-secondary/60"
        />
        
        <motion.div
          animate={{
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 10,
            x: isHovered ? 0 : -20,
          }}
          transition={{ duration: 0.3, type: "spring" }}
          className="absolute top-4 right-4 text-xl text-white/70"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
          </svg>
        </motion.div>
      </Link>

      {/* Mensagem de cópia para área de transferência */}
      <AnimatePresence>
        {showCopyMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mt-[-10px] bg-gradient-to-r from-primary to-secondary py-2 px-4 rounded-lg shadow-xl z-50"
          >
            <div className="text-white text-sm font-medium">Email copied to clipboard!</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
} 