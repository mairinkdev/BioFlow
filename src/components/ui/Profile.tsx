'use client'

import { useRef, useState } from 'react'
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
 * Component that renders the user profile with interactive effects.
 * The profile picture has a smooth hover animation and a "coin flip" effect when clicked,
 * redirecting to the GitHub repository.
 * 
 * @author BioFlow Team
 * @version 1.1.0
 */

export function Profile({ name, title, description, avatarUrl }: ProfileProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isFlipping, setIsFlipping] = useState(false)
  
  // Function to redirect to GitHub repository when clicking on the photo
  const handleAvatarClick = () => {
    // Activate flip animation
    setIsFlipping(true)
    
    // Wait for animation to finish before redirecting
    setTimeout(() => {
      window.open('https://github.com/mairinkdev/BioFlow', '_blank')
      
      // Reset state after redirecting
      setTimeout(() => {
        setIsFlipping(false)
      }, 500)
    }, 800)
  }

  return (
    <div 
      ref={containerRef}
      className="flex flex-col items-center text-center mb-16 px-4 py-8 relative z-10"
    >
      {/* Avatar with smooth hover effect and flip on click */}
      <motion.div 
        className="relative profile-avatar mb-10 cursor-pointer"
        whileHover={{ scale: 1.05 }}
        animate={{ 
          rotateY: isFlipping ? 360 : 0,
        }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 15,
          duration: 0.8 
        }}
        onClick={handleAvatarClick}
      >
        {/* Dark background for contrast */}
        <div className="absolute -inset-4 bg-[#000000] rounded-full opacity-60"></div>
        
        {/* Avatar image container */}
        <div className="relative z-10 midnight-glow rounded-full p-1 bg-gradient-to-br from-primary-light/15 to-secondary/15 glass-effect">
          <Image
            src={avatarUrl}
            alt={name}
            width={160}
            height={160}
            className="rounded-full object-cover border-2 border-primary-light/15"
            priority
          />
        </div>
      </motion.div>

      {/* Profile text */}
      <div className="profile-text space-y-3 z-10 relative">
        <motion.h1 
          className="text-4xl font-bold bg-gradient-to-r from-primary-light via-primary to-secondary bg-clip-text text-transparent"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          {name}
        </motion.h1>
        <motion.p 
          className="text-xl font-medium bg-gradient-to-r from-primary/90 to-secondary/90 bg-clip-text text-transparent"
          whileHover={{ y: -2 }}
        >
          {title}
        </motion.p>
        <motion.p 
          className="text-muted-foreground max-w-md mx-auto"
          initial={{ opacity: 0.8 }}
          whileHover={{ opacity: 1 }}
        >
          {description}
        </motion.p>
      </div>
      
      {/* Bottom decoration line */}
      <motion.div 
        className="mt-8 w-16 h-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: '4rem' }}
        transition={{ duration: 1, delay: 1 }}
      />
    </div>
  )
} 