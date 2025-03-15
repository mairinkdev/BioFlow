'use client'

import { useState, useEffect } from 'react'
import { AnimatedBackground } from '@/components/ui/AnimatedBackground'
import { ParallaxBackground } from '@/components/ui/ParallaxBackground'
import { Profile } from '@/components/ui/Profile'
import { LinkCard } from '@/components/ui/LinkCard'
import { AudioControls } from '@/components/ui/AudioControls'
import { AudioProvider } from '@/hooks/useAudioPlayer'
import { profileData, socialLinks } from '@/lib/data'
import { 
  LinkedInIcon, 
  GitHubIcon, 
  InstagramIcon, 
  TwitterIcon, 
  YouTubeIcon, 
  MailIcon, 
  WebsiteIcon 
} from '@/components/ui/Icons'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

// Icon mapping for links
const iconMap: Record<string, React.ReactNode> = {
  linkedin: <LinkedInIcon />,
  github: <GitHubIcon />,
  instagram: <InstagramIcon />,
  twitter: <TwitterIcon />,
  youtube: <YouTubeIcon />,
  mail: <MailIcon />,
  website: <WebsiteIcon />,
}

export default function Home() {
  const [showEasterEgg, setShowEasterEgg] = useState(false)
  const [easterEggMessage, setEasterEggMessage] = useState('')
  const [profileClicks, setProfileClicks] = useState(0)
  const [activeCategory, setActiveCategory] = useState('all')

  // Effect for Konami Code Easter Egg
  useEffect(() => {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
    let konamiIndex = 0

    const checkKonami = (e: KeyboardEvent) => {
      if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++
        if (konamiIndex === konamiCode.length) {
          setEasterEggMessage('🎮 You found the Konami code! Congratulations!')
          setShowEasterEgg(true)
          konamiIndex = 0
          
          // Hide Easter Egg after a few seconds
          setTimeout(() => {
            setShowEasterEgg(false)
          }, 5000)
        }
      } else {
        konamiIndex = 0
      }
    }

    window.addEventListener('keydown', checkKonami)
    return () => {
      window.removeEventListener('keydown', checkKonami)
    }
  }, [])

  // Function for profile click Easter Egg
  const handleProfileClick = () => {
    setProfileClicks(prev => {
      const newCount = prev + 1
      if (newCount === 5) {
        setEasterEggMessage('👋 You clicked me 5 times! Here is your surprise!')
        setShowEasterEgg(true)
        setTimeout(() => {
          setShowEasterEgg(false)
        }, 5000)
        return 0
      }
      return newCount
    })
  }
  
  // Filter links by category
  const filteredLinks = activeCategory === 'all' 
    ? socialLinks 
    : activeCategory === 'social' 
      ? socialLinks.slice(0, 4) 
      : socialLinks.slice(4)

  return (
    <AudioProvider>
      <div className="min-h-screen">
        <ParallaxBackground />
        <AnimatedBackground />
        
        <div className="container max-w-4xl mx-auto pt-16 pb-8 px-4 relative z-20">
          {/* Easter Egg popup */}
          <AnimatePresence>
            {showEasterEgg && (
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className="fixed top-10 left-1/2 -translate-x-1/2 glass-effect text-white p-6 rounded-xl shadow-xl z-50 midnight-glow"
              >
                <p className="text-center">{easterEggMessage}</p>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Profile */}
          <Profile 
            name={profileData.name}
            title={profileData.title}
            description={profileData.description}
            avatarUrl={profileData.avatarUrl}
          />
          
          {/* Category filters */}
          <motion.div 
            className="mb-10 flex justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium glass-effect ${activeCategory === 'all' ? 'bg-primary text-white' : 'bg-card/50 text-muted-foreground hover:bg-card/80'}`}
            >
              All
            </motion.button>
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              onClick={() => setActiveCategory('social')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium glass-effect ${activeCategory === 'social' ? 'bg-primary text-white' : 'bg-card/50 text-muted-foreground hover:bg-card/80'}`}
            >
              Social Media
            </motion.button>
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              onClick={() => setActiveCategory('content')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium glass-effect ${activeCategory === 'content' ? 'bg-primary text-white' : 'bg-card/50 text-muted-foreground hover:bg-card/80'}`}
            >
              Content & Contact
            </motion.button>
          </motion.div>
          
          {/* Links - With animated transitions */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredLinks.map((link, index) => (
                  <LinkCard
                    key={`${activeCategory}-${index}`}
                    title={link.title}
                    url={link.url}
                    description={link.description}
                    color={link.color}
                    icon={iconMap[link.icon]}
                    index={index}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        
        <AudioControls />
      </div>
    </AudioProvider>
  )
}
