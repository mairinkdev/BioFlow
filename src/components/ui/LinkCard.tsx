'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useSpring, useAnimation } from 'framer-motion'
import Link from 'next/link'

interface LinkCardProps {
  title: string
  url: string
  icon: React.ReactNode
  description?: string
  color?: string
  index: number
}

/**
 * LinkCard.tsx
 * 
 * Simple and clean link card component styled like e-z.bio.
 * With super smooth 60/240fps animations.
 * 
 * @version 2.1.0
 */
export function LinkCard({ title, url, icon, description, color = 'bg-blue-600', index }: LinkCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressing, setIsPressing] = useState(false);
  const [showCopyMessage, setShowCopyMessage] = useState(false);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const iconControls = useAnimation();
  
  // Configurações de spring para animações fluidas
  const springConfig = { 
    stiffness: 400, 
    damping: 30, 
    mass: 0.8 
  };
  
  // Animações refinadas para entradas suaves
  const enterAnimation = {
    opacity: 0, 
    y: 20,
    scale: 0.98
  };
  
  const activeAnimation = {
    opacity: 1, 
    y: 0,
    scale: 1
  };
  
  const handleEmailClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Check if this is the email link
    if (title === 'Email') {
      e.preventDefault();
      
      // Extract email from mailto: url
      const email = url.replace('mailto:', '');
      
      // Copy to clipboard
      navigator.clipboard.writeText(email)
        .then(() => {
          setShowCopyMessage(true);
          
          // Hide message after delay
          setTimeout(() => {
            setShowCopyMessage(false);
          }, 3000);
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
        });
    }
  };

  // Rastreador de posição do mouse para o efeito de brilho
  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (linkRef.current) {
      const rect = linkRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      linkRef.current.style.setProperty('--mouse-x', `${x}%`);
      linkRef.current.style.setProperty('--mouse-y', `${y}%`);
    }
  };

  // Efeito de wiggle para o ícone quando hover
  useEffect(() => {
    if (isHovered) {
      // Inicia sequência de animação quando mouse sobre o botão
      const wiggleAnimation = async () => {
        await iconControls.start({
          rotate: -2,
          transition: { type: "spring", stiffness: 300, damping: 10 }
        });
        await iconControls.start({
          rotate: 2,
          transition: { type: "spring", stiffness: 300, damping: 10 }
        });
        await iconControls.start({
          rotate: 0,
          transition: { type: "spring", stiffness: 300, damping: 10 }
        });
      };
      
      wiggleAnimation();
    } else {
      // Retorna à posição normal quando mouse sai
      iconControls.start({
        rotate: 0,
        transition: { type: "spring", ...springConfig }
      });
    }
  }, [isHovered, iconControls, springConfig]);

  return (
    <div className="relative">
      <motion.div
        initial={enterAnimation}
        animate={activeAnimation}
        transition={{ 
          type: "spring", 
          ...springConfig,
          delay: 0.08 * index 
        }}
        className="relative"
      >
        <Link 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer" 
          onClick={handleEmailClick}
          className="block relative"
          onMouseDown={() => setIsPressing(true)}
          onMouseUp={() => setIsPressing(false)}
          onMouseLeave={() => {
            setIsPressing(false);
            setIsHovered(false);
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseMove={handleMouseMove}
          onTouchStart={() => setIsPressing(true)}
          onTouchEnd={() => setIsPressing(false)}
          ref={linkRef}
        >
          <motion.div 
            className={`${color} w-full py-3 px-4 rounded-lg flex items-center`}
            initial={{ boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)' }}
            animate={{ 
              y: isHovered ? (isPressing ? 0 : -3) : 0,
              scale: isPressing ? 0.98 : 1,
              boxShadow: isHovered 
                ? isPressing 
                  ? '0 2px 4px rgba(0, 0, 0, 0.2)' 
                  : '0 6px 16px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)' 
                : '0 2px 6px rgba(0, 0, 0, 0.1)',
              filter: isHovered ? 'brightness(1.05)' : 'brightness(1)'
            }}
            transition={{
              type: "spring",
              ...springConfig,
              y: { type: "spring", ...springConfig },
              scale: { type: "spring", ...springConfig },
              boxShadow: { type: "spring", ...springConfig },
              filter: { duration: 0.15 }
            }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div 
              className="text-white mr-3"
              animate={iconControls}
              initial={{ scale: 1, rotate: 0 }}
              whileTap={{ scale: 0.95 }}
            >
              {icon}
            </motion.div>
            
            <div className="flex-1">
              <motion.div 
                className="font-medium text-white"
                animate={{ 
                  x: isHovered ? 2 : 0
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 500, 
                  damping: 30 
                }}
              >
                {title}
              </motion.div>
              
              {description && (
                <motion.div 
                  className="text-xs text-white/70 mt-0.5 line-clamp-1"
                  animate={{ 
                    opacity: isHovered ? 0.9 : 0.7
                  }}
                  transition={{ duration: 0.15 }}
                >
                  {description}
                </motion.div>
              )}
            </div>
            
            <motion.div 
              className="w-4 h-4 text-white opacity-50"
              animate={{ 
                x: isHovered ? 4 : 0,
                opacity: isHovered ? 0.9 : 0.5,
                scale: isHovered ? 1.1 : 1
              }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </motion.div>
          </motion.div>
          
          {/* Efeito de brilho no hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.div 
                className="absolute inset-0 rounded-lg pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  background: 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 60%)',
                }}
              />
            )}
          </AnimatePresence>
        </Link>
      </motion.div>

      {/* Copy message com animação melhorada */}
      <AnimatePresence>
        {showCopyMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            transition={{ 
              type: "spring", 
              stiffness: 500, 
              damping: 30 
            }}
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mt-[-10px] bg-black py-2 px-4 rounded-lg shadow-lg z-50"
          >
            <motion.div 
              className="text-white text-xs font-medium"
              animate={{ 
                opacity: [1, 0.8, 1]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                repeatType: "mirror" 
              }}
            >
              Email copied to clipboard!
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 