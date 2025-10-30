'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Palette, 
  Sun, 
  Moon, 
  Sparkles, 
  Copy,
  Trash2,
  Edit3,
  Check
} from 'lucide-react';
import { useTheme } from '@/components/providers/ThemeProvider';

export function ThemeSwitcher() {
  const { theme, setTheme, themes, presets, createFromPreset, duplicateTheme, deleteTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [copiedTheme, setCopiedTheme] = useState<string | null>(null);

  const handlePresetClick = (presetId: string) => {
    const themeId = createFromPreset(presetId);
    if (themeId) {
      setTheme(themeId);
    }
  };

  const handleDuplicate = (themeId: string) => {
    duplicateTheme(themeId);
  };

  const handleDelete = (themeId: string) => {
    if (themeId !== 'default') {
      deleteTheme(themeId);
    }
  };

  const copyThemeId = (themeId: string) => {
    navigator.clipboard.writeText(themeId);
    setCopiedTheme(themeId);
    setTimeout(() => setCopiedTheme(null), 2000);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="h-10 w-10 rounded-lg hover:bg-white/10 transition-all duration-200"
        aria-label="Theme Switcher"
      >
        <Palette className="w-5 h-5" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-96 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 rounded-xl shadow-2xl z-50 p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                Themes
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 rounded-lg hover:bg-white/10"
              >
                ×
              </Button>
            </div>

            {/* Preset Themes */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Sun className="w-4 h-4" />
                Preset Themes
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {presets.map((preset) => (
                  <Card
                    key={preset.id}
                    variant="glass"
                    className="cursor-pointer hover:scale-105 transition-all duration-200"
                    onClick={() => handlePresetClick(preset.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {preset.name}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {preset.description}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <div 
                            className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: preset.colors.primary }}
                          />
                          <div 
                            className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: preset.colors.secondary }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Custom Themes */}
            {themes.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Moon className="w-4 h-4" />
                  Custom Themes
                </h4>
                <div className="space-y-2">
                  {themes.map((customTheme) => (
                    <Card
                      key={customTheme.id}
                      variant={customTheme.id === theme.id ? "elevated" : "glass"}
                      className="cursor-pointer hover:scale-105 transition-all duration-200"
                      onClick={() => setTheme(customTheme.id)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex gap-1">
                              <div 
                                className="w-3 h-3 rounded-full border border-white shadow-sm"
                                style={{ backgroundColor: customTheme.colors.primary }}
                              />
                              <div 
                                className="w-3 h-3 rounded-full border border-white shadow-sm"
                                style={{ backgroundColor: customTheme.colors.secondary }}
                              />
                              <div 
                                className="w-3 h-3 rounded-full border border-white shadow-sm"
                                style={{ backgroundColor: customTheme.colors.accent }}
                              />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {customTheme.name}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {customTheme.type}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {customTheme.id === theme.id && (
                              <Badge variant="success" size="sm">
                                <Check className="w-3 h-3 mr-1" />
                                Active
                              </Badge>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyThemeId(customTheme.id);
                              }}
                              className="h-6 w-6 rounded"
                            >
                              {copiedTheme === customTheme.id ? (
                                <Check className="w-3 h-3 text-green-500" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDuplicate(customTheme.id);
                              }}
                              className="h-6 w-6 rounded"
                            >
                              <Edit3 className="w-3 h-3" />
                            </Button>
                            {customTheme.id !== 'default' && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(customTheme.id);
                                }}
                                className="h-6 w-6 rounded text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
