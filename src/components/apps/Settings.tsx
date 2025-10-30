'use client';

import { useState, useMemo } from 'react';
import { useSettingsStore } from '@/store/settingsStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { wallpapers } from '@/lib/wallpapers';
import Image from 'next/image';
import { 
  Search, 
  Download, 
  Upload, 
  RotateCcw, 
  Palette, 
  Volume2, 
  Shield, 
  Eye, 
  Zap, 
  Wifi, 
  User, 
  Settings as SettingsIcon,
  Monitor,
  Type,
  Layout,
  Sun,
  Moon,
  Computer,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function Settings() {
  const {
    appearance,
    sound,
    privacy,
    accessibility,
    performance,
    network,
    account,
    system,
    updateAppearance,
    updateSound,
    updatePrivacy,
    updateAccessibility,
    updatePerformance,
    updateNetwork,
    updateAccount,
    updateSystem,
    resetSettings,
    exportSettings,
    importSettings,
  } = useSettingsStore();

  const [activeTab, setActiveTab] = useState('appearance');
  const [searchQuery, setSearchQuery] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const filteredWallpapers = useMemo(() => {
    if (!searchQuery) return wallpapers;
    return wallpapers.filter(wp => 
      wp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wp.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleExport = () => {
    const settings = exportSettings();
    const blob = new Blob([settings], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'durgasos-settings.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (importSettings(content)) {
          setHasUnsavedChanges(false);
        }
      };
      reader.readAsText(file);
    }
  };

  const settingsSections = [
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'sound', label: 'Sound', icon: Volume2 },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'accessibility', label: 'Accessibility', icon: Eye },
    { id: 'performance', label: 'Performance', icon: Zap },
    { id: 'network', label: 'Network', icon: Wifi },
    { id: 'account', label: 'Account', icon: User },
    { id: 'system', label: 'System', icon: SettingsIcon },
  ];

  return (
    <div className="h-full bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Settings
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Customize your DurgasOS experience
            </p>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search settings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {settingsSections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveTab(section.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === section.id
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-3" />
                  {section.label}
                </button>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="mt-8 space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <label className="w-full">
              <Button
                variant="outline"
                size="sm"
                className="w-full cursor-pointer"
                asChild
              >
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  Import
                </span>
              </Button>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
            <Button
              variant="outline"
              size="sm"
              onClick={resetSettings}
              className="w-full"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Palette className="w-5 h-5 mr-2" />
                      Theme & Colors
                    </CardTitle>
                    <CardDescription>
                      Customize the visual appearance of your system
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label className="text-base font-medium">Theme</Label>
                      <div className="flex gap-2 mt-2">
                        <Button
                          variant={appearance.theme === 'light' ? 'default' : 'outline'}
                          onClick={() => updateAppearance({ theme: 'light' })}
                          className="flex items-center"
                        >
                          <Sun className="w-4 h-4 mr-2" />
                          Light
                        </Button>
                        <Button
                          variant={appearance.theme === 'dark' ? 'default' : 'outline'}
                          onClick={() => updateAppearance({ theme: 'dark' })}
                          className="flex items-center"
                        >
                          <Moon className="w-4 h-4 mr-2" />
                          Dark
                        </Button>
                        <Button
                          variant={appearance.theme === 'auto' ? 'default' : 'outline'}
                          onClick={() => updateAppearance({ theme: 'auto' })}
                          className="flex items-center"
                        >
                          <Computer className="w-4 h-4 mr-2" />
                          Auto
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label className="text-base font-medium">Accent Color</Label>
                      <div className="grid grid-cols-4 gap-2 mt-2">
                        {(['blue', 'green', 'orange', 'pink', 'purple', 'red', 'yellow', 'indigo'] as const).map((color) => (
                          <Button
                            key={color}
                            variant={appearance.accentColor === color ? 'default' : 'outline'}
                            onClick={() => updateAppearance({ accentColor: color })}
                            className="capitalize"
                          >
                            {color}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Type className="w-5 h-5 mr-2" />
                      Typography
                    </CardTitle>
                    <CardDescription>
                      Customize fonts and text appearance
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="font-family">Font Family</Label>
                        <Select
                          value={appearance.fontFamily}
                          onValueChange={(value) => updateAppearance({ fontFamily: value as 'inter' | 'roboto' | 'system' | 'mono' })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="system">System Default</SelectItem>
                            <SelectItem value="inter">Inter</SelectItem>
                            <SelectItem value="roboto">Roboto</SelectItem>
                            <SelectItem value="open-sans">Open Sans</SelectItem>
                            <SelectItem value="lato">Lato</SelectItem>
                            <SelectItem value="poppins">Poppins</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="font-size">Font Size: {appearance.fontSize}px</Label>
                        <Slider
                          id="font-size"
                          min={12}
                          max={24}
                          step={1}
                          value={[appearance.fontSize]}
                          onValueChange={([value]) => {
                            if (value !== undefined) {
                              updateAppearance({ fontSize: value });
                            }
                          }}
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="font-weight">Font Weight: {appearance.fontWeight}</Label>
                        <Slider
                          id="font-weight"
                          min={300}
                          max={700}
                          step={100}
                          value={[appearance.fontWeight]}
                          onValueChange={([value]) => {
                            if (value !== undefined) {
                              updateAppearance({ fontWeight: value });
                            }
                          }}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="line-height">Line Height: {appearance.lineHeight}</Label>
                        <Slider
                          id="line-height"
                          min={1.0}
                          max={2.0}
                          step={0.1}
                          value={[appearance.lineHeight]}
                          onValueChange={([value]) => {
                            if (value !== undefined) {
                              updateAppearance({ lineHeight: value });
                            }
                          }}
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="density">Density</Label>
                      <Select
                        value={appearance.density}
                        onValueChange={(value) => updateAppearance({ density: value as 'compact' | 'comfortable' | 'spacious' })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="compact">Compact</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="comfortable">Comfortable</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Monitor className="w-5 h-5 mr-2" />
                      Wallpaper
                    </CardTitle>
                    <CardDescription>
                      Choose your desktop background
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {filteredWallpapers.map((wp) => (
                        <button
                          key={wp.id}
                          onClick={() => updateAppearance({ wallpaper: wp.id })}
                          className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                            appearance.wallpaper === wp.id 
                              ? 'border-blue-500 ring-2 ring-blue-200' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Image
                            src={wp.imageUrl}
                            alt={wp.name}
                            fill
                            className="object-cover"
                            data-ai-hint={wp.imageHint}
                          />
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {wp.name}
                            </span>
                          </div>
                          {appearance.wallpaper === wp.id && (
                            <div className="absolute top-2 right-2">
                              <CheckCircle className="w-5 h-5 text-blue-500" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Layout className="w-5 h-5 mr-2" />
                      Visual Effects
                    </CardTitle>
                    <CardDescription>
                      Customize visual effects and animations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="animations">Animations</Label>
                        <p className="text-sm text-gray-500">Enable smooth animations</p>
                      </div>
                      <Switch
                        id="animations"
                        checked={appearance.animations}
                        onCheckedChange={(checked) => updateAppearance({ animations: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="transitions">Transitions</Label>
                        <p className="text-sm text-gray-500">Enable smooth transitions</p>
                      </div>
                      <Switch
                        id="transitions"
                        checked={appearance.transitions}
                        onCheckedChange={(checked) => updateAppearance({ transitions: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="transparency">Transparency</Label>
                        <p className="text-sm text-gray-500">Enable transparent effects</p>
                      </div>
                      <Switch
                        id="transparency"
                        checked={appearance.transparency}
                        onCheckedChange={(checked) => updateAppearance({ transparency: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="blur-effects">Blur Effects</Label>
                        <p className="text-sm text-gray-500">Enable blur effects</p>
                      </div>
                      <Switch
                        id="blur-effects"
                        checked={appearance.blurEffects}
                        onCheckedChange={(checked) => updateAppearance({ blurEffects: checked })}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Sound Settings */}
            {activeTab === 'sound' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Volume2 className="w-5 h-5 mr-2" />
                      Audio Settings
                    </CardTitle>
                    <CardDescription>
                      Configure system audio and notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="sound-enabled">Sound Enabled</Label>
                        <p className="text-sm text-gray-500">Enable system sounds</p>
                      </div>
                      <Switch
                        id="sound-enabled"
                        checked={sound.enabled}
                        onCheckedChange={(checked) => updateSound({ enabled: checked })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="volume">Master Volume: {sound.volume}%</Label>
                      <Slider
                        id="volume"
                        min={0}
                        max={100}
                        step={5}
                        value={[sound.volume]}
                        onValueChange={([value]) => {
                          if (value !== undefined) {
                            updateSound({ volume: value });
                          }
                        }}
                        className="mt-2"
                        disabled={!sound.enabled}
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="system-sounds">System Sounds</Label>
                          <p className="text-sm text-gray-500">Play system notification sounds</p>
                        </div>
                        <Switch
                          id="system-sounds"
                          checked={sound.systemSounds}
                          onCheckedChange={(checked) => updateSound({ systemSounds: checked })}
                          disabled={!sound.enabled}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="notification-sounds">Notification Sounds</Label>
                          <p className="text-sm text-gray-500">Play notification sounds</p>
                        </div>
                        <Switch
                          id="notification-sounds"
                          checked={sound.notificationSounds}
                          onCheckedChange={(checked) => updateSound({ notificationSounds: checked })}
                          disabled={!sound.enabled}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="media-sounds">Media Sounds</Label>
                          <p className="text-sm text-gray-500">Play media sounds</p>
                        </div>
                        <Switch
                          id="media-sounds"
                          checked={sound.mediaSounds}
                          onCheckedChange={(checked) => updateSound({ mediaSounds: checked })}
                          disabled={!sound.enabled}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="sound-theme">Sound Theme</Label>
                      <Select
                        value={sound.soundTheme}
                        onValueChange={(value) => updateSound({ soundTheme: value })}
                        disabled={!sound.enabled}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">Default</SelectItem>
                          <SelectItem value="minimal">Minimal</SelectItem>
                          <SelectItem value="nature">Nature</SelectItem>
                          <SelectItem value="electronic">Electronic</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="do-not-disturb">Do Not Disturb</Label>
                        <p className="text-sm text-gray-500">Silence all notifications</p>
                      </div>
                      <Switch
                        id="do-not-disturb"
                        checked={sound.doNotDisturb}
                        onCheckedChange={(checked) => updateSound({ doNotDisturb: checked })}
                      />
                    </div>

                    {sound.doNotDisturb && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="quiet-start">Quiet Hours Start</Label>
                          <Input
                            id="quiet-start"
                            type="time"
                            value={sound.quietHours.start}
                            onChange={(e) => updateSound({ 
                              quietHours: { ...sound.quietHours, start: e.target.value }
                            })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="quiet-end">Quiet Hours End</Label>
                          <Input
                            id="quiet-end"
                            type="time"
                            value={sound.quietHours.end}
                            onChange={(e) => updateSound({ 
                              quietHours: { ...sound.quietHours, end: e.target.value }
                            })}
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Privacy Settings */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="w-5 h-5 mr-2" />
                      Privacy & Security
                    </CardTitle>
                    <CardDescription>
                      Control your privacy and data collection settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="analytics">Analytics</Label>
                          <p className="text-sm text-gray-500">Help improve the app by sharing usage data</p>
                        </div>
                        <Switch
                          id="analytics"
                          checked={privacy.analytics}
                          onCheckedChange={(checked) => updatePrivacy({ analytics: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="crash-reporting">Crash Reporting</Label>
                          <p className="text-sm text-gray-500">Automatically send crash reports</p>
                        </div>
                        <Switch
                          id="crash-reporting"
                          checked={privacy.crashReporting}
                          onCheckedChange={(checked) => updatePrivacy({ crashReporting: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="telemetry">Telemetry</Label>
                          <p className="text-sm text-gray-500">Send diagnostic and usage data</p>
                        </div>
                        <Switch
                          id="telemetry"
                          checked={privacy.telemetry}
                          onCheckedChange={(checked) => updatePrivacy({ telemetry: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="data-collection">Data Collection</Label>
                          <p className="text-sm text-gray-500">Allow collection of personal data</p>
                        </div>
                        <Switch
                          id="data-collection"
                          checked={privacy.dataCollection}
                          onCheckedChange={(checked) => updatePrivacy({ dataCollection: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="personalized-ads">Personalized Ads</Label>
                          <p className="text-sm text-gray-500">Show personalized advertisements</p>
                        </div>
                        <Switch
                          id="personalized-ads"
                          checked={privacy.personalizedAds}
                          onCheckedChange={(checked) => updatePrivacy({ personalizedAds: checked })}
                        />
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="text-lg font-medium mb-4">Device Permissions</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="location-services">Location Services</Label>
                            <p className="text-sm text-gray-500">Allow access to your location</p>
                          </div>
                          <Switch
                            id="location-services"
                            checked={privacy.locationServices}
                            onCheckedChange={(checked) => updatePrivacy({ locationServices: checked })}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="camera-access">Camera Access</Label>
                            <p className="text-sm text-gray-500">Allow access to your camera</p>
                          </div>
                          <Switch
                            id="camera-access"
                            checked={privacy.cameraAccess}
                            onCheckedChange={(checked) => updatePrivacy({ cameraAccess: checked })}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="microphone-access">Microphone Access</Label>
                            <p className="text-sm text-gray-500">Allow access to your microphone</p>
                          </div>
                          <Switch
                            id="microphone-access"
                            checked={privacy.microphoneAccess}
                            onCheckedChange={(checked) => updatePrivacy({ microphoneAccess: checked })}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Accessibility Settings */}
            {activeTab === 'accessibility' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Eye className="w-5 h-5 mr-2" />
                      Accessibility Options
                    </CardTitle>
                    <CardDescription>
                      Make the system more accessible and easier to use
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="high-contrast">High Contrast</Label>
                          <p className="text-sm text-gray-500">Increase contrast for better visibility</p>
                        </div>
                        <Switch
                          id="high-contrast"
                          checked={accessibility.highContrast}
                          onCheckedChange={(checked) => updateAccessibility({ highContrast: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="screen-reader">Screen Reader</Label>
                          <p className="text-sm text-gray-500">Enable screen reader support</p>
                        </div>
                        <Switch
                          id="screen-reader"
                          checked={accessibility.screenReader}
                          onCheckedChange={(checked) => updateAccessibility({ screenReader: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="keyboard-navigation">Keyboard Navigation</Label>
                          <p className="text-sm text-gray-500">Enable keyboard navigation support</p>
                        </div>
                        <Switch
                          id="keyboard-navigation"
                          checked={accessibility.keyboardNavigation}
                          onCheckedChange={(checked) => updateAccessibility({ keyboardNavigation: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="voice-control">Voice Control</Label>
                          <p className="text-sm text-gray-500">Enable voice control features</p>
                        </div>
                        <Switch
                          id="voice-control"
                          checked={accessibility.voiceControl}
                          onCheckedChange={(checked) => updateAccessibility({ voiceControl: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="reduced-motion">Reduced Motion</Label>
                          <p className="text-sm text-gray-500">Reduce animations and motion effects</p>
                        </div>
                        <Switch
                          id="reduced-motion"
                          checked={accessibility.reducedMotion}
                          onCheckedChange={(checked) => updateAccessibility({ reducedMotion: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="large-text">Large Text</Label>
                          <p className="text-sm text-gray-500">Use larger text throughout the interface</p>
                        </div>
                        <Switch
                          id="large-text"
                          checked={accessibility.largeText}
                          onCheckedChange={(checked) => updateAccessibility({ largeText: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="color-blind-support">Color Blind Support</Label>
                          <p className="text-sm text-gray-500">Optimize colors for color blindness</p>
                        </div>
                        <Switch
                          id="color-blind-support"
                          checked={accessibility.colorBlindSupport}
                          onCheckedChange={(checked) => updateAccessibility({ colorBlindSupport: checked })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="magnification">Magnification: {accessibility.magnification}%</Label>
                      <Slider
                        id="magnification"
                        min={100}
                        max={300}
                        step={25}
                        value={[accessibility.magnification]}
                        onValueChange={([value]) => {
                          if (value !== undefined) {
                            updateAccessibility({ magnification: value });
                          }
                        }}
                        className="mt-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Performance Settings */}
            {activeTab === 'performance' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Zap className="w-5 h-5 mr-2" />
                      Performance Settings
                    </CardTitle>
                    <CardDescription>
                      Optimize system performance and resource usage
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="animations">Animations</Label>
                          <p className="text-sm text-gray-500">Enable smooth animations</p>
                        </div>
                        <Switch
                          id="animations"
                          checked={performance.animations}
                          onCheckedChange={(checked) => updatePerformance({ animations: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="transparency">Transparency</Label>
                          <p className="text-sm text-gray-500">Enable transparent effects</p>
                        </div>
                        <Switch
                          id="transparency"
                          checked={performance.transparency}
                          onCheckedChange={(checked) => updatePerformance({ transparency: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="blur-effects">Blur Effects</Label>
                          <p className="text-sm text-gray-500">Enable blur effects</p>
                        </div>
                        <Switch
                          id="blur-effects"
                          checked={performance.blurEffects}
                          onCheckedChange={(checked) => updatePerformance({ blurEffects: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="hardware-acceleration">Hardware Acceleration</Label>
                          <p className="text-sm text-gray-500">Use hardware acceleration when available</p>
                        </div>
                        <Switch
                          id="hardware-acceleration"
                          checked={performance.hardwareAcceleration}
                          onCheckedChange={(checked) => updatePerformance({ hardwareAcceleration: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="background-refresh">Background Refresh</Label>
                          <p className="text-sm text-gray-500">Allow background app refresh</p>
                        </div>
                        <Switch
                          id="background-refresh"
                          checked={performance.backgroundRefresh}
                          onCheckedChange={(checked) => updatePerformance({ backgroundRefresh: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="auto-optimization">Auto Optimization</Label>
                          <p className="text-sm text-gray-500">Automatically optimize performance</p>
                        </div>
                        <Switch
                          id="auto-optimization"
                          checked={performance.autoOptimization}
                          onCheckedChange={(checked) => updatePerformance({ autoOptimization: checked })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="memory-limit">Memory Limit: {performance.memoryLimit}MB</Label>
                        <Slider
                          id="memory-limit"
                          min={512}
                          max={4096}
                          step={256}
                          value={[performance.memoryLimit]}
                          onValueChange={([value]) => {
                            if (value !== undefined) {
                              updatePerformance({ memoryLimit: value });
                            }
                          }}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="cache-size">Cache Size: {performance.cacheSize}MB</Label>
                        <Slider
                          id="cache-size"
                          min={64}
                          max={1024}
                          step={64}
                          value={[performance.cacheSize]}
                          onValueChange={([value]) => {
                            if (value !== undefined) {
                              updatePerformance({ cacheSize: value });
                            }
                          }}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Network Settings */}
            {activeTab === 'network' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Wifi className="w-5 h-5 mr-2" />
                      Network Configuration
                    </CardTitle>
                    <CardDescription>
                      Configure network and connection settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="proxy-enabled">Proxy Enabled</Label>
                          <p className="text-sm text-gray-500">Use a proxy server for connections</p>
                        </div>
                        <Switch
                          id="proxy-enabled"
                          checked={network.proxyEnabled}
                          onCheckedChange={(checked) => updateNetwork({ proxyEnabled: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="data-saver">Data Saver</Label>
                          <p className="text-sm text-gray-500">Reduce data usage</p>
                        </div>
                        <Switch
                          id="data-saver"
                          checked={network.dataSaver}
                          onCheckedChange={(checked) => updateNetwork({ dataSaver: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="offline-mode">Offline Mode</Label>
                          <p className="text-sm text-gray-500">Work offline when possible</p>
                        </div>
                        <Switch
                          id="offline-mode"
                          checked={network.offlineMode}
                          onCheckedChange={(checked) => updateNetwork({ offlineMode: checked })}
                        />
                      </div>
                    </div>

                    {network.proxyEnabled && (
                      <div className="space-y-4 border-t pt-6">
                        <h3 className="text-lg font-medium">Proxy Settings</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="proxy-host">Proxy Host</Label>
                            <Input
                              id="proxy-host"
                              value={network.proxyHost}
                              onChange={(e) => updateNetwork({ proxyHost: e.target.value })}
                              placeholder="proxy.example.com"
                            />
                          </div>
                          <div>
                            <Label htmlFor="proxy-port">Proxy Port</Label>
                            <Input
                              id="proxy-port"
                              type="number"
                              value={network.proxyPort}
                              onChange={(e) => updateNetwork({ proxyPort: parseInt(e.target.value) || 8080 })}
                              placeholder="8080"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="proxy-auth">Proxy Authentication</Label>
                            <p className="text-sm text-gray-500">Require authentication for proxy</p>
                          </div>
                          <Switch
                            id="proxy-auth"
                            checked={network.proxyAuth}
                            onCheckedChange={(checked) => updateNetwork({ proxyAuth: checked })}
                          />
                        </div>

                        {network.proxyAuth && (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="proxy-username">Username</Label>
                              <Input
                                id="proxy-username"
                                value={network.proxyUsername}
                                onChange={(e) => updateNetwork({ proxyUsername: e.target.value })}
                                placeholder="username"
                              />
                            </div>
                            <div>
                              <Label htmlFor="proxy-password">Password</Label>
                              <Input
                                id="proxy-password"
                                type="password"
                                value={network.proxyPassword}
                                onChange={(e) => updateNetwork({ proxyPassword: e.target.value })}
                                placeholder="password"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div>
                      <Label htmlFor="bandwidth-limit">Bandwidth Limit: {network.bandwidthLimit}Mbps</Label>
                      <Slider
                        id="bandwidth-limit"
                        min={0}
                        max={1000}
                        step={50}
                        value={[network.bandwidthLimit]}
                        onValueChange={([value]) => updateNetwork({ bandwidthLimit: value as number })}
                        className="mt-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Account Settings */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      Account Management
                    </CardTitle>
                    <CardDescription>
                      Manage your account and profile settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        {account.profilePicture ? (
                          <Image
                            src={account.profilePicture}
                            alt="Profile"
                            width={64}
                            height={64}
                            className="rounded-full"
                          />
                        ) : (
                          <User className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">{account.profileName}</h3>
                        <p className="text-sm text-gray-500">{account.email || 'No email set'}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="profile-name">Profile Name</Label>
                        <Input
                          id="profile-name"
                          value={account.profileName}
                          onChange={(e) => updateAccount({ profileName: e.target.value })}
                          placeholder="Enter your name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={account.email}
                          onChange={(e) => updateAccount({ email: e.target.value })}
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="sync-enabled">Sync Enabled</Label>
                          <p className="text-sm text-gray-500">Sync settings across devices</p>
                        </div>
                        <Switch
                          id="sync-enabled"
                          checked={account.syncEnabled}
                          onCheckedChange={(checked) => updateAccount({ syncEnabled: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="two-factor-auth">Two-Factor Authentication</Label>
                          <p className="text-sm text-gray-500">Add an extra layer of security</p>
                        </div>
                        <Switch
                          id="two-factor-auth"
                          checked={account.twoFactorAuth}
                          onCheckedChange={(checked) => updateAccount({ twoFactorAuth: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="auto-logout">Auto Logout</Label>
                          <p className="text-sm text-gray-500">Automatically log out after inactivity</p>
                        </div>
                        <Switch
                          id="auto-logout"
                          checked={account.autoLogout}
                          onCheckedChange={(checked) => updateAccount({ autoLogout: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="data-backup">Data Backup</Label>
                          <p className="text-sm text-gray-500">Automatically backup your data</p>
                        </div>
                        <Switch
                          id="data-backup"
                          checked={account.dataBackup}
                          onCheckedChange={(checked) => updateAccount({ dataBackup: checked })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="session-timeout">Session Timeout: {account.sessionTimeout} minutes</Label>
                      <Slider
                        id="session-timeout"
                        min={5}
                        max={120}
                        step={5}
                        value={[account.sessionTimeout]}
                        onValueChange={([value]) => updateAccount({ sessionTimeout: value as number })}
                        className="mt-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* System Settings */}
            {activeTab === 'system' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <SettingsIcon className="w-5 h-5 mr-2" />
                      System Configuration
                    </CardTitle>
                    <CardDescription>
                      Configure system-wide settings and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="language">Language</Label>
                        <Select
                          value={system.language}
                          onValueChange={(value) => updateSystem({ language: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                            <SelectItem value="ja">Japanese</SelectItem>
                            <SelectItem value="ko">Korean</SelectItem>
                            <SelectItem value="zh">Chinese</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select
                          value={system.timezone}
                          onValueChange={(value) => updateSystem({ timezone: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="UTC">UTC</SelectItem>
                            <SelectItem value="America/New_York">Eastern Time</SelectItem>
                            <SelectItem value="America/Chicago">Central Time</SelectItem>
                            <SelectItem value="America/Denver">Mountain Time</SelectItem>
                            <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                            <SelectItem value="Europe/London">London</SelectItem>
                            <SelectItem value="Europe/Paris">Paris</SelectItem>
                            <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="date-format">Date Format</Label>
                        <Select
                          value={system.dateFormat}
                          onValueChange={(value) => updateSystem({ dateFormat: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                            <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                            <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                            <SelectItem value="DD MMM YYYY">DD MMM YYYY</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="time-format">Time Format</Label>
                        <Select
                          value={system.timeFormat}
                          onValueChange={(value) => updateSystem({ timeFormat: value as '12h' | '24h' })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="12h">12 Hour</SelectItem>
                            <SelectItem value="24h">24 Hour</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="auto-updates">Auto Updates</Label>
                          <p className="text-sm text-gray-500">Automatically download and install updates</p>
                        </div>
                        <Switch
                          id="auto-updates"
                          checked={system.autoUpdates}
                          onCheckedChange={(checked) => updateSystem({ autoUpdates: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="developer-mode">Developer Mode</Label>
                          <p className="text-sm text-gray-500">Enable developer features and debugging</p>
                        </div>
                        <Switch
                          id="developer-mode"
                          checked={system.developerMode}
                          onCheckedChange={(checked) => updateSystem({ developerMode: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="debug-mode">Debug Mode</Label>
                          <p className="text-sm text-gray-500">Enable detailed logging and debugging</p>
                        </div>
                        <Switch
                          id="debug-mode"
                          checked={system.debugMode}
                          onCheckedChange={(checked) => updateSystem({ debugMode: checked })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="log-level">Log Level</Label>
                      <Select
                        value={system.logLevel}
                        onValueChange={(value) => updateSystem({ logLevel: value as 'debug' | 'info' | 'warn' | 'error' })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="error">Error</SelectItem>
                          <SelectItem value="warn">Warning</SelectItem>
                          <SelectItem value="info">Info</SelectItem>
                          <SelectItem value="debug">Debug</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>System Information</CardTitle>
                    <CardDescription>
                      Current system version and framework details
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">OS Version:</span>
                        <span className="ml-2 text-gray-600 dark:text-gray-400">DurgasOS 1.0.0</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Framework:</span>
                        <span className="ml-2 text-gray-600 dark:text-gray-400">Next.js 15.3.3</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">React:</span>
                        <span className="ml-2 text-gray-600 dark:text-gray-400">18.3.1</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">TypeScript:</span>
                        <span className="ml-2 text-gray-600 dark:text-gray-400">5.x</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Build Date:</span>
                        <span className="ml-2 text-gray-600 dark:text-gray-400">{new Date().toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Environment:</span>
                        <span className="ml-2 text-gray-600 dark:text-gray-400">Development</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Status Bar */}
            {hasUnsavedChanges && (
              <div className="fixed bottom-4 right-4 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-4 py-2 rounded-lg shadow-lg flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                You have unsaved changes
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
