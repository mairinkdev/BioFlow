'use client'

/**
 * useAudioPlayer.tsx
 * 
 * Hook and context provider for audio playback in the application.
 * Manages playback state, volume, and interface for the audio player.
 * 
 * @author BioFlow Team
 * @version 1.1.0
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
  const playerRef = useRef<ReactHowler | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)

  // Enhanced toggle play function with state verification
  const togglePlay = () => {
    if (!isReady) return;
    
    try {
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

  // Set up audio context for better mobile performance
  useEffect(() => {
    // Create AudioContext for better mobile support
    if (typeof window !== 'undefined' && !audioContextRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioContextRef.current = new AudioContextClass();
      }
    }
    
    // Mark audio as ready after a short delay
    const readyTimer = setTimeout(() => {
      setIsReady(true);
    }, 300);
    
    return () => {
      clearTimeout(readyTimer);
      // Cleanup audio context
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(e => console.error(e));
      }
    };
  }, []);

  // Autoplay with browser permission policy
  useEffect(() => {
    const handleInteraction = () => {
      // Resume audio context on user interaction (required for mobile)
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume().catch(e => console.error(e));
      }
      
      // Remove event listener after first interaction
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    }

    window.addEventListener('click', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);
    
    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    }
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