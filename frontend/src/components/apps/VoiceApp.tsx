'use client';

import React, { useState, useRef, useEffect } from 'react';
import { WindowProps } from '@/types';
import { GoogleGenAI, Modality } from '@google/genai';
import { GEMINI_API_KEY, MODELS } from '@/lib/constants';
import { Mic, MicOff, Activity } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const AUDIO_RATE = 24000; 

const VoiceApp: React.FC<WindowProps> = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [status, setStatus] = useState('Ready to connect');
  
  // Use the actual Session type from the SDK
  type LiveSession = Awaited<ReturnType<GoogleGenAI['live']['connect']>>;
  const sessionRef = useRef<LiveSession | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const inputSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  
  const nextStartTimeRef = useRef<number>(0);

  const connectLive = async () => {
    try {
      setStatus("Connecting...");
      const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
      
      const AudioContextClass = window.AudioContext || (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass({ sampleRate: AUDIO_RATE });
      audioContextRef.current = ctx;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

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

                const source = ctx.createMediaStreamSource(stream);
                const processor = ctx.createScriptProcessor(4096, 1, 1);
                
                processor.onaudioprocess = (e) => {
                    if (isMuted) return;
                    const inputData = e.inputBuffer.getChannelData(0);
                    const l = inputData.length;
                    const int16 = new Int16Array(l);
                    for (let i = 0; i < l; i++) {
                        int16[i] = inputData[i] * 32768;
                    }
                    
                    const base64 = btoa(String.fromCharCode(...new Uint8Array(int16.buffer)));
                    
                    sessionPromise.then(session => {
                        session.sendRealtimeInput({
                            media: {
                                mimeType: 'audio/pcm;rate=' + ctx.sampleRate,
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
                const base64Audio = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                if (base64Audio && ctx) {
                    const binaryString = atob(base64Audio);
                    const len = binaryString.length;
                    const bytes = new Uint8Array(len);
                    for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
                    
                    const dataInt16 = new Int16Array(bytes.buffer);
                    const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
                    const channelData = buffer.getChannelData(0);
                    for(let i=0; i<dataInt16.length; i++) {
                        channelData[i] = dataInt16[i] / 32768.0;
                    }
                    
                    const source = ctx.createBufferSource();
                    source.buffer = buffer;
                    source.connect(ctx.destination);
                    source.start(nextStartTimeRef.current);
                    nextStartTimeRef.current = ctx.currentTime + buffer.duration;
                }
            },
            onerror: (err) => {
                console.error('Session error:', err);
                const errorMessage = err instanceof Error ? err.message : (err as unknown as ErrorEvent).message || 'Unknown error';
                setStatus("Error: " + errorMessage);
                setIsConnected(false);
            },
            onclose: () => {
                setStatus("Disconnected");
                setIsConnected(false);
            }
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (error) {
      console.error('Connection error:', error);
      setStatus("Failed to connect: " + (error as Error).message);
    }
  };

  const disconnect = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (inputSourceRef.current) {
      inputSourceRef.current.disconnect();
      inputSourceRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsConnected(false);
    setStatus("Disconnected");
  };

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  return (
    <div className="voice-container">
      <div className="voice-content">
        <div className={cn('voice-status-indicator', isConnected && (isMuted ? 'voice-status-indicator-muted' : 'voice-status-indicator-active'), !isConnected && 'voice-status-indicator-disconnected')}>
          {isConnected ? (
            isMuted ? <MicOff size={48} /> : <Mic size={48} />
          ) : (
            <Activity size={48} />
          )}
        </div>
        
        <div className="voice-info">
          <h2 className="voice-title">Voice Assistant</h2>
          <p className="voice-status-text">{status}</p>
        </div>

        <div className="voice-controls">
          {!isConnected ? (
            <button
              onClick={connectLive}
              className="voice-button voice-button-connect"
            >
              Connect
            </button>
          ) : (
            <>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={cn('voice-button', isMuted ? 'voice-button-mute' : 'voice-button-unmute')}
              >
                {isMuted ? 'Unmute' : 'Mute'}
              </button>
              <button
                onClick={disconnect}
                className="voice-button voice-button-disconnect"
              >
                Disconnect
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceApp;

