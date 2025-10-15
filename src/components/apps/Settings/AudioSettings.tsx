'use client';

import { useState } from 'react';
import { Volume2, VolumeX, Play, Pause, Download } from 'lucide-react';
import { useAudio } from '@/hooks/useAudio';
import AudioVisualizer, { VolumeIndicator } from '@/components/common/AudioVisualizer';
import AudioTestPanel from '@/components/common/AudioTestPanel';
import { generatePlaceholderAudioFiles } from '@/utils/audioGenerator';

export default function AudioSettings() {
  const [isPlayingTest, setIsPlayingTest] = useState(false);
  const [isGeneratingFiles, setIsGeneratingFiles] = useState(false);
  const {
    config,
    setEnabled,
    setVolume,
    setMasterVolume,
    setSystemSounds,
    setAppSounds,
    setNotificationSounds,
    setKeyboardSounds,
    setReducedMotion,
    playSound,
  } = useAudio();

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    // Play a test sound when volume changes
    if (newVolume > 0) {
      playSound('button-click', { volume: newVolume });
    }
  };

  const handleMasterVolumeChange = (newVolume: number) => {
    setMasterVolume(newVolume);
    // Play a test sound when master volume changes
    if (newVolume > 0) {
      playSound('notification', { volume: newVolume });
    }
  };

  const playTestSound = () => {
    if (isPlayingTest) return;
    
    setIsPlayingTest(true);
    playSound('notification', { volume: config.volume * config.masterVolume });
    
    setTimeout(() => {
      setIsPlayingTest(false);
    }, 1000);
  };

  const playSystemTestSound = () => {
    playSound('window-open');
  };

  const playAppTestSound = () => {
    playSound('app-open');
  };

  const playNotificationTestSound = () => {
    playSound('notification-success');
  };

  const playKeyboardTestSound = () => {
    playSound('keyboard-typing');
  };

  const generateAudioFiles = async () => {
    setIsGeneratingFiles(true);
    try {
      await generatePlaceholderAudioFiles();
      // Show success message
      alert('Audio files generated successfully! Check your downloads folder.');
    } catch (error) {
      // Failed to generate audio files
      alert('Failed to generate audio files. Please try again.');
    } finally {
      setIsGeneratingFiles(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Audio Settings</h2>
        <p className="text-gray-600">
          Configure sound effects and audio feedback for your Windows 11 experience.
        </p>
      </div>

      {/* Master Audio Control */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {config.masterVolume > 0 ? (
              <Volume2 className="w-6 h-6 text-blue-600" />
            ) : (
              <VolumeX className="w-6 h-6 text-gray-400" />
            )}
            <h3 className="text-lg font-medium">Master Volume</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {Math.round(config.masterVolume * 100)}%
            </span>
            <button
              onClick={playTestSound}
              disabled={isPlayingTest || config.masterVolume === 0}
              className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isPlayingTest ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
        
        <div className="space-y-3">
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={config.masterVolume}
            onChange={(e) => handleMasterVolumeChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            aria-label="Master volume control"
            title="Master volume control"
          />
          
          {/* Audio Visualizer */}
          <div className="mt-4">
            <AudioVisualizer
              isPlaying={isPlayingTest}
              volume={config.masterVolume}
              frequency={1000}
              className="h-16"
            />
          </div>
          
          {/* Volume Indicator */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Volume Level</span>
            <VolumeIndicator
              volume={config.masterVolume}
              size="md"
              className="w-32"
            />
          </div>
        </div>
      </div>

      {/* Audio Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* System Sounds */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">System Sounds</h3>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.systemSounds}
                onChange={(e) => setSystemSounds(e.target.checked)}
                className="sr-only peer"
                aria-label="Enable system sounds"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Volume</span>
              <span className="text-sm text-gray-600">
                {Math.round(config.volume * 100)}%
              </span>
            </div>
            
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={config.volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              disabled={!config.systemSounds}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider disabled:opacity-50"
              aria-label="System sounds volume control"
              title="System sounds volume control"
            />
            
            <button
              onClick={playSystemTestSound}
              disabled={!config.systemSounds || !config.enabled}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Test System Sound
            </button>
          </div>
        </div>

        {/* App Sounds */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">App Sounds</h3>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.appSounds}
                onChange={(e) => setAppSounds(e.target.checked)}
                className="sr-only peer"
                aria-label="Enable app sounds"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <button
            onClick={playAppTestSound}
            disabled={!config.appSounds || !config.enabled}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Test App Sound
          </button>
        </div>

        {/* Notification Sounds */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Notification Sounds</h3>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.notificationSounds}
                onChange={(e) => setNotificationSounds(e.target.checked)}
                className="sr-only peer"
                aria-label="Enable notification sounds"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <button
            onClick={playNotificationTestSound}
            disabled={!config.notificationSounds || !config.enabled}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Test Notification Sound
          </button>
        </div>

        {/* Keyboard Sounds */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Keyboard Sounds</h3>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.keyboardSounds}
                onChange={(e) => setKeyboardSounds(e.target.checked)}
                className="sr-only peer"
                aria-label="Enable keyboard sounds"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <button
            onClick={playKeyboardTestSound}
            disabled={!config.keyboardSounds || !config.enabled}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Test Keyboard Sound
          </button>
        </div>
      </div>

      {/* Global Audio Settings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium mb-4">Global Audio Settings</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Enable Audio</h4>
              <p className="text-sm text-gray-600">Enable or disable all audio feedback</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                className="sr-only peer"
                aria-label="Enable audio"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Reduced Motion</h4>
              <p className="text-sm text-gray-600">Disable audio when motion is reduced</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.reducedMotion}
                onChange={(e) => setReducedMotion(e.target.checked)}
                className="sr-only peer"
                aria-label="Enable reduced motion"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Sound Effects List */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium mb-4">Available Sound Effects</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            'window-open',
            'window-close',
            'window-minimize',
            'window-maximize',
            'notification-success',
            'notification-error',
            'notification-warning',
            'button-click',
            'button-hover',
            'start-menu-open',
            'start-menu-close',
            'system-boot',
          ].map((soundId) => (
            <button
              key={soundId}
              onClick={() => playSound(soundId)}
              disabled={!config.enabled}
              className="p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="font-medium text-sm capitalize">
                {soundId.replace('-', ' ')}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Audio File Management */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium mb-4">Audio File Management</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Generate Placeholder Audio Files</h4>
              <p className="text-sm text-gray-600">
                Generate WAV files for all system sounds for testing and development
              </p>
            </div>
            <button
              onClick={generateAudioFiles}
              disabled={isGeneratingFiles}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Download className="w-4 h-4" />
              {isGeneratingFiles ? 'Generating...' : 'Generate Files'}
            </button>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h5 className="font-medium text-blue-900 mb-2">Audio File Instructions</h5>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Click &quot;Generate Files&quot; to download placeholder WAV files</li>
              <li>Place the downloaded files in the appropriate directories:</li>
              <li className="ml-4 mt-1 space-y-1">
                <ul className="list-disc list-inside">
                  <li><code>public/sounds/system/</code> - Window and system sounds</li>
                  <li><code>public/sounds/notifications/</code> - Notification sounds</li>
                  <li><code>public/sounds/ui/</code> - UI interaction sounds</li>
                  <li><code>public/sounds/system-boot/</code> - Boot/shutdown sounds</li>
                </ul>
              </li>
              <li>Replace with real Windows 11 sounds for authentic experience</li>
              <li>Ensure file names match the expected naming convention</li>
            </ol>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h5 className="font-medium text-yellow-900 mb-2">Download Sources</h5>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• <strong>Microsoft Store:</strong> Search for &quot;Windows 11 System Sounds&quot;</li>
              <li>• <strong>Freesound.org:</strong> High-quality free system sounds</li>
              <li>• <strong>Zapsplat.com:</strong> Professional audio library</li>
              <li>• <strong>Adobe Audition:</strong> Built-in system sounds</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Audio Test Panel */}
      <AudioTestPanel className="mt-6" />
    </div>
  );
}
