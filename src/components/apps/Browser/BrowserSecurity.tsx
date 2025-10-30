'use client';

import { useState } from 'react';
import { Shield, ShieldCheck, AlertTriangle, Lock, Eye, EyeOff } from 'lucide-react';
import { useBrowserStore } from '@/store/browserStore';
import { Button } from '@/components/ui/button';
import { TooltipProvider } from '@/components/ui/tooltip';

interface BrowserSecurityProps {
  className?: string;
}

export function BrowserSecurity({ className = '' }: BrowserSecurityProps) {
  const { activeTabId, tabs, settings, updateSettings } = useBrowserStore();
  const [showSecurityDetails, setShowSecurityDetails] = useState(false);

  const activeTab = tabs.find(tab => tab.id === activeTabId);

  if (!activeTab) return null;

  const getSecurityStatus = () => {
    const url = activeTab.url;
    
    if (url.startsWith('https://')) {
      return {
        level: 'secure',
        icon: ShieldCheck,
        color: 'text-green-500',
        bgColor: 'bg-green-100 dark:bg-green-900',
        title: 'Secure Connection',
        description: 'Your connection to this site is encrypted and secure.',
      };
    } else if (url.startsWith('http://')) {
      return {
        level: 'insecure',
        icon: AlertTriangle,
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900',
        title: 'Not Secure',
        description: 'Your connection to this site is not encrypted.',
      };
    } else if (url.startsWith('file://')) {
      return {
        level: 'local',
        icon: Lock,
        color: 'text-blue-500',
        bgColor: 'bg-blue-100 dark:bg-blue-900',
        title: 'Local File',
        description: 'This is a local file on your computer.',
      };
    } else {
      return {
        level: 'unknown',
        icon: Shield,
        color: 'text-gray-500',
        bgColor: 'bg-gray-100 dark:bg-gray-800',
        title: 'Unknown Security',
        description: 'Security status could not be determined.',
      };
    }
  };

  const securityStatus = getSecurityStatus();
  const SecurityIcon = securityStatus.icon;

  const handleTogglePrivateMode = () => {
    updateSettings({ privateMode: !settings.privateMode });
  };

  const handleToggleAdBlocking = () => {
    updateSettings({ blockAds: !settings.blockAds });
  };

  const handleTogglePopupBlocking = () => {
    updateSettings({ blockPopups: !settings.blockPopups });
  };

  const getSecurityRecommendations = () => {
    const recommendations = [];
    
    if (activeTab.url.startsWith('http://')) {
      recommendations.push({
        type: 'warning',
        message: 'This site is not using HTTPS. Consider using a secure version if available.',
      });
    }
    
    if (!settings.blockAds) {
      recommendations.push({
        type: 'info',
        message: 'Ad blocking is disabled. Enable it for better privacy and performance.',
      });
    }
    
    if (!settings.blockPopups) {
      recommendations.push({
        type: 'info',
        message: 'Popup blocking is disabled. Enable it to prevent unwanted popups.',
      });
    }
    
    return recommendations;
  };

  const recommendations = getSecurityRecommendations();

  return (
    <TooltipProvider>
      <div className={`space-y-4 ${className}`}>
        {/* Security Status */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className={`p-2 rounded-full ${securityStatus.bgColor}`}>
            <SecurityIcon className={`h-5 w-5 ${securityStatus.color}`} />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium">{securityStatus.title}</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {securityStatus.description}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSecurityDetails(!showSecurityDetails)}
            className="h-8 w-8 p-0"
          >
            {showSecurityDetails ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Security Details */}
        {showSecurityDetails && (
          <div className="space-y-4">
            {/* Security Settings */}
            <div className="space-y-3">
              <h5 className="text-sm font-medium">Security Settings</h5>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span className="text-sm">Private Mode</span>
                  </div>
                  <Button
                    variant={settings.privateMode ? 'default' : 'outline'}
                    size="sm"
                    onClick={handleTogglePrivateMode}
                    className="h-8 px-3"
                  >
                    {settings.privateMode ? 'On' : 'Off'}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm">Block Ads</span>
                  </div>
                  <Button
                    variant={settings.blockAds ? 'default' : 'outline'}
                    size="sm"
                    onClick={handleToggleAdBlocking}
                    className="h-8 px-3"
                  >
                    {settings.blockAds ? 'On' : 'Off'}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    <span className="text-sm">Block Popups</span>
                  </div>
                  <Button
                    variant={settings.blockPopups ? 'default' : 'outline'}
                    size="sm"
                    onClick={handleTogglePopupBlocking}
                    className="h-8 px-3"
                  >
                    {settings.blockPopups ? 'On' : 'Off'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Security Recommendations */}
            {recommendations.length > 0 && (
              <div className="space-y-3">
                <h5 className="text-sm font-medium">Recommendations</h5>
                <div className="space-y-2">
                  {recommendations.map((rec) => (
                    <div
                      key={`${rec.type}-${rec.message}`}
                      className={`p-2 rounded text-xs ${
                        rec.type === 'warning'
                          ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                          : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                      }`}
                    >
                      {rec.message}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Connection Details */}
            <div className="space-y-3">
              <h5 className="text-sm font-medium">Connection Details</h5>
              <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex justify-between">
                  <span>Protocol:</span>
                  <span className="font-mono">
                    {activeTab.url.startsWith('https://') ? 'HTTPS' : 
                     activeTab.url.startsWith('http://') ? 'HTTP' : 
                     activeTab.url.startsWith('file://') ? 'FILE' : 'UNKNOWN'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>URL:</span>
                  <span className="font-mono truncate ml-2">{activeTab.url}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={securityStatus.color}>
                    {securityStatus.title}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
