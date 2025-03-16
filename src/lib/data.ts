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
    color: 'bg-blue-600',
    icon: 'linkedin'
  },
  {
    title: 'GitHub',
    url: 'https://github.com/mairinkdev',
    description: 'Projects and open-source contributions',
    color: 'bg-gray-900',
    icon: 'github'
  },
  {
    title: 'Instagram',
    url: 'https://www.instagram.com/mairinkdev/',
    description: 'Photos and everyday moments',
    color: 'bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500',
    icon: 'instagram'
  },
  {
    title: 'YouTube',
    url: 'https://www.youtube.com/@mairinkfr',
    description: 'Tutorials and video content',
    color: 'bg-red-600',
    icon: 'youtube'
  },
  {
    title: 'Portfolio',
    url: 'https://mairink.vercel.app',
    description: 'My recent work and projects',
    color: 'bg-gradient-to-r from-indigo-600 to-cyan-600',
    icon: 'website'
  },
  {
    title: 'Email',
    url: 'mailto:arthur@mairink.com.br',
    description: 'Contact me directly',
    color: 'bg-red-500',
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