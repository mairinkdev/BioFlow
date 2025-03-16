'use client'

/**
 * AudioControls.tsx
 * 
 * Audio control component with elegant minimalist design.
 * Uses only black and midnight blue colors for visual harmony.
 * 
 * @author BioFlow Team
 * @version 2.1.0
 */

import { useState, useEffect } from 'react'
import { useAudioPlayer } from '@/hooks/useAudioPlayer'
import { motion, AnimatePresence } from 'framer-motion'

export function AudioControls() {
  // Getting state and functions from audio hook
  const { isPlaying, togglePlay, volume, setVolume, isReady } = useAudioPlayer()
  
  // Local state for visibility control
  const [isVisible, setIsVisible] = useState(false)
  const [isVolumeVisible, setIsVolumeVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // Effect to show the control with delay for a smooth entrance
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Handler for volume update
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value))
  }

  // Spring animation properties for smoother transitions
  const springTransition = {
    type: "spring",
    stiffness: 300,
    damping: 20,
    mass: 0.8
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
      className="fixed bottom-6 right-6 z-50"
    >
      <div className="relative">
        {/* Main music button - minimalist design */}
        <motion.button
          onClick={togglePlay}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          className="block w-14 h-14 rounded-full bg-black border border-blue-600/30 shadow-lg relative overflow-hidden"
          whileHover={{ 
            scale: 1.05, 
            borderColor: "rgba(66, 99, 235, 0.6)",
            boxShadow: "0 0 15px rgba(66, 99, 235, 0.2)" 
          }}
          whileTap={{ scale: 0.97 }}
          animate={{ 
            scale: isReady ? 1 : 0.98,
            opacity: isReady ? 1 : 0.7 
          }}
          transition={springTransition}
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
        >
          {/* Background with animated audio wave */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-[#121212] to-[#050a18]"
              initial={{ opacity: 0.9 }}
              animate={{ 
                opacity: isPlaying ? 0.95 : 0.9,
                background: isHovered 
                  ? "radial-gradient(circle, rgba(18, 18, 18, 1) 0%, rgba(5, 10, 24, 1) 100%)" 
                  : "linear-gradient(90deg, rgba(18, 18, 18, 1) 0%, rgba(5, 10, 24, 1) 100%)"
              }}
              transition={{ 
                duration: 2, 
                repeat: isPlaying ? Infinity : 0,
                ease: "easeInOut",
                repeatType: "reverse"
              }}
            />
            
            {/* Animated audio waves with improved animation */}
            <AnimatePresence>
              {isPlaying && (
                <motion.div 
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex space-x-1 items-center">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <motion.span
                        key={i}
                        className="w-0.5 bg-blue-600"
                        animate={{ 
                          height: isPlaying ? 14 : 3,
                          opacity: isPlaying ? 0.8 : 0.5
                        }}
                        transition={{ 
                          duration: 1.5, 
                          repeat: Infinity, 
                          repeatType: "reverse",
                          delay: i * 0.1,
                          ease: "easeInOut",
                          type: "tween"
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Center icon with improved animations */}
            <motion.div
              className="relative z-10 text-white/90"
              animate={{ 
                scale: isPlaying ? 1.05 : 1,
                opacity: isPlaying ? 1 : 0.8,
                rotateZ: isHovered ? 2 : 0
              }}
              transition={{ 
                duration: isPlaying ? 2 : 0.5, 
                repeat: isPlaying ? Infinity : 0,
                repeatType: "reverse",
                ease: "easeInOut",
                type: "tween"
              }}
            >
              <AnimatePresence mode="wait">
                {isPlaying ? (
                  <motion.svg 
                    key="pause"
                    initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
                    transition={{ duration: 0.2 }}
                    xmlns="http://www.w3.org/2000/svg" 
                    width="22" 
                    height="22" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </motion.svg>
                ) : (
                  <motion.svg 
                    key="play"
                    initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.8, rotate: -10 }}
                    transition={{ duration: 0.2 }}
                    xmlns="http://www.w3.org/2000/svg" 
                    width="22" 
                    height="22" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </motion.svg>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
          
          {/* External circular glow with improved pulsating effect */}
          <motion.div 
            className="absolute -inset-1 rounded-full"
            animate={{ 
              boxShadow: isPlaying 
                ? "0 0 0 2px rgba(66, 99, 235, 0.3), 0 0 15px 0 rgba(66, 99, 235, 0.25)"
                : isHovered
                  ? "0 0 0 1px rgba(66, 99, 235, 0.3), 0 0 12px 0 rgba(66, 99, 235, 0.2)"
                  : "0 0 0 1px rgba(66, 99, 235, 0.2), 0 0 10px 0 rgba(66, 99, 235, 0.1)" 
            }}
            transition={{ 
              duration: 2, 
              repeat: isPlaying ? Infinity : 0,
              repeatType: "reverse",
              ease: "easeInOut",
              type: "tween"
            }}
          />
        </motion.button>
        
        {/* Volume popup with improved animations */}
        <AnimatePresence>
          {isVisible && (
            <motion.div
              className="absolute -top-16 right-0 bg-black/80 backdrop-blur-md rounded-lg p-3 border border-blue-600/10"
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={springTransition}
              onHoverStart={() => setIsVolumeVisible(true)}
              onHoverEnd={() => setIsVolumeVisible(false)}
              whileHover={{ 
                boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
                borderColor: "rgba(66, 99, 235, 0.25)"
              }}
            >
              <div className="flex items-center space-x-2">
                {/* Volume icon with state-based animation */}
                <motion.button 
                  onClick={() => volume > 0 ? setVolume(0) : setVolume(0.7)}
                  className="text-white/80 hover:text-white transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={springTransition}
                >
                  <AnimatePresence mode="wait">
                    {volume === 0 ? (
                      <motion.svg 
                        key="muted"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <line x1="1" y1="1" x2="23" y2="23" />
                        <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
                        <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
                      </motion.svg>
                    ) : volume < 0.3 ? (
                      <motion.svg 
                        key="volume-low"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      </motion.svg>
                    ) : volume < 0.7 ? (
                      <motion.svg 
                        key="volume-medium"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                      </motion.svg>
                    ) : (
                      <motion.svg 
                        key="volume-high"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                      </motion.svg>
                    )}
                  </AnimatePresence>
                </motion.button>
                
                {/* Improved volume slider with better visual feedback */}
                <motion.div className="w-16 relative">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-full h-1 bg-gray-900 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600"
                  />
                  <motion.div 
                    className="absolute h-1 top-0 left-0 bg-blue-600/60 rounded-l-lg pointer-events-none"
                    style={{ width: `${volume * 100}%` }}
                    animate={{ opacity: [0.6, 0.8, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
                
                <motion.div 
                  className="text-xs text-white/60"
                  animate={{ 
                    opacity: [0.6, 1, 0.6],
                    scale: volume > 0 ? [1, 1.02, 1] : 1
                  }}
                  transition={{ 
                    duration: volume > 0 ? 2 : 0.5, 
                    repeat: volume > 0 ? Infinity : 0,
                  }}
                >
                  {Math.round(volume * 100)}%
                </motion.div>
              </div>
              
              <AnimatePresence>
                {isVolumeVisible && (
                  <motion.div
                    initial={{ opacity: 0, y: 5, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: 5, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-2 pt-2 border-t border-white/10 text-xs text-white/70 text-center overflow-hidden"
                  >
                    <motion.span
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      BioFlow FM
                    </motion.span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
} 