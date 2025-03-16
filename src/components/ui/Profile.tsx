'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface ProfileProps {
  name: string
  title: string
  description: string
  avatarUrl: string
}

/**
 * Profile.tsx
 * 
 * Component that renders the user profile with minimalist styling.
 * Redesigned to match the e-z.bio aesthetic with clean lines and subtle animations.
 * 
 * @version 2.0.0
 */

export function Profile({ name, title, description, avatarUrl }: ProfileProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div 
      className="flex flex-col items-center text-center mb-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Avatar with subtle animation */}
      <motion.div 
        className="relative mb-5"
        whileHover={{ scale: 1.05 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-white/10">
          <Image
            src={avatarUrl}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100px, 120px"
            priority
          />
          
          {/* Overlay animation on hover */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-b from-blue-600/40 to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 0.5 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </motion.div>

      {/* Name */}
      <motion.h1 
        className="text-2xl font-bold text-white mb-1"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {name}
      </motion.h1>
      
      {/* Title with subtle gradient */}
      <motion.h2 
        className="text-sm font-medium text-white/80 bg-gradient-to-r from-blue-600/80 to-white/80 bg-clip-text text-transparent mb-3"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {title}
      </motion.h2>
      
      {/* Description */}
      {description && (
        <motion.p 
          className="text-sm text-white/60 max-w-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  )
} 