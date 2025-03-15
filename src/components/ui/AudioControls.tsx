'use client'

/**
 * AudioControls.tsx
 * 
 * Componente de controle de áudio com novo design minimalista elegante.
 * Utiliza apenas cores preto e midnight blue para harmonia visual.
 * 
 * @author BioFlow Team
 * @version 2.0.0
 */

import { useState, useEffect } from 'react'
import { useAudioPlayer } from '@/hooks/useAudioPlayer'
import { motion, AnimatePresence } from 'framer-motion'

export function AudioControls() {
  // Obtendo estado e funções do hook de áudio
  const { isPlaying, togglePlay, volume, setVolume } = useAudioPlayer()
  
  // Estado local para controle de visibilidade
  const [isVisible, setIsVisible] = useState(false)
  const [isVolumeVisible, setIsVolumeVisible] = useState(false)

  // Efeito para mostrar o controle com delay para uma entrada suave
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Handler para atualização do volume
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
      className="fixed bottom-6 right-6 z-50"
    >
      <div className="relative">
        {/* Botão principal de música - design minimalista */}
        <motion.button
          onClick={togglePlay}
          className="block w-14 h-14 rounded-full bg-black border border-[#4263eb]/30 shadow-lg relative overflow-hidden"
          whileHover={{ scale: 1.05, borderColor: "rgba(66, 99, 235, 0.6)" }}
          whileTap={{ scale: 0.97 }}
          aria-label={isPlaying ? 'Pausar música' : 'Tocar música'}
        >
          {/* Fundo com onda de áudio animada */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-[#121212] to-[#050a18]"
              initial={{ opacity: 0.9 }}
              animate={{ 
                opacity: isPlaying ? [0.9, 1, 0.9] : 0.9 
              }}
              transition={{ 
                duration: 2, 
                repeat: isPlaying ? Infinity : 0,
                ease: "easeInOut" 
              }}
            />
            
            {/* Ondas de áudio animadas */}
            {isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div 
                  className="flex space-x-1 items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {[0, 1, 2, 3, 4].map((i) => (
                    <motion.span
                      key={i}
                      className="w-0.5 bg-[#4263eb]"
                      animate={{ 
                        height: [3, 12, 5, 14, 3],
                        opacity: [0.5, 0.8, 0.5]
                      }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: Infinity, 
                        repeatType: "reverse",
                        delay: i * 0.1,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </motion.div>
              </div>
            )}
            
            {/* Ícone central */}
            <motion.div
              className="relative z-10 text-white/90"
              animate={{ 
                scale: isPlaying ? [1, 1.05, 1] : 1,
                opacity: isPlaying ? [0.8, 1, 0.8] : 0.8
              }}
              transition={{ 
                duration: 2, 
                repeat: isPlaying ? Infinity : 0,
                ease: "easeInOut" 
              }}
            >
              {isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              )}
            </motion.div>
          </div>
          
          {/* Brilho circular externo */}
          <motion.div 
            className="absolute -inset-1 rounded-full"
            animate={{ 
              boxShadow: isPlaying 
                ? [
                    "0 0 0 1px rgba(66, 99, 235, 0.2), 0 0 10px 0 rgba(66, 99, 235, 0.1)", 
                    "0 0 0 2px rgba(66, 99, 235, 0.3), 0 0 15px 0 rgba(66, 99, 235, 0.2)",
                    "0 0 0 1px rgba(66, 99, 235, 0.2), 0 0 10px 0 rgba(66, 99, 235, 0.1)"
                  ]
                : "0 0 0 1px rgba(66, 99, 235, 0.2), 0 0 10px 0 rgba(66, 99, 235, 0.1)" 
            }}
            transition={{ 
              duration: 2, 
              repeat: isPlaying ? Infinity : 0,
              ease: "easeInOut" 
            }}
          />
        </motion.button>
        
        {/* Popup do volume ao passar o mouse */}
        <AnimatePresence>
          {isVisible && (
            <motion.div
              className="absolute -top-16 right-0 bg-black/80 backdrop-blur-md rounded-lg p-3 border border-[#4263eb]/10"
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              onHoverStart={() => setIsVolumeVisible(true)}
              onHoverEnd={() => setIsVolumeVisible(false)}
            >
              <div className="flex items-center space-x-2">
                {/* Volume icon */}
                <button 
                  onClick={() => volume > 0 ? setVolume(0) : setVolume(0.7)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  {volume === 0 ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="1" y1="1" x2="23" y2="23" />
                      <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
                      <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
                    </svg>
                  ) : volume < 0.3 ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    </svg>
                  ) : volume < 0.7 ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                    </svg>
                  )}
                </button>
                
                {/* Volume slider */}
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-16 h-1 bg-gray-900 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#4263eb]"
                />
                
                <div className="text-xs text-white/60">
                  {Math.round(volume * 100)}%
                </div>
              </div>
              
              {isVolumeVisible && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 pt-2 border-t border-white/10 text-xs text-white/70 text-center"
                >
                  <span>BioFlow FM</span>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
} 