import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Maximize2, Sparkles, Sliders, CheckCircle2 } from 'lucide-react';
import { Lecture } from '../types';
import { motion } from 'motion/react';

interface VideoPlayerProps {
  lecture: Lecture;
  onComplete: () => void;
}

export default function VideoPlayer({ lecture, onComplete }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  
  // Total duration parsed to seconds for simulation
  const durationInSeconds = parseDurationToSeconds(lecture.duration);
  const progressPercent = (currentTime / durationInSeconds) * 100;
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  function parseDurationToSeconds(durationStr: string): number {
    const parts = durationStr.split(':').map(Number);
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    }
    return 600; // default 10 mins
  }

  function formatTime(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hrs > 0) {
      return `${hrs}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  // Handle simulation timer
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 1 * playbackSpeed;
          if (next >= durationInSeconds) {
            setIsPlaying(false);
            onComplete();
            return durationInSeconds;
          }
          return next;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackSpeed, durationInSeconds]);

  // Reset player state when lecture changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
  }, [lecture]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = () => setIsMuted(!isMuted);
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newPercent = clickX / width;
    setCurrentTime(Math.floor(newPercent * durationInSeconds));
  };

  const handleSpeedSelect = (speed: number) => {
    setPlaybackSpeed(speed);
    setShowSpeedMenu(false);
  };

  const speeds = [0.5, 1.0, 1.25, 1.5, 2.0];

  return (
    <div id="video-player-container" className="relative bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl aspect-video group">
      {/* Background Graphic & Backdrop */}
      <img 
        src={lecture.videoUrl} 
        alt={lecture.title} 
        className={`w-full h-full object-cover transition-all duration-700 ${isPlaying ? 'scale-105 brightness-[0.35]' : 'scale-100 brightness-[0.5]'}`}
      />

      {/* Physics Interactive Glowing Animation Effect (Simulating Real Lectures) */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950 opacity-80 pointer-events-none" />
      
      {isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 rounded-full border border-cyan-500/35 bg-cyan-500/10 animate-ping absolute" />
          <div className="w-32 h-32 rounded-full border border-cyan-500/10 bg-cyan-500/5 animate-pulse absolute" />
        </div>
      )}

      {/* Speed Multiplier Overlay Notice */}
      <div className="absolute top-4 left-4 flex items-center space-x-2 pointer-events-none">
        <span className="bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-mono font-medium text-cyan-400 border border-slate-700/50 shadow-lg flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          {playbackSpeed === 1.0 ? 'Normal Speed' : `${playbackSpeed}x Turbo`}
        </span>
        <span className="bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-medium text-slate-300 border border-slate-700/50 shadow-lg">
          1080p FHD
        </span>
      </div>

      {/* Center Big Play Button Overlay */}
      {!isPlaying && (
        <button 
          id="btn-center-play"
          onClick={togglePlay}
          className="absolute inset-0 m-auto w-16 h-16 flex items-center justify-center rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all duration-300 shadow-[0_0_30px_rgba(6,182,212,0.5)] transform hover:scale-110 active:scale-95"
        >
          <Play className="w-8 h-8 fill-slate-950 stroke-slate-950 translate-x-0.5" />
        </button>
      )}

      {/* Overlay Warning of Completion */}
      {currentTime >= durationInSeconds && (
        <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center text-center p-6 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <CheckCircle2 className="w-16 h-16 text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.4)]" />
            <h3 className="text-xl font-bold text-white">Lecture Completed!</h3>
            <p className="text-sm text-slate-400 max-w-sm">Great job! This lecture has been marked as completed. You can re-watch or move to the next session.</p>
            <button 
              onClick={() => setCurrentTime(0)}
              className="mt-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs px-4 py-2 rounded-xl flex items-center gap-2 transition"
            >
              <RotateCcw className="w-4 h-4" /> Rewatch Lecture
            </button>
          </motion.div>
        </div>
      )}

      {/* Custom Video Control Overlay */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-4 flex flex-col gap-3 opacity-95 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        
        {/* Progress Timeline Scrubber */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-400 min-w-[40px]">{formatTime(currentTime)}</span>
          <div 
            id="timeline-scrubber"
            onClick={handleProgressClick}
            className="flex-1 h-1.5 bg-slate-800 rounded-full cursor-pointer relative overflow-hidden group/timeline"
          >
            <div className="absolute top-0 left-0 h-full bg-slate-700 w-full" />
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-100" 
              style={{ width: `${progressPercent}%` }}
            />
            {/* Pulsing playhead handle */}
            <div 
              className="absolute top-0 h-3 w-3 -mt-[3px] bg-white rounded-full border-2 border-cyan-500 opacity-0 group-hover/timeline:opacity-100 transition-opacity pointer-events-none"
              style={{ left: `calc(${progressPercent}% - 6px)` }}
            />
          </div>
          <span className="text-xs font-mono text-slate-400 min-w-[40px]">{lecture.duration}</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Play/Pause */}
            <button 
              id="btn-video-play-pause"
              onClick={togglePlay}
              className="p-1 text-slate-300 hover:text-white transition transform hover:scale-110"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            </button>

            {/* Volume Control */}
            <div className="flex items-center space-x-2">
              <button onClick={toggleMute} className="text-slate-300 hover:text-white transition">
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={isMuted ? 0 : volume} 
                onChange={(e) => {
                  setVolume(Number(e.target.value));
                  if (isMuted) setIsMuted(false);
                }}
                className="w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
              />
            </div>

            {/* Lecture title */}
            <div className="hidden md:block">
              <p className="text-xs text-slate-300 font-medium line-clamp-1">{lecture.title}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 relative">
            {/* Speed Controller Trigger */}
            <div className="relative">
              <button 
                id="btn-video-speed-menu"
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className="bg-slate-900/90 border border-slate-700/80 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg text-xs font-mono flex items-center gap-1 cursor-pointer transition active:scale-95"
              >
                <Sliders className="w-3 h-3 text-cyan-400" />
                {playbackSpeed}x
              </button>

              {showSpeedMenu && (
                <div className="absolute bottom-10 right-0 bg-slate-900 border border-slate-800 rounded-xl p-1.5 shadow-2xl min-w-[100px] z-50 flex flex-col gap-1">
                  <div className="text-[10px] text-slate-500 px-2 py-1 font-sans border-b border-slate-800 uppercase tracking-wider font-semibold">Speed Controls</div>
                  {speeds.map((sp) => (
                    <button
                      key={sp}
                      onClick={() => handleSpeedSelect(sp)}
                      className={`w-full text-left text-xs font-mono px-2 py-1.5 rounded-lg transition ${playbackSpeed === sp ? 'bg-cyan-500/10 text-cyan-400 font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                      {sp === 1.0 ? '1.0x (Normal)' : `${sp}x`}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Maximize Icon */}
            <button 
              onClick={() => setIsFullscreen(!isFullscreen)} 
              className="p-1 text-slate-300 hover:text-white transition"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
