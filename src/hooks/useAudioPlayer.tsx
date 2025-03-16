'use client'

/**
 * useAudioPlayer.tsx
 * 
 * Hook and context provider for audio playback in the application.
 * Manages playback state, volume, and interface for the audio player.
 * 
 * @author BioFlow Team
 * @version 1.3.0
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
  const [userInteracted, setUserInteracted] = useState(false)
  const playerRef = useRef<ReactHowler | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const audioContextCreatedRef = useRef<boolean>(false)
  const [audioContextState, setAudioContextState] = useState<string>('');

  // Enhanced toggle play function with state verification
  const togglePlay = () => {
    if (!isReady) return;
    
    try {
      // Criar o AudioContext sob demanda durante a primeira interação
      if (!audioContextCreatedRef.current && !audioContextRef.current) {
        initAudioContext();
        setUserInteracted(true);
      }
      
      // Ensure smooth transition by checking player state
      if (playerRef.current) {
        // If player exists, toggle state
        setIsPlaying((prev) => !prev);
      } else {
        console.warn("Audio player reference not found");
      }
    } catch (error) {
      console.error("Error toggling audio playback:", error);
    }
  }

  // Inicializar o AudioContext
  const initAudioContext = () => {
    if (typeof window === 'undefined' || audioContextRef.current) return;

    try {
      // Definir o tipo para webkitAudioContext
      interface WindowWithWebkitAudio extends Window {
        webkitAudioContext?: typeof AudioContext;
      }
      
      const AudioContextClass = window.AudioContext || (window as WindowWithWebkitAudio).webkitAudioContext;
      if (AudioContextClass) {
        audioContextRef.current = new AudioContextClass();
        audioContextCreatedRef.current = true;
        
        if (audioContextRef.current) {
          setAudioContextState(audioContextRef.current.state);
          
          // Monitorar mudanças de estado do contexto de áudio
          const handleStateChange = () => {
            if (audioContextRef.current) {
              setAudioContextState(audioContextRef.current.state);
            }
          };
          
          // Adicionar ouvinte de estado, se disponível
          if (audioContextRef.current.onstatechange !== undefined) {
            audioContextRef.current.onstatechange = handleStateChange;
          }
        }
      }
    } catch (error) {
      console.error('Error creating AudioContext:', error);
    }
  };

  // Change the current track (if it exists in the list)
  const changeTrack = (track: string) => {
    if (tracks.includes(track)) {
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
  }

  // Detectar interação do usuário para criar o AudioContext
  useEffect(() => {
    const handleUserInteraction = () => {
      if (!userInteracted) {
        setUserInteracted(true);
        
        // Inicializar AudioContext apenas após interação
        if (!audioContextCreatedRef.current) {
          initAudioContext();
        }
        
        // Resume audio context if needed
        if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
          audioContextRef.current.resume()
            .then(() => {
              setAudioContextState(audioContextRef.current?.state || '');
            })
            .catch(e => console.error('Error resuming audio context:', e));
        }
      }
    };

    window.addEventListener('click', handleUserInteraction, { once: true });
    window.addEventListener('touchstart', handleUserInteraction, { once: true });
    window.addEventListener('keydown', handleUserInteraction, { once: true });
    
    // Mark audio as ready after a short delay
    const readyTimer = setTimeout(() => {
      setIsReady(true);
    }, 300);
    
    return () => {
      clearTimeout(readyTimer);
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
      
      // Cleanup apenas se o contexto realmente existir e não estiver fechado
      if (audioContextRef.current) {
        try {
          const currentState = audioContextRef.current.state;
          if (currentState && currentState !== 'closed') {
            audioContextRef.current.close()
              .then(() => {
                audioContextRef.current = null;
                audioContextCreatedRef.current = false;
              })
              .catch(e => {
                console.error('Error closing audio context:', e);
                // Mesmo com erro, definimos referências como null para evitar vazamentos
                audioContextRef.current = null;
                audioContextCreatedRef.current = false;
              });
          } else {
            audioContextRef.current = null;
            audioContextCreatedRef.current = false;
          }
        } catch (error) {
          console.error('Error during audio context cleanup:', error);
          audioContextRef.current = null;
          audioContextCreatedRef.current = false;
        }
      }
    };
  }, [userInteracted]);

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
      {/* ReactHowler component for audio playback */}
      <ReactHowler
        src={currentTrack}
        playing={isPlaying}
        loop={true}
        volume={volume}
        ref={playerRef}
        preload={true}
        html5={true}
        onLoad={() => setIsReady(true)}
        format={['mp3']}
      />
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