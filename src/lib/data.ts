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
  title: 'Full Stack Developer & Cybersecutiy Practiconer',
  description: '',
  avatarUrl: '/images/profile.jpg',
}

export const socialLinks: LinkData[] = [
  {
    title: 'LinkedIn',
    url: 'https://linkedin.com/in/seuperfil',
    description: 'Conexões profissionais e atualizações de carreira',
    color: 'bg-[#0077B5]',
    icon: 'linkedin'
  },
  {
    title: 'GitHub',
    url: 'https://github.com/seuusuario',
    description: 'Projetos e contribuições open-source',
    color: 'bg-[#171515]',
    icon: 'github'
  },
  {
    title: 'Instagram',
    url: 'https://instagram.com/seuusuario',
    description: 'Fotos e momentos do dia a dia',
    color: 'bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45]',
    icon: 'instagram'
  },
  {
    title: 'Twitter',
    url: 'https://twitter.com/seuusuario',
    description: 'Pensamentos e atualizações rápidas',
    color: 'bg-[#1DA1F2]',
    icon: 'twitter'
  },
  {
    title: 'YouTube',
    url: 'https://youtube.com/@seucanal',
    description: 'Tutoriais e conteúdo em vídeo',
    color: 'bg-[#FF0000]',
    icon: 'youtube'
  },
  {
    title: 'Portfólio',
    url: 'https://seuportfolio.com',
    description: 'Meus trabalhos e projetos recentes',
    color: 'bg-gradient-to-r from-[#4F46E5] to-[#06B6D4]',
    icon: 'website'
  },
  {
    title: 'Email',
    url: 'mailto:seuemail@exemplo.com',
    description: 'Entre em contato diretamente',
    color: 'bg-[#EA4335]',
    icon: 'mail'
  },
]

// Easter eggs - mensagens escondidas que aparecem em certas condições
export const easterEggs = [
  {
    trigger: 'konami',
    message: 'Você encontrou um easter egg! 🎮 O código Konami é sempre a resposta.',
  },
  {
    trigger: 'click-profile',
    message: 'Bom te ver por aqui! 👋 Clique mais 5 vezes para uma surpresa.',
  },
  {
    trigger: 'scroll-bottom',
    message: 'Você chegou até o fim! 🚀 O segredo está em continuar scrollando...',
  },
] 