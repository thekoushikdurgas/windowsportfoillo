'use client';

import React, { useEffect, useRef } from 'react';
import { ConversationMessage } from '@/services/geminiLiveService';

interface TranscriptionDisplayProps {
  messages: ConversationMessage[];
  currentTranscription: string;
  className?: string;
}

export const TranscriptionDisplay: React.FC<TranscriptionDisplayProps> = ({
  messages,
  currentTranscription,
  className = ''
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, currentTranscription]);

  const formatTime = (timestamp: Date): string => {
    return timestamp.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getMessageIcon = (source: 'user' | 'assistant'): string => {
    return source === 'user' ? '👤' : '🤖';
  };

  const getMessageStyles = (source: 'user' | 'assistant'): string => {
    const baseStyles = 'p-3 rounded-lg mb-2 max-w-[80%] break-words';
    
    if (source === 'user') {
      return `${baseStyles} bg-blue-100 dark:bg-blue-900/30 ml-auto text-right`;
    } else {
      return `${baseStyles} bg-gray-100 dark:bg-gray-800/50 mr-auto text-left`;
    }
  };

  return (
    <div className={`flex-1 overflow-y-auto p-4 space-y-2 ${className}`}>
      <div ref={scrollRef} className="h-full space-y-2">
        {messages.length === 0 && !currentTranscription && (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <div className="text-4xl mb-2">🎤</div>
              <p>Start speaking to begin the conversation</p>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.source === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-2 ${message.source === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm">
                {getMessageIcon(message.source)}
              </div>
              <div className="flex flex-col">
                <div className={getMessageStyles(message.source)}>
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  {message.isPartial && (
                    <div className="flex items-center mt-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2"></div>
                      <span className="text-xs text-gray-500">Typing...</span>
                    </div>
                  )}
                </div>
                <div className={`text-xs text-gray-400 mt-1 ${message.source === 'user' ? 'text-right' : 'text-left'}`}>
                  {formatTime(message.timestamp)}
                  {message.confidence && (
                    <span className="ml-2">
                      ({Math.round(message.confidence * 100)}%)
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {currentTranscription && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center text-sm">
                👤
              </div>
              <div className="flex flex-col">
                <div className="p-3 rounded-lg mb-2 max-w-[80%] break-words bg-blue-50 dark:bg-blue-900/20 mr-auto text-left border-2 border-dashed border-blue-300 dark:border-blue-700">
                  <p className="text-sm leading-relaxed text-blue-700 dark:text-blue-300">
                    {currentTranscription}
                  </p>
                  <div className="flex items-center mt-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2"></div>
                    <span className="text-xs text-blue-500">Listening...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
