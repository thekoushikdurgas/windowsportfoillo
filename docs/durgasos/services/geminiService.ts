import { GoogleGenAI, Type, Modality } from "@google/genai";
import { MODELS, GEMINI_API_KEY } from "../constants";

// Helper to get a fresh client, potentially with a user-selected key for Veo
export const getGenAI = async (forceUserKey = false) => {
  let key = GEMINI_API_KEY;
  if (forceUserKey && window.aistudio) {
     // In a real scenario, the key is injected by the environment when using aistudio helpers
     // We rely on the process.env.API_KEY being updated or just present.
     // For this implementation, we assume process.env.API_KEY is the source of truth.
  }
  return new GoogleGenAI({ apiKey: key });
};

// --- Text & Chat ---

export const generateChatResponse = async (
  history: { role: string; text: string }[],
  message: string,
  model: string = MODELS.CHAT_COMPLEX,
  useThinking = false,
  useGrounding = false
) => {
  const ai = await getGenAI();
  
  const tools: any[] = [];
  if (useGrounding) {
    tools.push({ googleSearch: {} });
    // Google Maps is not supported on gemini-3-pro-preview
    if (!model.includes('gemini-3-pro')) {
       tools.push({ googleMaps: {} });
    }
  }

  const config: any = {
    tools: tools.length > 0 ? tools : undefined,
  };

  if (useThinking && model.includes('gemini-3-pro')) {
      config.thinkingConfig = { thinkingBudget: 16000 }; // Conservative budget
  }
  
  const chatHistory = history.map(h => ({
    role: h.role,
    parts: [{ text: h.text }]
  }));

  const chat = ai.chats.create({
    model,
    config,
    history: chatHistory
  });

  const result = await chat.sendMessage({ message });
  return {
    text: result.text,
    groundingMetadata: result.candidates?.[0]?.groundingMetadata
  };
};

// --- Image Generation ---

export const generateImage = async (prompt: string, aspectRatio: string = "1:1", isHQ = false) => {
  const ai = await getGenAI();
  const model = isHQ ? MODELS.IMAGE_GEN_HQ : MODELS.IMAGE_GEN_FAST;

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [{ text: prompt }]
    },
    config: {
      imageConfig: {
        aspectRatio: aspectRatio,
        imageSize: isHQ ? "2K" : undefined
      }
    }
  });

  // Extract images
  const images: string[] = [];
  if (response.candidates?.[0]?.content?.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData && part.inlineData.data) {
        images.push(`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`);
      }
    }
  }
  return images;
};

// --- Image Editing (Nano Banana) ---

export const editImage = async (base64Image: string, prompt: string) => {
  const ai = await getGenAI();
  const response = await ai.models.generateContent({
    model: MODELS.IMAGE_EDIT,
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Image.split(',')[1],
            mimeType: 'image/png' // Assuming PNG for simplicity, ideally extract from string
          }
        },
        { text: prompt }
      ]
    }
  });

   const images: string[] = [];
   if (response.candidates?.[0]?.content?.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData && part.inlineData.data) {
        images.push(`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`);
      }
    }
  }
  return images;
}

// --- Video Generation (Veo) ---

export const generateVideo = async (prompt: string, aspectRatio: string = "16:9", imageBase64?: string) => {
  const ai = await getGenAI(true); // Likely needs user key
  
  let operation;
  
  if (imageBase64) {
    operation = await ai.models.generateVideos({
      model: MODELS.VIDEO_VEO_FAST,
      prompt,
      image: {
        imageBytes: imageBase64.split(',')[1],
        mimeType: 'image/png'
      },
      config: {
        numberOfVideos: 1,
        aspectRatio: aspectRatio as any,
        resolution: '720p'
      }
    });
  } else {
     operation = await ai.models.generateVideos({
      model: MODELS.VIDEO_VEO_FAST,
      prompt,
      config: {
        numberOfVideos: 1,
        aspectRatio: aspectRatio as any,
        resolution: '720p'
      }
    });
  }

  // Poll for completion
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    operation = await ai.operations.getVideosOperation({ operation });
  }

  const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!videoUri) throw new Error("No video generated");
  
  // Fetch the actual video blob
  const res = await fetch(`${videoUri}&key=${GEMINI_API_KEY}`);
  const blob = await res.blob();
  return URL.createObjectURL(blob);
};

// --- Transcription ---
export const transcribeAudio = async (base64Audio: string, mimeType: string = 'audio/mp3') => {
    const ai = await getGenAI();
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            parts: [
                { inlineData: { mimeType: mimeType, data: base64Audio } }, 
                { text: "Transcribe this audio exactly." }
            ]
        }
    });
    return response.text;
};

// --- TTS ---
export const generateSpeech = async (text: string) => {
    const ai = await getGenAI();
    const response = await ai.models.generateContent({
        model: MODELS.AUDIO_TTS,
        contents: { parts: [{ text }] },
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Fenrir' } }
            }
        }
    });
    
    const base64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64) throw new Error("No audio generated");
    
    // Convert to playable URL
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
    // const blob = new Blob([bytes], { type: 'audio/pcm' }); 
    // Note: Browsers can't play raw PCM directly in <audio> usually without wav header or AudioContext.
    // For simplicity in this non-Live demo part, we might rely on the Live API section for audio, 
    // or wrap PCM in WAV header. For brevity, we'll assume AudioContext playback in the UI component.
    return bytes;
};