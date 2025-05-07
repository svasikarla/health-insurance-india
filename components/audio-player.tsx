"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface AudioPlayerProps {
  audioSrc: string
  autoPlay?: boolean
}

export function AudioPlayer({ audioSrc, autoPlay = false }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(0.75)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio(audioSrc)
    audioRef.current = audio

    // Set up event listeners
    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration)
    })

    audio.addEventListener("timeupdate", () => {
      setCurrentTime(audio.currentTime)
    })

    audio.addEventListener("ended", () => {
      setIsPlaying(false)
      setCurrentTime(0)
    })

    // Set initial volume
    audio.volume = volume

    // Auto-play if enabled
    if (autoPlay) {
      audio.play().catch((error) => {
        console.error("Auto-play failed:", error)
      })
      setIsPlaying(true)
    }

    // Clean up event listeners on unmount
    return () => {
      audio.pause()
      audio.src = ""
      audio.removeEventListener("loadedmetadata", () => {})
      audio.removeEventListener("timeupdate", () => {})
      audio.removeEventListener("ended", () => {})
    }
  }, [audioSrc, autoPlay, volume])

  // Handle play/pause
  const togglePlayPause = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch((error) => {
        console.error("Play failed:", error)
      })
    }

    setIsPlaying(!isPlaying)
  }

  // Handle mute toggle
  const toggleMute = () => {
    if (!audioRef.current) return

    audioRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    if (!audioRef.current) return

    audioRef.current.volume = newVolume
    setVolume(newVolume)

    // If volume is set to 0, mute the audio
    if (newVolume === 0) {
      audioRef.current.muted = true
      setIsMuted(true)
    } else if (isMuted) {
      // If volume is increased from 0, unmute
      audioRef.current.muted = false
      setIsMuted(false)
    }
  }

  // Format time (seconds) to MM:SS
  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00"
    
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="flex items-center space-x-2 bg-muted/50 p-2 rounded-md">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={togglePlayPause}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>
      
      <div className="text-xs w-16 text-muted-foreground">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
      
      <div className="flex items-center space-x-2 flex-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
        
        <Slider
          className="w-24"
          defaultValue={[0.75]}
          max={1}
          step={0.01}
          value={[volume]}
          onValueChange={handleVolumeChange}
          aria-label="Volume"
        />
      </div>
    </div>
  )
}
