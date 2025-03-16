'use client'

import { useState, useEffect } from 'react'
import { AnimatedBackground } from '@/components/ui/AnimatedBackground'
import { Profile } from '@/components/ui/Profile'
import { LinkCard } from '@/components/ui/LinkCard'
import { AudioControls } from '@/components/ui/AudioControls'
import { AudioProvider } from '@/hooks/useAudioPlayer'
import { profileData, socialLinks } from '@/lib/data'
import { 
  LinkedInIcon, 
  GitHubIcon, 
  InstagramIcon, 
  YouTubeIcon, 
  MailIcon, 
  WebsiteIcon 
} from '@/components/ui/Icons'
import { motion } from 'framer-motion'

// Icon mapping for links
const iconMap: Record<string, React.ReactNode> = {
  linkedin: <LinkedInIcon />,
  github: <GitHubIcon />,
  instagram: <InstagramIcon />,
  youtube: <YouTubeIcon />,
  mail: <MailIcon />,
  website: <WebsiteIcon />,
}

export default function Home() {
  const [mounted, setMounted] = useState(false);

  // Ensure hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <AudioProvider>
      <div className="min-h-screen flex flex-col items-center justify-start py-10 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#000000] to-[#050a18] -z-10" />
        <AnimatedBackground />
        
        <div className="w-full max-w-md mx-auto z-20 flex flex-col items-center">
          {/* Profile */}
          <Profile 
            name={profileData.name}
            title={profileData.title}
            description={profileData.description}
            avatarUrl={profileData.avatarUrl}
          />
          
          {/* Links */}
          <div className="w-full mt-6 space-y-3">
            {socialLinks.map((link, index) => (
              <LinkCard
                key={index}
                title={link.title}
                url={link.url}
                description={link.description}
                color={link.color}
                icon={iconMap[link.icon]}
                index={index}
              />
            ))}
          </div>

          <motion.div 
            className="mt-10 text-center text-xs text-white/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <p>© {new Date().getFullYear()} {profileData.name}</p>
          </motion.div>
        </div>
        
        <AudioControls />
      </div>
    </AudioProvider>
  )
}
