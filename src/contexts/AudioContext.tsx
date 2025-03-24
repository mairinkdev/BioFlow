'use client'

/**
 * AudioContext.tsx
 * 
 * Hook e provider para reprodução de áudio na aplicação.
 * Gerencia estado de reprodução, volume e interface para o player de áudio.
 * 
 * @version 1.4.0
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
  isReady: boolean
}

// Lista de faixas disponíveis (apenas uma por enquanto)
const defaultTracks = ['/audio/chill.mp3']

// Criação do contexto
const AudioContext = createContext<AudioContextType | undefined>(undefined)

/**
 * Provider de contexto de áudio que encapsula a funcionalidade do player
 * 
 * @param {ReactNode} children - Componentes filhos que terão acesso ao contexto
 */
export const AudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Estado local para controle do player
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

  // Mudar a faixa atual (se existir na lista)
  const changeTrack = (track: string) => {
    if (tracks.includes(track)) {
      // Inicializar sistema de áudio se necessário
      if (!audioInitializedRef.current) {
        initAudioSystem();
      }
      
      // Pause antes de mudar a faixa para transição mais suave
      const wasPlaying = isPlaying;
      if (wasPlaying) setIsPlaying(false);
      
      // Adicionar pequeno atraso antes de mudar a faixa
      setTimeout(() => {
        setCurrentTrack(track);
        
        // Retomar a reprodução se estava tocando antes
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
        } catch {
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
 * Hook para acessar o contexto de áudio
 * 
 * @returns {AudioContextType} Interface de controle do player
 * @throws {Error} Erro se usado fora do AudioProvider
 */
export const useAudioPlayer = (): AudioContextType => {
  const context = useContext(AudioContext)
  if (context === undefined) {
    throw new Error('useAudioPlayer deve ser usado dentro de um AudioProvider')
  }
  return context
} 