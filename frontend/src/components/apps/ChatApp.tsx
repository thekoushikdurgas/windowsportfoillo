'use client';

import React, { useState, useRef, useEffect } from 'react';
import { WindowProps, ChatMessage } from '@/types';
import { generateChatResponse, transcribeAudio } from '@/services/geminiService';
import { Send, Bot, User, Loader2, Search, Mic, Square } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useNotification } from '@/context/NotificationContext';
import { cn } from '@/lib/utils/cn';

const ChatApp: React.FC<WindowProps> = ({ isActive }) => {
  const { isDarkMode, accentColor } = useTheme();
  const { addNotification } = useNotification();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'system', text: 'Welcome to DurgasOS Copilot. Powered by Gemini 3.0 Pro.', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useThinking, setUseThinking] = useState(false);
  const [useGrounding, setUseGrounding] = useState(true);
  
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isActiveRef = useRef(isActive);
  useEffect(() => { isActiveRef.current = isActive; }, [isActive]);


  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      const history = messages.filter(m => m.role !== 'system').map(m => ({ role: m.role, text: m.text }));
      const response = await generateChatResponse(history, userMsg.text, 'gemini-3-pro-preview', useThinking, useGrounding);
      
      const responseText = response.text || "I couldn't generate a text response.";
      setMessages(prev => [...prev, {
        role: 'model',
        text: responseText,
        timestamp: Date.now(),
        groundingMetadata: response.groundingMetadata
      }]);

      if (!isActiveRef.current) {
          addNotification({
              title: 'Copilot',
              message: responseText,
              appName: 'Copilot',
              icon: <Bot size={16} />,
              duration: 5000
          });
      }

    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Error connecting to Gemini.", timestamp: Date.now() }]);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicClick = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        setIsTranscribing(true);
      }
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          stream.getTracks().forEach(track => track.stop());

          const mimeType = mediaRecorder.mimeType || 'audio/webm';
          const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
          
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
             const base64String = (reader.result as string).split(',')[1];
             try {
                const transcribedText = await transcribeAudio(base64String, mimeType);
                if (transcribedText) {
                    setInput(prev => (prev ? prev + ' ' : '') + transcribedText.trim());
                }
             } catch (err) {
                 console.error('Transcription error:', err);
                 addNotification({
                     title: 'Transcription Failed',
                     message: 'Could not convert audio to text.',
                     appName: 'Copilot',
                     icon: <Mic size={16} />,
                     duration: 4000
                 });
             } finally {
                 setIsTranscribing(false);
             }
          };
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (err) {
         console.error('Mic access error:', err);
         addNotification({
             title: 'Microphone Error',
             message: 'Could not access microphone. Please check permissions.',
             appName: 'Copilot',
             icon: <Mic size={16} />,
             duration: 4000
         });
      }
    }
  };

  return (
    <div className="chat-container" data-theme={isDarkMode ? 'dark' : 'light'}>
      <div className="chat-messages" ref={scrollRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={cn('chat-message-wrapper', msg.role === 'user' ? 'chat-message-wrapper-user' : 'chat-message-wrapper-model')}>
            <div className={cn('chat-message', msg.role === 'user' ? 'chat-message-user' : 'chat-message-model')}>
              <div className="chat-message-header">
                {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                <span>{msg.role === 'user' ? 'You' : 'Gemini'}</span>
              </div>
              <div className="chat-message-text">{msg.text}</div>
              
              {msg.groundingMetadata?.groundingChunks && (
                <div className="chat-message-sources" data-theme={isDarkMode ? 'dark' : 'light'}>
                  <p className="chat-message-sources-title"><Search size={10}/> Sources:</p>
                  <div className="chat-message-sources-list">
                    {msg.groundingMetadata.groundingChunks.map((chunk, i: number) => {
                      if (chunk.web?.uri) {
                        return <a key={i} href={chunk.web.uri} target="_blank" rel="noreferrer" className="chat-message-source-link">{chunk.web.title || chunk.web.uri}</a>;
                      }
                      return null;
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
           <div className="chat-loading">
             <div className="chat-loading-message">
               <Loader2 className="animate-spin" size={16} />
               <span>{useThinking ? "Thinking deeply..." : "Generating..."}</span>
             </div>
           </div>
        )}
      </div>

      <div className="chat-footer" data-theme={isDarkMode ? 'dark' : 'light'}>
        <div className="chat-footer-controls">
          <button 
            onClick={() => setUseThinking(!useThinking)}
            className={cn('chat-footer-button', useThinking && 'chat-footer-button-active')}
          >
            Thinking Mode {useThinking ? 'ON' : 'OFF'}
          </button>
          <button 
            onClick={() => setUseGrounding(!useGrounding)}
            className={cn('chat-footer-button', useGrounding && 'chat-footer-button-green-active')}
          >
            Google Grounding {useGrounding ? 'ON' : 'OFF'}
          </button>
        </div>
        <div className="chat-footer-input-area">
           <button
             onClick={handleMicClick}
             disabled={isTranscribing}
             className={cn(
               'chat-footer-mic-button',
               isRecording && 'chat-footer-mic-button-recording',
               isTranscribing && 'chat-footer-mic-button-transcribing'
             )}
             title={isRecording ? "Stop Recording" : "Voice Input"}
           >
             {isTranscribing ? <Loader2 size={18} className="animate-spin" /> : isRecording ? <Square size={18} fill="currentColor" /> : <Mic size={18} />}
           </button>
          
          <textarea
            ref={textareaRef}
            rows={1}
            className="chat-footer-textarea"
            placeholder={isRecording ? "Listening... (Speak now)" : isTranscribing ? "Transcribing audio..." : "Ask anything... (Shift+Enter for new line)"}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={isRecording || isTranscribing}
          />
          
          <button 
            onClick={handleSend} 
            className="chat-footer-send-button"
            style={{ backgroundColor: accentColor.hex }}
            disabled={isLoading || isRecording || isTranscribing}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;

