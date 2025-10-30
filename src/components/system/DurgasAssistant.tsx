'use client';

import { useDurgasAssistant } from '@/hooks/use-durgas-assistant';
import { Mic, Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function DurgasAssistant() {
  const { isAssistantOpen, assistantState } = useDurgasAssistant();

  if (!isAssistantOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <Card className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-xl border border-white/20 rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl hover:scale-105 transition-all duration-200">
        <CardContent className="p-0 flex flex-col items-center gap-6">
          <div className="relative">
            <div className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 border-2",
              assistantState === 'listening' && "bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-400 shadow-lg shadow-green-500/25",
              assistantState === 'thinking' && "bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-yellow-400 shadow-lg shadow-yellow-500/25",
              assistantState === 'speaking' && "bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-400 shadow-lg shadow-blue-500/25",
              assistantState === 'idle' && "bg-gradient-to-br from-neutral-600/20 to-neutral-700/20 border-neutral-400"
            )}>
              {assistantState === 'thinking' ? (
                <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
              ) : (
                <Mic className={cn(
                  "w-8 h-8",
                  assistantState === 'listening' && "text-green-400 animate-pulse",
                  assistantState === 'speaking' && "text-blue-400 animate-pulse",
                  assistantState === 'idle' && "text-neutral-400"
                )} />
              )}
            </div>
            <Badge 
              variant="secondary" 
              className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0"
            >
              <Sparkles className="w-3 h-3 mr-1" />
              AI
            </Badge>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Durgas Assistant
            </h3>
            <p className="text-sm text-gray-300 font-medium">
              {assistantState === 'listening' && "🎤 Listening... Speak now"}
              {assistantState === 'thinking' && "🧠 Processing your request..."}
              {assistantState === 'speaking' && "🔊 Speaking..."}
              {assistantState === 'idle' && "✨ Ready to help"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
