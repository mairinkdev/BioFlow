'use client'

/**
 * useAudioPlayer.tsx
 * 
 * Hook e provedor de contexto para reprodução de áudio na aplicação.
 * Gerencia estado de reprodução, volume e interface para o player de áudio.
 * 
 * @author BioFlow Team
 * @version 1.0.0
 */

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react'
import ReactHowler from 'react-howler'

// Define a interface do contexto de áudio
interface AudioContextType {
  isPlaying: boolean
  togglePlay: () => void
  volume: number
  setVolume: (volume: number) => void
  currentTrack: string
  changeTrack: (track: string) => void
  tracks: string[]
}

// Lista de faixas disponíveis (apenas uma por enquanto)
const defaultTracks = ['/audio/tore up.mp3']

// Criação do contexto
const AudioContext = createContext<AudioContextType | undefined>(undefined)

/**
 * Provedor de contexto de áudio que encapsula a funcionalidade do player
 * 
 * @param {ReactNode} children - Componentes filhos que terão acesso ao contexto
 */
export const AudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Estado local para controle do player
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [currentTrack, setCurrentTrack] = useState(defaultTracks[0])
  const [tracks] = useState<string[]>(defaultTracks)
  const playerRef = useRef<ReactHowler | null>(null)

  // Alterna entre tocar e pausar
  const togglePlay = () => {
    setIsPlaying((prev) => !prev)
  }

  // Troca a faixa atual (se existir na lista)
  const changeTrack = (track: string) => {
    if (tracks.includes(track)) {
      setCurrentTrack(track)
    }
  }

  // Autoplay com política de permissão do navegador
  // Só inicia após interação do usuário
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
      {/* Componente ReactHowler para reprodução de áudio */}
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
 * Hook para acessar o contexto de áudio
 * 
 * @returns {AudioContextType} Interface de controle do player
 * @throws {Error} Erro se usado fora do AudioProvider
 */
export const useAudioPlayer = (): AudioContextType => {
  const context = useContext(AudioContext)
  if (context === undefined) {
    throw new Error('useAudioPlayer must be used within an AudioProvider')
  }
  return context
} 