'use client'

/**
 * useAudioPlayer.tsx
 * 
 * Hook and context provider for audio playback in the application.
 * Manages playback state, volume, and interface for the audio player.
 * 
 * @author BioFlow Team
 * @version 1.4.0
 */

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react'
import ReactHowler from 'react-howler'

// Define the audio context interface
interface AudioContextType {
  isPlaying: boolean
  togglePlay: () => void
  volume: number
  setVolume: (volume: number) => void
  currentTrack: string
  changeTrack: (track: string) => void
  tracks: string[]
  isReady: boolean
}

// List of available tracks (only one for now)
const defaultTracks = ['/audio/lofi.mp3']

// Context creation
const AudioContext = createContext<AudioContextType | undefined>(undefined)

/**
 * Audio context provider that encapsulates player functionality
 * 
 * @param {ReactNode} children - Child components that will have access to the context
 */
export const AudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Local state for player control
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [currentTrack, setCurrentTrack] = useState(defaultTracks[0])
  const [tracks] = useState<string[]>(defaultTracks)
  const [isReady, setIsReady] = useState(false)
  const [shouldCreateAudio, setShouldCreateAudio] = useState(false)
  const playerRef = useRef<ReactHowler | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const audioInitializedRef = useRef(false)

  // Função para criar e inicializar o AudioContext
  const initAudioSystem = () => {
    if (audioInitializedRef.current) return;
    
    try {
      // Definir o tipo para webkitAudioContext
      interface WindowWithWebkitAudio extends Window {
        webkitAudioContext?: typeof AudioContext;
      }
      
      // Criar AudioContext apenas se não existir
      if (!audioContextRef.current && typeof window !== 'undefined') {
        const AudioContextClass = window.AudioContext || (window as WindowWithWebkitAudio).webkitAudioContext;
        if (AudioContextClass) {
          // Criamos o AudioContext apenas quando o usuário interage
          audioContextRef.current = new AudioContextClass();
          
          // Retomar o contexto se estiver suspenso (requisito do navegador)
          if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume().catch(e => 
              console.error('Erro ao retomar AudioContext:', e)
            );
          }
          
          audioInitializedRef.current = true;
        }
      }
      
      // Ativar o ReactHowler
      setShouldCreateAudio(true);
      setIsReady(true);
      
    } catch (error) {
      console.error('Erro ao inicializar sistema de áudio:', error);
    }
  };

  // Toggle play com inicialização lazy do áudio
  const togglePlay = () => {
    // Inicializar o sistema de áudio na primeira interação do usuário
    if (!audioInitializedRef.current) {
      initAudioSystem();
    }
    
    // Alternar estado de reprodução apenas se o sistema estiver pronto
    if (isReady || shouldCreateAudio) {
      setIsPlaying(prev => !prev);
    }
  };

  // Change the current track (if it exists in the list)
  const changeTrack = (track: string) => {
    if (tracks.includes(track)) {
      // Inicializar sistema de áudio se necessário
      if (!audioInitializedRef.current) {
        initAudioSystem();
      }
      
      // Pause before changing track for smoother transition
      const wasPlaying = isPlaying;
      if (wasPlaying) setIsPlaying(false);
      
      // Add small delay before changing track
      setTimeout(() => {
        setCurrentTrack(track);
        
        // Resume playing if it was playing before
        if (wasPlaying) {
          setTimeout(() => setIsPlaying(true), 100);
        }
      }, 100);
    }
  };

  // Limpar recursos quando o componente for desmontado
  useEffect(() => {
    return () => {
      // Limpar referências para evitar vazamentos
      if (audioContextRef.current) {
        try {
          if (audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close().catch(() => {});
          }
        } catch (_) {
          // Ignorar erros na limpeza
        }
        audioContextRef.current = null;
      }
      audioInitializedRef.current = false;
    };
  }, []);

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        togglePlay,
        volume,
        setVolume,
        currentTrack,
        changeTrack,
        tracks,
        isReady
      }}
    >
      {/* Carregar o player apenas após interação do usuário */}
      {shouldCreateAudio && (
        <ReactHowler
          src={currentTrack}
          playing={isPlaying}
          loop={true}
          volume={volume}
          ref={playerRef}
          preload={false}  // Não pré-carregar para evitar problemas com políticas de áudio
          html5={true}     // Usar APIs HTML5 Audio
          onLoad={() => setIsReady(true)}
          format={['mp3']}
        />
      )}
      {children}
    </AudioContext.Provider>
  )
}

/**
 * Hook to access the audio context
 * 
 * @returns {AudioContextType} Player control interface
 * @throws {Error} Error if used outside AudioProvider
 */
export const useAudioPlayer = (): AudioContextType => {
  const context = useContext(AudioContext)
  if (context === undefined) {
    throw new Error('useAudioPlayer must be used within an AudioProvider')
  }
  return context
} 