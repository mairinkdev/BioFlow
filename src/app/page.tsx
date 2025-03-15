'use client'

import { useState } from 'react'
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
  const [activeCategory, setActiveCategory] = useState('all')

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
