'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  Settings, 
  List,
  Shuffle,
  Repeat
} from 'lucide-react';

interface VideoPlayerProps {
  data?: {
    url?: string;
  };
}

interface VideoItem {
  id: string;
  title: string;
  url: string;
  thumbnail?: string;
  duration: number;
  format: string;
  quality: VideoQuality[];
  subtitles?: SubtitleTrack[];
}

interface VideoQuality {
  label: string;
  value: string;
  resolution: string;
  bitrate: number;
}

interface SubtitleTrack {
  id: string;
  label: string;
  language: string;
  url: string;
  default: boolean;
}

export default function VideoPlayer({ data }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState<string>('auto');
  const [showControls, setShowControls] = useState(true);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('none');
  const [shuffleMode, setShuffleMode] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // Sample playlist data
  const [playlist] = useState<VideoItem[]>([
    {
      id: '1',
      title: 'Big Buck Bunny',
      url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      duration: 596,
      format: 'mp4',
      quality: [
        { label: 'Auto', value: 'auto', resolution: 'Auto', bitrate: 0 },
        { label: '1080p', value: '1080p', resolution: '1920x1080', bitrate: 5000 },
        { label: '720p', value: '720p', resolution: '1280x720', bitrate: 3000 },
        { label: '480p', value: '480p', resolution: '854x480', bitrate: 1500 }
      ]
    },
    {
      id: '2',
      title: 'Sintel',
      url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      duration: 888,
      format: 'mp4',
      quality: [
        { label: 'Auto', value: 'auto', resolution: 'Auto', bitrate: 0 },
        { label: '1080p', value: '1080p', resolution: '1920x1080', bitrate: 5000 },
        { label: '720p', value: '720p', resolution: '1280x720', bitrate: 3000 }
      ]
    },
    {
      id: '3',
      title: 'Tears of Steel',
      url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      duration: 734,
      format: 'mp4',
      quality: [
        { label: 'Auto', value: 'auto', resolution: 'Auto', bitrate: 0 },
        { label: '1080p', value: '1080p', resolution: '1920x1080', bitrate: 5000 }
      ]
    }
  ]);

  const currentVideo = playlist[currentVideoIndex] || playlist[0];
  const videoUrl = data?.url || currentVideo?.url;

  // Video control functions
  const playVideo = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  }, []);

  const pauseVideo = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pauseVideo();
    } else {
      playVideo();
    }
  }, [isPlaying, playVideo, pauseVideo]);

  const seekTo = useCallback((time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current && videoRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const clickTime = (clickX / width) * duration;
      seekTo(clickTime);
    }
  }, [duration, seekTo]);

  const handleVolumeChange = useCallback((vol: number) => {
    if (videoRef.current) {
      videoRef.current.volume = vol;
      setVolume(vol);
      setIsMuted(vol === 0);
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume;
        setIsMuted(false);
      } else {
        videoRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  }, [isMuted, volume]);

  const handlePlaybackRateChange = useCallback((rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const nextVideo = useCallback(() => {
    if (currentVideoIndex < playlist.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    } else if (repeatMode === 'all') {
      setCurrentVideoIndex(0);
    }
  }, [currentVideoIndex, playlist.length, repeatMode]);

  const previousVideo = useCallback(() => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
    }
  }, [currentVideoIndex]);

  const formatTime = useCallback((time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  // Event handlers
  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsLoading(false);
    }
  }, []);

  const handleLoadStart = useCallback(() => {
    setIsLoading(true);
    setError(null);
  }, []);

  const handleError = useCallback(() => {
    setError('Failed to load video');
    setIsLoading(false);
  }, []);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    if (repeatMode === 'one') {
      seekTo(0);
      playVideo();
    } else {
      nextVideo();
    }
  }, [repeatMode, seekTo, playVideo, nextVideo]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          seekTo(Math.max(0, currentTime - 10));
          break;
        case 'ArrowRight':
          e.preventDefault();
          seekTo(Math.min(duration, currentTime + 10));
          break;
        case 'ArrowUp':
          e.preventDefault();
          handleVolumeChange(Math.min(1, volume + 0.1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleVolumeChange(Math.max(0, volume - 0.1));
          break;
        case 'KeyF':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'KeyM':
          e.preventDefault();
          toggleMute();
          break;
        case 'KeyN':
          e.preventDefault();
          nextVideo();
          break;
        case 'KeyP':
          e.preventDefault();
          previousVideo();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [togglePlayPause, currentTime, duration, volume, toggleFullscreen, toggleMute, nextVideo, previousVideo, handleVolumeChange, seekTo]);

  // Auto-hide controls
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isPlaying) {
      timeout = setTimeout(() => setShowControls(false), 3000);
    } else {
      setShowControls(true);
    }
    return () => clearTimeout(timeout);
  }, [isPlaying]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div className="h-full flex flex-col bg-black text-white relative group">
      {/* Video Container */}
      <div className="flex-1 flex items-center justify-center relative">
        <video
          ref={videoRef}
          className="max-w-full max-h-full"
          src={videoUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onLoadStart={handleLoadStart}
          onError={handleError}
          onEnded={handleEnded}
          onClick={togglePlayPause}
        >
          Your browser does not support the video tag.
        </video>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-center">
              <p className="text-red-400 mb-2">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Video Controls Overlay */}
        {showControls && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={togglePlayPause}
              className="bg-black/50 rounded-full p-4 hover:bg-black/70 transition-colors"
            >
              {isPlaying ? <Pause size={32} /> : <Play size={32} />}
            </button>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        {/* Progress Bar */}
        <div className="mb-4">
          <div
            ref={progressRef}
            className="w-full h-1 bg-gray-600 rounded cursor-pointer hover:h-2 transition-all"
            onClick={handleProgressClick}
          >
            <div
              className="h-full bg-blue-500 rounded"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Play/Pause */}
            <button
              onClick={togglePlayPause}
              className="p-2 hover:bg-white/20 rounded transition-colors"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>

            {/* Previous/Next */}
            <button
              onClick={previousVideo}
              className="p-2 hover:bg-white/20 rounded transition-colors"
              disabled={currentVideoIndex === 0}
              title="Previous video"
              aria-label="Previous video"
            >
              <SkipBack size={20} />
            </button>
            <button
              onClick={nextVideo}
              className="p-2 hover:bg-white/20 rounded transition-colors"
              disabled={currentVideoIndex === playlist.length - 1 && repeatMode !== 'all'}
              title="Next video"
              aria-label="Next video"
            >
              <SkipForward size={20} />
            </button>

            {/* Volume */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="p-2 hover:bg-white/20 rounded transition-colors"
                title={isMuted ? "Unmute" : "Mute"}
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-20"
                title="Volume control"
                aria-label="Volume control"
              />
            </div>

            {/* Time Display */}
            <span className="text-sm text-gray-300">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Repeat Mode */}
            <button
              onClick={() => setRepeatMode(repeatMode === 'none' ? 'all' : repeatMode === 'all' ? 'one' : 'none')}
              className={`p-2 hover:bg-white/20 rounded transition-colors ${repeatMode !== 'none' ? 'text-blue-400' : ''}`}
              title={`Repeat mode: ${repeatMode}`}
              aria-label={`Repeat mode: ${repeatMode}`}
            >
              <Repeat size={20} />
            </button>

            {/* Shuffle */}
            <button
              onClick={() => setShuffleMode(!shuffleMode)}
              className={`p-2 hover:bg-white/20 rounded transition-colors ${shuffleMode ? 'text-blue-400' : ''}`}
              title={shuffleMode ? "Disable shuffle" : "Enable shuffle"}
              aria-label={shuffleMode ? "Disable shuffle" : "Enable shuffle"}
            >
              <Shuffle size={20} />
            </button>

            {/* Playlist */}
            <button
              onClick={() => setShowPlaylist(!showPlaylist)}
              className="p-2 hover:bg-white/20 rounded transition-colors"
              title={showPlaylist ? "Hide playlist" : "Show playlist"}
              aria-label={showPlaylist ? "Hide playlist" : "Show playlist"}
            >
              <List size={20} />
            </button>

            {/* Settings */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-white/20 rounded transition-colors"
              title={showSettings ? "Hide settings" : "Show settings"}
              aria-label={showSettings ? "Hide settings" : "Show settings"}
            >
              <Settings size={20} />
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-2 hover:bg-white/20 rounded transition-colors"
              title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Playlist Sidebar */}
      {showPlaylist && (
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-black/90 backdrop-blur-sm border-l border-gray-700 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Playlist</h3>
            <div className="space-y-2">
              {playlist.map((video, index) => (
                <div
                  key={video.id}
                  onClick={() => setCurrentVideoIndex(index)}
                  className={`p-3 rounded cursor-pointer transition-colors ${
                    index === currentVideoIndex
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-8 bg-gray-600 rounded flex items-center justify-center">
                      {index === currentVideoIndex && isPlaying ? <Pause size={16} /> : <Play size={16} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{video.title}</p>
                      <p className="text-sm text-gray-400">{formatTime(video.duration)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-black/90 backdrop-blur-sm border-l border-gray-700 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Settings</h3>
            
            {/* Playback Speed */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Playback Speed</label>
              <select
                value={playbackRate}
                onChange={(e) => handlePlaybackRateChange(parseFloat(e.target.value))}
                className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
                title="Playback speed selection"
                aria-label="Playback speed selection"
              >
                <option value={0.25}>0.25x</option>
                <option value={0.5}>0.5x</option>
                <option value={0.75}>0.75x</option>
                <option value={1}>1x</option>
                <option value={1.25}>1.25x</option>
                <option value={1.5}>1.5x</option>
                <option value={2}>2x</option>
              </select>
            </div>

            {/* Quality Selection */}
            {currentVideo?.quality && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Quality</label>
                <select
                  value={selectedQuality}
                  onChange={(e) => setSelectedQuality(e.target.value)}
                  className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
                  title="Video quality selection"
                  aria-label="Video quality selection"
                >
                  {currentVideo.quality.map((quality) => (
                    <option key={quality.value} value={quality.value}>
                      {quality.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Video Effects */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Video Effects</label>
              <div className="space-y-2">
                <div>
                  <label htmlFor="brightness-slider" className="block text-xs text-gray-400 mb-1">Brightness</label>
                  <input
                    id="brightness-slider"
                    type="range"
                    min="0"
                    max="200"
                    defaultValue="100"
                    className="w-full"
                    title="Brightness control"
                    aria-label="Brightness control"
                  />
                </div>
                <div>
                  <label htmlFor="contrast-slider" className="block text-xs text-gray-400 mb-1">Contrast</label>
                  <input
                    id="contrast-slider"
                    type="range"
                    min="0"
                    max="200"
                    defaultValue="100"
                    className="w-full"
                    title="Contrast control"
                    aria-label="Contrast control"
                  />
                </div>
                <div>
                  <label htmlFor="saturation-slider" className="block text-xs text-gray-400 mb-1">Saturation</label>
                  <input
                    id="saturation-slider"
                    type="range"
                    min="0"
                    max="200"
                    defaultValue="100"
                    className="w-full"
                    title="Saturation control"
                    aria-label="Saturation control"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
