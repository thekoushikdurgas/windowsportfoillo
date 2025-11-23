import React, { useState, useRef, useEffect } from 'react';
import { WindowProps, ChatMessage } from '../../types';
import { generateChatResponse, transcribeAudio } from '../../services/geminiService';
import { Send, Bot, User, Loader2, Search, Mic, Square } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useNotification } from '../../contexts/NotificationContext';

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
  
  // Voice Input State
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Track active state for async callbacks
  const isActiveRef = useRef(isActive);
  useEffect(() => { isActiveRef.current = isActive; }, [isActive]);

  // Theme Styles
  const bg = isDarkMode ? 'bg-[#202020]' : 'bg-white';
  const text = isDarkMode ? 'text-white' : 'text-gray-900';
  const inputBg = isDarkMode ? 'bg-[#2b2b2b] border-[#444]' : 'bg-gray-100 border-gray-300';
  const footerBg = isDarkMode ? 'bg-[#1a1a1a] border-[#333]' : 'bg-gray-50 border-gray-200';
  const messageUserBg = `bg-${accentColor.tailwind}`;
  const messageModelBg = isDarkMode ? 'bg-[#333]' : 'bg-gray-200';
  const messageModelText = isDarkMode ? 'text-white' : 'text-gray-900';

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Auto-resize textarea
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

    // Reset height
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

      // Trigger notification if window is not active
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
      // Stop recording
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        setIsTranscribing(true);
      }
    } else {
      // Start recording
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
          // Stop all audio tracks to release mic
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
    <div className={`flex flex-col h-full ${bg} ${text} font-sans`}>
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl p-3 ${msg.role === 'user' ? `${messageUserBg} text-white` : `${messageModelBg} ${messageModelText}`}`}>
              <div className="flex items-center gap-2 mb-1 opacity-70 text-xs">
                {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                <span>{msg.role === 'user' ? 'You' : 'Gemini'}</span>
              </div>
              <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</div>
              
              {/* Grounding Sources */}
              {msg.groundingMetadata?.groundingChunks && (
                <div className={`mt-2 pt-2 border-t ${isDarkMode ? 'border-white/10' : 'border-black/10'} text-xs`}>
                  <p className="font-semibold mb-1 flex items-center gap-1"><Search size={10}/> Sources:</p>
                  <div className="flex flex-wrap gap-2">
                    {msg.groundingMetadata.groundingChunks.map((chunk: any, i: number) => {
                      if (chunk.web?.uri) {
                        return <a key={i} href={chunk.web.uri} target="_blank" rel="noreferrer" className={`hover:underline truncate max-w-[150px] block px-2 py-1 rounded ${isDarkMode ? 'bg-black/20 text-blue-400' : 'bg-white/50 text-blue-600'}`}>{chunk.web.title || chunk.web.uri}</a>;
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
           <div className="flex justify-start">
             <div className={`${messageModelBg} rounded-2xl p-3 flex items-center gap-2`}>
               <Loader2 className={`animate-spin ${messageModelText}`} size={16} />
               <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{useThinking ? "Thinking deeply..." : "Generating..."}</span>
             </div>
           </div>
        )}
      </div>

      <div className={`p-3 border-t ${footerBg}`}>
        <div className="flex gap-2 mb-2 text-xs">
          <button 
            onClick={() => setUseThinking(!useThinking)}
            className={`px-2 py-1 rounded border ${useThinking ? 'bg-purple-600 border-purple-500 text-white' : `${isDarkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-200'}`}`}
          >
            Thinking Mode {useThinking ? 'ON' : 'OFF'}
          </button>
          <button 
            onClick={() => setUseGrounding(!useGrounding)}
            className={`px-2 py-1 rounded border ${useGrounding ? 'bg-green-600 border-green-500 text-white' : `${isDarkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-200'}`}`}
          >
            Google Grounding {useGrounding ? 'ON' : 'OFF'}
          </button>
        </div>
        <div className="flex gap-2 items-end">
           <button
             onClick={handleMicClick}
             disabled={isTranscribing}
             className={`p-2 h-10 w-10 flex items-center justify-center rounded-lg border transition-all shrink-0 ${
               isRecording 
                 ? 'bg-red-500 border-red-500 text-white animate-pulse' 
                 : isTranscribing
                   ? 'bg-transparent border-transparent text-gray-400 cursor-wait'
                   : `${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-600'} border-transparent`
             }`}
             title={isRecording ? "Stop Recording" : "Voice Input"}
           >
             {isTranscribing ? <Loader2 size={18} className="animate-spin" /> : isRecording ? <Square size={18} fill="currentColor" /> : <Mic size={18} />}
           </button>
          
          <textarea
            ref={textareaRef}
            rows={1}
            className={`flex-1 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500 ${inputBg} resize-none overflow-hidden min-h-[40px] max-h-[150px]`}
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
            className={`bg-${accentColor.tailwind} h-10 w-10 flex items-center justify-center hover:opacity-90 rounded-lg transition-colors text-white disabled:opacity-50 shrink-0`} 
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