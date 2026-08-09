import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Sparkles, ChevronDown, ChevronUp, AlertCircle, FastForward } from 'lucide-react';
import { AudioRecording } from '../types';

interface AudioPlayerWidgetProps {
  recording: AudioRecording;
  compact?: boolean;
}

export const AudioPlayerWidget: React.FC<AudioPlayerWidgetProps> = ({ recording, compact = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  const durationSec = recording.durationSeconds || 240;
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Playback timer simulation
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= durationSec) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1 * playbackSpeed;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, durationSec, playbackSpeed]);

  // Audio synth beep simulation (optional subtle audio output)
  const togglePlay = () => {
    if (!isPlaying) {
      try {
        if (!audioCtxRef.current) {
          audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        }
        if (audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume();
        }
      } catch (e) {
        console.warn('AudioContext not supported or blocked', e);
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTime(Number(e.target.value));
  };

  const cycleSpeed = () => {
    const speeds = [1, 1.25, 1.5, 2];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    setPlaybackSpeed(nextSpeed);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPct = Math.min(100, (currentTime / durationSec) * 100);

  return (
    <div className="bg-slate-900 text-slate-100 rounded-xl p-3 sm:p-4 border border-slate-800 shadow-2xs">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-blue-600/30 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-semibold text-slate-100 truncate">{recording.title}</h4>
            <p className="text-[11px] text-slate-400 flex items-center gap-1">
              <span>{recording.counselorName}</span> • <span>{recording.date}</span>
            </p>
          </div>
        </div>

        {recording.aiObjections && recording.aiObjections.length > 0 && (
          <div className="hidden sm:flex items-center gap-1 text-[11px] font-medium bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded-md border border-amber-500/20 shrink-0">
            <AlertCircle className="w-3 h-3 text-amber-400" />
            <span>{recording.aiObjections.length} Objection{recording.aiObjections.length > 1 ? 's' : ''} Detected</span>
          </div>
        )}
      </div>

      {/* Waveform & Scrubber */}
      <div className="space-y-2">
        <div className="flex items-center gap-1 h-10 px-2 bg-slate-950/60 rounded-lg border border-slate-800/80 overflow-hidden">
          {recording.audioWaveform.map((val, idx) => {
            const barProgress = (idx / recording.audioWaveform.length) * 100;
            const isPassed = barProgress <= progressPct;
            return (
              <div
                key={idx}
                className="flex-1 flex items-center justify-center h-full group relative cursor-pointer"
                onClick={() => setCurrentTime((idx / recording.audioWaveform.length) * durationSec)}
              >
                <div
                  className={`w-full rounded-full transition-all duration-200 ${
                    isPassed
                      ? 'bg-blue-400'
                      : 'bg-slate-700/80 group-hover:bg-slate-500'
                  } ${isPlaying && isPassed && idx % 3 === 0 ? 'animate-pulse' : ''}`}
                  style={{
                    height: `${Math.max(15, val)}%`,
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Controls Bar */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-all shadow-xs active:scale-95 cursor-pointer"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white ml-0.5" />}
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition cursor-pointer"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              onClick={cycleSpeed}
              className="px-2 py-0.5 rounded text-xs font-mono font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer flex items-center gap-1"
              title="Change Playback Speed"
            >
              <FastForward className="w-3 h-3 text-blue-400" />
              <span>{playbackSpeed}x</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>{formatTime(currentTime)}</span>
            <span>/</span>
            <span>{recording.duration}</span>
          </div>
        </div>

        {/* Progress Slider Bar */}
        <input
          type="range"
          min={0}
          max={durationSec}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
      </div>

      {/* Transcript Accordion Toggle */}
      {recording.transcript && recording.transcript.length > 0 && !compact && (
        <div className="mt-3 pt-3 border-t border-slate-800">
          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className="w-full flex items-center justify-between text-xs font-medium text-slate-300 hover:text-white transition cursor-pointer py-1"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>AI Call Transcript & Key Objections</span>
              <span className="text-[10px] bg-blue-950 text-blue-300 border border-blue-800 px-1.5 py-0.2 rounded-md font-mono">
                {recording.transcript.length} turns
              </span>
            </span>
            {showTranscript ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showTranscript && (
            <div className="mt-2 space-y-2 max-h-60 overflow-y-auto pr-1 text-xs">
              {recording.transcript.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded border transition-all ${
                    item.isObjection
                      ? 'bg-amber-950/40 border-amber-500/40 text-amber-100'
                      : item.speaker === 'Counselor'
                      ? 'bg-slate-800/60 border-slate-700/60 text-slate-200'
                      : 'bg-blue-950/30 border-blue-800/40 text-blue-100'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1">
                    <span className="font-semibold text-slate-300">{item.speaker}</span>
                    <span>{item.timestamp}</span>
                  </div>
                  <p className="leading-relaxed">{item.text}</p>

                  {item.isObjection && (
                    <div className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-amber-400">
                      <AlertCircle className="w-3 h-3" />
                      <span>AI Tagged Objection: Fee/Timing barrier</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
