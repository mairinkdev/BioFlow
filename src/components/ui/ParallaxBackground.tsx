'use client'

/**
 * ParallaxBackground.tsx
 * 
 * Este componente cria um efeito de fundo com paralaxe que responde ao scroll da página.
 * Redesenhado para usar apenas cores preto e midnight blue (azul meia-noite).
 * 
 * @author BioFlow Team
 * @version 1.1.0
 */

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

// Dados para estrelas com posições fixas para evitar problemas de hidratação SSR/CSR
const STAR_DATA = Array.from({ length: 40 }).map((_, i) => ({
  // Usamos o índice para gerar valores diferentes mas determinísticos
  cx: `${(i * 2.5) % 100}%`,
  cy: `${(i * 3.5 + 10) % 100}%`,
  r: (i % 3) * 0.5 + 0.5,
  opacity: (i % 7) * 0.1 + 0.3
}))

export function ParallaxBackground() {
  const ref = useRef(null)
  const [isMounted, setIsMounted] = useState(false)
  
  // Configuração do efeito de paralaxe com scroll
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  })
  
  // Transformações para as diferentes camadas (velocidades diferentes)
  const layer1Y = useTransform(scrollYProgress, [0, 1], [0, -100])
  const layer2Y = useTransform(scrollYProgress, [0, 1], [0, -200])
  const layer3Y = useTransform(scrollYProgress, [0, 1], [0, -300])
  
  // Garantir hidratação correta ativando somente no cliente
  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  return (
    <div ref={ref} className="fixed inset-0 -z-10 overflow-hidden">
      {/* Camada de fundo estática - preto puro */}
      <div className="absolute inset-0 bg-black" />
      
      {/* Camadas de paralaxe */}
      <motion.div 
        style={{ y: layer3Y }}
        className="absolute inset-0 parallax-layer"
      >
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="stars1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="#4263eb" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#stars1)" />
            
            {/* Renderizamos estrelas somente após a montagem no cliente 
                para evitar problemas de hidratação */}
            {isMounted && STAR_DATA.map((star, i) => (
              <circle
                key={i}
                cx={star.cx}
                cy={star.cy}
                r={star.r}
                fill="#4263eb"
                opacity={star.opacity}
              />
            ))}
          </svg>
        </div>
      </motion.div>
      
      {/* Camada intermediária com efeitos de midnight blue sutis */}
      <motion.div 
        style={{ y: layer2Y }}
        className="absolute inset-0 parallax-layer"
      >
        <div className="absolute top-20 left-10 w-60 h-60 rounded-full bg-[#4263eb]/5 blur-3xl opacity-15" />
        <div className="absolute bottom-40 right-20 w-80 h-80 rounded-full bg-[#4263eb]/5 blur-3xl opacity-15" />
      </motion.div>
      
      {/* Camada frontal com efeitos nebulosos menores */}
      <motion.div 
        style={{ y: layer1Y }}
        className="absolute inset-0 parallax-layer"
      >
        <div className="absolute top-1/3 left-1/4 w-40 h-40 rounded-full bg-[#4263eb]/5 blur-2xl opacity-15" />
        <div className="absolute bottom-1/4 right-1/3 w-32 h-32 rounded-full bg-[#4263eb]/5 blur-2xl opacity-15" />
        <div className="absolute top-1/2 right-1/4 w-24 h-24 rounded-full bg-[#4263eb]/5 blur-xl opacity-15" />
      </motion.div>
    </div>
  )
} 