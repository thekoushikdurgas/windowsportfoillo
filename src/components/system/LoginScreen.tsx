'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Wifi, 
  WifiOff, 
  Volume2, 
  VolumeX,
  Battery,
  BatteryCharging,
  Settings,
  Power,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { getMicaStyles, MICA_VARIANTS } from '@/utils/mica';
import { useSystemStore } from '@/store/systemStore';

interface LoginScreenProps {
  isVisible: boolean;
  onLogin: () => void;
}

interface UserAccount {
  name: string;
  email: string;
  avatar: string;
  isActive: boolean;
  lastLogin: Date;
}

const mockUser: UserAccount = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: '👨‍💻',
  isActive: true,
  lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
};

export default function LoginScreen({ isVisible, onLogin }: LoginScreenProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const { bootSystem, volume } = useSystemStore();
  
  // Mock system status for login screen
  const systemStatus = {
    wifi: true,
    volume: volume,
    charging: true,
    battery: 85
  };

  const handleLogin = useCallback(async () => {
    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simple password check (in real app, this would be secure authentication)
    if (password === 'password' || password === 'admin' || password === '123456') {
      bootSystem();
      onLogin();
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }

    setIsLoading(false);
  }, [password, bootSystem, onLogin]);

  useEffect(() => {
    if (isVisible) {
      const timer = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isVisible]);

  useEffect(() => {
    if (isVisible) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter' && password) {
          handleLogin();
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isVisible, password, handleLogin]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) setError('');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getSystemIcon = (type: string) => {
    switch (type) {
      case 'wifi':
        return systemStatus.wifi ? (
          <Wifi className="w-5 h-5" />
        ) : (
          <WifiOff className="w-5 h-5" />
        );
      case 'volume':
        return systemStatus.volume > 0 ? (
          <Volume2 className="w-5 h-5" />
        ) : (
          <VolumeX className="w-5 h-5" />
        );
      case 'battery':
        return systemStatus.charging ? (
          <BatteryCharging className="w-5 h-5" />
        ) : (
          <Battery className="w-5 h-5" />
        );
      default:
        return null;
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999]"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}
        </div>

        {/* System Status Bar */}
        <div className="absolute top-0 left-0 right-0 z-10">
          <motion.div
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-between p-4"
            style={getMicaStyles(MICA_VARIANTS.taskbar)}
          >
            <div className="flex items-center gap-4 text-white">
              <div className="flex items-center gap-2">
                {getSystemIcon('wifi')}
                <span className="text-sm">Home Network</span>
              </div>
              <div className="flex items-center gap-2">
                {getSystemIcon('volume')}
                <span className="text-sm">{systemStatus.volume}%</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-white">
              <div className="flex items-center gap-2">
                {getSystemIcon('battery')}
                <span className="text-sm">{systemStatus.battery}%</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">
                  {currentTime.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
                <div className="text-xs opacity-80">
                  {currentTime.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Login Content */}
        <div className="flex items-center justify-center min-h-screen p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="w-full max-w-md"
          >
            {/* Login Card */}
            <div
              className="rounded-3xl p-8 shadow-2xl border border-white/20"
              style={getMicaStyles(MICA_VARIANTS.panel)}
            >
              {/* User Avatar */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="text-center mb-8"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl shadow-xl">
                  {mockUser.avatar}
                </div>
                <h1 className="text-2xl font-semibold text-gray-800 mb-1">
                  {mockUser.name}
                </h1>
                <p className="text-gray-600 text-sm">
                  {mockUser.email}
                </p>
              </motion.div>

              {/* Password Input */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.4 }}
                className="space-y-4"
              >
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/90 backdrop-blur-sm"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-red-600 text-sm"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </motion.div>
                )}

                {/* Login Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogin}
                  disabled={isLoading || !password.trim()}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-purple-700 shadow-lg flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </motion.div>

              {/* Additional Options */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.4 }}
                className="mt-6 flex items-center justify-between text-sm"
              >
                <button className="text-gray-600 hover:text-gray-800 transition-colors">
                  Forgot password?
                </button>
                <button className="text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-1">
                  <Settings className="w-4 h-4" />
                  Sign-in options
                </button>
              </motion.div>
            </div>

            {/* Bottom Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.4 }}
              className="flex items-center justify-center gap-4 mt-8"
            >
              <button className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                <Power className="w-5 h-5" />
                <span className="text-sm">Shut down</span>
              </button>
              <div className="w-px h-4 bg-white/30" />
              <button className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                <Settings className="w-5 h-5" />
                <span className="text-sm">Accessibility</span>
              </button>
              <div className="w-px h-4 bg-white/30" />
              <button className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                <Wifi className="w-5 h-5" />
                <span className="text-sm">Network</span>
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Windows 11 Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="flex items-center gap-2 text-white/60">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <div className="grid grid-cols-2 gap-0.5">
                <div className="w-3 h-3 bg-white rounded-sm"></div>
                <div className="w-3 h-3 bg-white rounded-sm"></div>
                <div className="w-3 h-3 bg-white rounded-sm"></div>
                <div className="w-3 h-3 bg-white rounded-sm"></div>
              </div>
            </div>
            <span className="text-sm font-medium">Windows 11</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
