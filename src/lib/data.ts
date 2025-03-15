interface ProfileData {
  name: string
  title: string
  description: string
  avatarUrl: string
}

interface LinkData {
  title: string
  url: string
  description?: string
  color: string
  icon: string
}

export const profileData: ProfileData = {
  name: 'Arthur Mairink',
  title: 'Full Stack Developer & Cybersecurity Practitioner',
  description: '',
  avatarUrl: '/images/profile.jpg',
}

export const socialLinks: LinkData[] = [
  {
    title: 'LinkedIn',
    url: 'https://www.linkedin.com/in/arthur-mairink/',
    description: 'Professional connections and career updates',
    color: 'bg-[#0077B5]',
    icon: 'linkedin'
  },
  {
    title: 'GitHub',
    url: 'https://github.com/mairinkdev',
    description: 'Projects and open-source contributions',
    color: 'bg-[#171515]',
    icon: 'github'
  },
  {
    title: 'Instagram',
    url: 'https://www.instagram.com/mairinkdev/',
    description: 'Photos and everyday moments',
    color: 'bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45]',
    icon: 'instagram'
  },
  {
    title: 'YouTube',
    url: 'https://www.youtube.com/@mairinkfr',
    description: 'Tutorials and video content',
    color: 'bg-[#FF0000]',
    icon: 'youtube'
  },
  {
    title: 'Portfolio',
    url: 'https://mairink.vercel.app',
    description: 'My recent work and projects',
    color: 'bg-gradient-to-r from-[#4F46E5] to-[#06B6D4]',
    icon: 'website'
  },
  {
    title: 'Email',
    url: 'mailto:arthur@mairink.com.br',
    description: 'Contact me directly',
    color: 'bg-[#EA4335]',
    icon: 'mail'
  },
]

// Easter eggs - hidden messages that appear under certain conditions
export const easterEggs = [
  {
    trigger: 'konami',
    message: 'You found an easter egg! 🎮 The Konami code is always the answer.',
  },
  {
    trigger: 'click-profile',
    message: 'Nice to see you here! 👋 Click 5 more times for a surprise.',
  },
  {
    trigger: 'scroll-bottom',
    message: 'You made it to the end! 🚀 The secret is to keep scrolling...',
  },
] 