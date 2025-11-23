import React, { useState, useEffect, useRef } from 'react';
import { WindowProps } from '../../types';
import { GoogleGenAI, Modality } from '@google/genai';
import { GEMINI_API_KEY, MODELS } from '../../constants';
import { Mic, MicOff, Activity, Volume2 } from 'lucide-react';

// Helper for Audio Context
const AUDIO_RATE = 24000; 

const VoiceApp: React.FC<WindowProps> = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [status, setStatus] = useState('Ready to connect');
  
  // Refs for managing the connection and audio to avoid re-renders clearing them
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const inputSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  
  const nextStartTimeRef = useRef<number>(0);

  const connectLive = async () => {
    try {
      setStatus("Connecting...");
      const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
      
      // Initialize Audio Contexts
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContextClass({ sampleRate: AUDIO_RATE });
      audioContextRef.current = ctx;

      // Get User Media
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Setup Session
      const sessionPromise = ai.live.connect({
        model: MODELS.AUDIO_LIVE,
        config: {
           responseModalities: [Modality.AUDIO],
           speechConfig: {
               voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } }
           }
        },
        callbacks: {
            onopen: () => {
                setStatus("Connected");
                setIsConnected(true);

                // Setup Input Stream
                const source = ctx.createMediaStreamSource(stream);
                const processor = ctx.createScriptProcessor(4096, 1, 1);
                
                processor.onaudioprocess = (e) => {
                    if (isMuted) return;
                    const inputData = e.inputBuffer.getChannelData(0);
                    // Convert Float32 to PCM 16-bit
                    const l = inputData.length;
                    const int16 = new Int16Array(l);
                    for (let i = 0; i < l; i++) {
                        int16[i] = inputData[i] * 32768;
                    }
                    
                    const base64 = btoa(String.fromCharCode(...new Uint8Array(int16.buffer)));
                    
                    sessionPromise.then(session => {
                        session.sendRealtimeInput({
                            media: {
                                mimeType: 'audio/pcm;rate=' + ctx.sampleRate, // usually 44100 or 48000 from mic, but mapped to ctx rate
                                data: base64
                            }
                        });
                    });
                };
                
                source.connect(processor);
                processor.connect(ctx.destination);
                
                inputSourceRef.current = source;
                processorRef.current = processor;
            },
            onmessage: async (msg) => {
                // Handle Audio Output
                const base64Audio = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                if (base64Audio && ctx) {
                    const binaryString = atob(base64Audio);
                    const len = binaryString.length;
                    const bytes = new Uint8Array(len);
                    for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
                    
                    // Decode PCM
                    const dataInt16 = new Int16Array(bytes.buffer);
                    const buffer = ctx.createBuffer(1, dataInt16.length, 24000); // Model output is 24kHz
                    const channelData = buffer.getChannelData(0);
                    for(let i=0; i<dataInt16.length; i++) {
                        channelData[i] = dataInt16[i] / 32768.0;
                    }
                    
                    const source = ctx.createBufferSource();
                    source.buffer = buffer;
                    source.connect(ctx.destination);
                    
                    const now = ctx.currentTime;
                    // Schedule playback
                    const start = Math.max(now, nextStartTimeRef.current);
                    source.start(start);
                    nextStartTimeRef.current = start + buffer.duration;
                }
            },
            onclose: () => {
                setStatus("Disconnected");
                setIsConnected(false);
            },
            onerror: (e) => {
                console.error(e);
                setStatus("Error: " + e.toString());
            }
        }
      });
      
      sessionRef.current = sessionPromise;

    } catch (err) {
        console.error(err);
        setStatus("Failed to connect: " + (err as Error).message);
    }
  };

  const disconnect = () => {
     if (sessionRef.current) {
         sessionRef.current.then((s: any) => s.close());
     }
     if (streamRef.current) {
         streamRef.current.getTracks().forEach(t => t.stop());
     }
     if (audioContextRef.current) {
         audioContextRef.current.close();
     }
     setIsConnected(false);
     setStatus("Disconnected");
  };

  return (
    <div className="h-full flex flex-col items-center justify-center bg-gradient-to-b from-indigo-900 to-black text-white relative overflow-hidden">
      {/* Visualizer BG (Static for simplicity) */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
        <div className={`w-96 h-96 rounded-full bg-blue-500 blur-3xl transition-transform duration-1000 ${isConnected ? 'scale-110 animate-pulse' : 'scale-50'}`}></div>
      </div>

      <div className="z-10 text-center space-y-8">
        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-full border border-white/20 shadow-2xl relative">
            {isConnected ? <Activity className="w-16 h-16 text-green-400 animate-pulse" /> : <MicOff className="w-16 h-16 text-gray-400" />}
            
            {isConnected && (
                <div className="absolute -bottom-2 right-0 bg-red-500 w-6 h-6 rounded-full border-2 border-black animate-bounce"></div>
            )}
        </div>
        
        <div>
            <h2 className="text-3xl font-thin tracking-wider mb-2">Gemini Live</h2>
            <p className="text-gray-400 text-sm font-mono">{status}</p>
        </div>

        <div className="flex gap-4 justify-center">
            {!isConnected ? (
                <button onClick={connectLive} className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:scale-105 transition flex items-center gap-2">
                    <Mic size={20} /> Connect
                </button>
            ) : (
                <>
                    <button onClick={() => setIsMuted(!isMuted)} className={`p-4 rounded-full border transition ${isMuted ? 'bg-red-500/20 border-red-500 text-red-500' : 'bg-white/10 border-white/30 hover:bg-white/20'}`}>
                        {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                    </button>
                    <button onClick={disconnect} className="bg-red-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-red-700 transition">
                        End Call
                    </button>
                </>
            )}
        </div>
      </div>
    </div>
  );
};

export default VoiceApp;
