/**
 * data.ts
 * 
 * Dados para o perfil do usuário e links sociais
 */

interface ProfileData {
  name: string;
  title: string;
  description: string;
  avatarUrl: string;
}

interface LinkData {
  title: string;
  url: string;
  description?: string;
  color: string;
  icon: string;
}

export const profileData: ProfileData = {
  name: 'Arthur Mairink',
  title: 'Full Stack Developer & Cybersecurity Practitioner',
  description: 'Creating innovative digital solutions focused on user experience and security.',
  avatarUrl: '/images/profile.jpg',
}

export const socialLinks: LinkData[] = [
  {
    title: 'LinkedIn',
    url: 'https://www.linkedin.com/in/arthur-mairink/',
    description: 'Professional connections and career updates',
    color: 'bg-indigo-500',
    icon: 'linkedin'
  },
  {
    title: 'GitHub',
    url: 'https://github.com/mairinkdev',
    description: 'Projects and open-source contributions',
    color: 'bg-purple-500',
    icon: 'github'
  },
  {
    title: 'Twitter',
    url: 'https://twitter.com/mairinkdev',
    description: 'Thoughts and industry news',
    color: 'bg-blue-500',
    icon: 'twitter'
  },
  {
    title: 'Spotify',
    url: 'https://open.spotify.com/user/arthur_mairink',
    description: 'Music I love',
    color: 'bg-green-500',
    icon: 'spotify'
  },
  {
    title: 'Website',
    url: 'https://mairink.vercel.app',
    description: 'My portfolio and blog',
    color: 'bg-purple-500',
    icon: 'globe'
  },
  {
    title: 'Discord',
    url: 'https://discord.com/users/mairinkdev',
    description: 'Chat and gaming',
    color: 'bg-indigo-500',
    icon: 'discord'
  },
] 