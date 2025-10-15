'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Volume2, VolumeX, Music, Zap } from 'lucide-react';
import { useAudio } from '@/hooks/useAudio';
import AudioVisualizer from './AudioVisualizer';

interface AudioTestPanelProps {
  className?: string;
}

export default function AudioTestPanel({ className = '' }: AudioTestPanelProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSound, setCurrentSound] = useState<string>('');
  const { config, playSound } = useAudio();

  const testSounds = [
    { id: 'window-open', name: 'Window Open', category: 'system' },
    { id: 'window-close', name: 'Window Close', category: 'system' },
    { id: 'button-click', name: 'Button Click', category: 'ui' },
    { id: 'notification-success', name: 'Success', category: 'notification' },
    { id: 'notification-error', name: 'Error', category: 'notification' },
    { id: 'start-menu-open', name: 'Start Menu', category: 'system' },
    { id: 'system-boot', name: 'System Boot', category: 'system' },
  ];

  const playTestSound = (soundId: string, _soundName: string) => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    setCurrentSound(soundId);
    playSound(soundId);
    
    setTimeout(() => {
      setIsPlaying(false);
      setCurrentSound('');
    }, 1000);
  };

  const playAllSounds = () => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    let currentIndex = 0;
    
    const playNext = () => {
      if (currentIndex >= testSounds.length) {
        setIsPlaying(false);
        setCurrentSound('');
        return;
      }
      
      const sound = testSounds[currentIndex];
      setCurrentSound(sound.id);
      playSound(sound.id);
      
      currentIndex++;
      setTimeout(playNext, 1200);
    };
    
    playNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
          <Music className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Audio Test Panel
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Test audio feedback and visualizations
          </p>
        </div>
      </div>

      {/* Audio Status */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Audio Status
          </span>
          <div className="flex items-center gap-2">
            {config.enabled ? (
              <Volume2 className="w-4 h-4 text-green-600" />
            ) : (
              <VolumeX className="w-4 h-4 text-red-600" />
            )}
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {config.enabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>
        
        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <div>Master Volume: {Math.round(config.masterVolume * 100)}%</div>
          <div>System Sounds: {config.systemSounds ? 'On' : 'Off'}</div>
          <div>Notifications: {config.notificationSounds ? 'On' : 'Off'}</div>
        </div>
      </div>

      {/* Audio Visualizer */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Live Audio Visualization
        </h4>
        <AudioVisualizer
          isPlaying={isPlaying}
          volume={config.masterVolume}
          frequency={1000}
          className="h-20"
        />
      </div>

      {/* Test Controls */}
      <div className="space-y-4">
        <div className="flex gap-3">
          <button
            onClick={playAllSounds}
            disabled={isPlaying || !config.enabled}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Zap className="w-4 h-4" />
            Play All Sounds
          </button>
          
          <div className="flex-1 text-sm text-gray-600 dark:text-gray-400 flex items-center">
            {isPlaying && currentSound && (
              <span>Playing: {testSounds.find(s => s.id === currentSound)?.name}</span>
            )}
          </div>
        </div>

        {/* Individual Sound Tests */}
        <div className="grid grid-cols-2 gap-2">
          {testSounds.map((sound) => (
            <button
              key={sound.id}
              onClick={() => playTestSound(sound.id, sound.name)}
              disabled={isPlaying || !config.enabled}
              className={`p-3 text-left rounded-lg transition-all ${
                currentSound === sound.id
                  ? 'bg-blue-100 dark:bg-blue-900 border-2 border-blue-300 dark:border-blue-700'
                  : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="flex items-center gap-2">
                <Play className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {sound.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {sound.category}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h5 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
          How to Use
        </h5>
        <ul className="text-xs text-blue-800 dark:text-blue-400 space-y-1 list-disc list-inside">
          <li>Click individual sound buttons to test specific audio effects</li>
          <li>Use &quot;Play All Sounds&quot; to test the complete audio sequence</li>
          <li>Watch the visualization to see audio feedback in real-time</li>
          <li>Check audio settings if sounds are not playing</li>
        </ul>
      </div>
    </motion.div>
  );
}
