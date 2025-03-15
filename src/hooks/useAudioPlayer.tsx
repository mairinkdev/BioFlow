'use client'

/**
 * useAudioPlayer.tsx
 * 
 * Hook and context provider for audio playback in the application.
 * Manages playback state, volume, and interface for the audio player.
 * 
 * @author BioFlow Team
 * @version 1.0.0
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
}

// List of available tracks (only one for now)
const defaultTracks = ['/audio/tore up.mp3']

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
  const playerRef = useRef<ReactHowler | null>(null)

  // Toggle between play and pause
  const togglePlay = () => {
    setIsPlaying((prev) => !prev)
  }

  // Change the current track (if it exists in the list)
  const changeTrack = (track: string) => {
    if (tracks.includes(track)) {
      setCurrentTrack(track)
    }
  }

  // Autoplay with browser permission policy
  // Only starts after user interaction
  useEffect(() => {
    const handleInteraction = () => {
      if (!isPlaying) {
        setIsPlaying(true)
        window.removeEventListener('click', handleInteraction)
      }
    }

    window.addEventListener('click', handleInteraction)
    return () => {
      window.removeEventListener('click', handleInteraction)
    }
  }, [isPlaying])

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