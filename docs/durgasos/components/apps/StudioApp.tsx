import React, { useState, useRef } from 'react';
import { WindowProps } from '../../types';
import { generateImage, editImage, generateVideo } from '../../services/geminiService';
import { Image as ImageIcon, Video, Wand2, Download, Upload, Loader2 } from 'lucide-react';

const StudioApp: React.FC<WindowProps> = () => {
  const [activeTab, setActiveTab] = useState<'generate' | 'edit' | 'video'>('generate');
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  
  // Image Gen Config
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [isHQ, setIsHQ] = useState(false);

  // Edit Config
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Video Config
  const [videoRefImage, setVideoRefImage] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: any, previewSetter?: any) => {
    const file = e.target.files?.[0];
    if (file) {
      setter(file);
      if (previewSetter) {
        const reader = new FileReader();
        reader.onload = (ev) => previewSetter(ev.target?.result as string);
        reader.readAsDataURL(file);
      }
    }
  };

  const handleAction = async () => {
    if (!prompt && activeTab !== 'edit') return; // Edit might not need prompt if just ref? No, usually needs prompt.
    setIsLoading(true);
    setResultUrl(null);

    try {
      if (activeTab === 'generate') {
        const images = await generateImage(prompt, aspectRatio, isHQ);
        if (images.length > 0) setResultUrl(images[0]);
      } 
      else if (activeTab === 'edit') {
        if (!previewUrl) { alert('Upload an image first'); return; }
        const images = await editImage(previewUrl, prompt);
        if (images.length > 0) setResultUrl(images[0]);
      } 
      else if (activeTab === 'video') {
        // Check for key first (simulated)
        let hasKey = true;
        if (window.aistudio?.hasSelectedApiKey) {
           hasKey = await window.aistudio.hasSelectedApiKey();
           if (!hasKey && window.aistudio.openSelectKey) {
              await window.aistudio.openSelectKey();
              hasKey = await window.aistudio.hasSelectedApiKey();
           }
        }
        
        if (!hasKey) {
            alert("Please select a paid API key for Veo video generation.");
            setIsLoading(false);
            return;
        }

        let refBase64 = undefined;
        if (videoRefImage) {
             refBase64 = await new Promise<string>((resolve) => {
                 const r = new FileReader();
                 r.onload = () => resolve(r.result as string);
                 r.readAsDataURL(videoRefImage);
             });
        }

        const videoUrl = await generateVideo(prompt, aspectRatio, refBase64);
        setResultUrl(videoUrl);
      }
    } catch (e) {
      console.error(e);
      alert("Generation failed: " + (e as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full bg-[#1f1f1f] text-white">
      {/* Sidebar */}
      <div className="w-16 bg-[#2d2d2d] flex flex-col items-center py-4 space-y-6 border-r border-black/20">
        <button onClick={() => setActiveTab('generate')} className={`p-3 rounded-xl transition ${activeTab === 'generate' ? 'bg-blue-600' : 'hover:bg-white/10'}`}>
          <ImageIcon size={24} />
        </button>
        <button onClick={() => setActiveTab('edit')} className={`p-3 rounded-xl transition ${activeTab === 'edit' ? 'bg-blue-600' : 'hover:bg-white/10'}`}>
          <Wand2 size={24} />
        </button>
        <button onClick={() => setActiveTab('video')} className={`p-3 rounded-xl transition ${activeTab === 'video' ? 'bg-blue-600' : 'hover:bg-white/10'}`}>
          <Video size={24} />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-6 overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-6">
          {activeTab === 'generate' && "Create Images"}
          {activeTab === 'edit' && "Magic Editor"}
          {activeTab === 'video' && "Veo Video Studio"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
          {/* Controls */}
          <div className="md:col-span-1 space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Prompt</label>
              <textarea 
                className="w-full bg-[#333] border border-[#444] rounded-lg p-3 text-sm focus:border-blue-500 outline-none h-32 resize-none"
                placeholder={activeTab === 'edit' ? "Describe changes (e.g., 'Add a retro filter')" : "Describe your imagination..."}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            {/* Dynamic Controls based on Tab */}
            {activeTab !== 'edit' && (
              <div>
                 <label className="block text-sm text-gray-400 mb-1">Aspect Ratio</label>
                 <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} className="w-full bg-[#333] border border-[#444] rounded p-2 text-sm">
                   <option value="1:1">Square (1:1)</option>
                   <option value="16:9">Landscape (16:9)</option>
                   <option value="9:16">Portrait (9:16)</option>
                   <option value="4:3">Standard (4:3)</option>
                 </select>
              </div>
            )}

            {activeTab === 'generate' && (
               <div className="flex items-center gap-2">
                 <input type="checkbox" id="hq" checked={isHQ} onChange={(e) => setIsHQ(e.target.checked)} />
                 <label htmlFor="hq" className="text-sm text-gray-300">High Quality (Pro Model)</label>
               </div>
            )}

            {activeTab === 'edit' && (
              <div>
                 <label className="block text-sm text-gray-400 mb-1">Source Image</label>
                 <div className="border-2 border-dashed border-[#444] rounded-lg p-4 text-center cursor-pointer hover:bg-[#333] transition relative">
                   <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileChange(e, setEditImageFile, setPreviewUrl)} accept="image/*" />
                   {previewUrl ? <img src={previewUrl} className="h-20 mx-auto object-cover rounded" alt="preview" /> : <div className="text-gray-500 text-sm flex flex-col items-center gap-1"><Upload size={16}/> Upload</div>}
                 </div>
              </div>
            )}

            {activeTab === 'video' && (
              <div>
                 <label className="block text-sm text-gray-400 mb-1">Reference Image (Optional)</label>
                 <div className="border-2 border-dashed border-[#444] rounded-lg p-4 text-center cursor-pointer hover:bg-[#333] transition relative">
                   <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileChange(e, setVideoRefImage)} accept="image/*" />
                   {videoRefImage ? <span className="text-xs text-green-400">{videoRefImage.name}</span> : <div className="text-gray-500 text-sm flex flex-col items-center gap-1"><Upload size={16}/> Upload</div>}
                 </div>
                 <p className="text-xs text-yellow-500/80 mt-2">* Requires paid API key</p>
              </div>
            )}

            <button 
              onClick={handleAction}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <Wand2 size={18} />}
              {activeTab === 'generate' ? 'Generate' : activeTab === 'edit' ? 'Edit Image' : 'Create Video'}
            </button>
          </div>

          {/* Preview Area */}
          <div className="md:col-span-2 bg-[#151515] rounded-xl border border-[#333] flex items-center justify-center relative overflow-hidden">
             {!resultUrl && !isLoading && (
               <div className="text-gray-600 text-center">
                 <p className="mb-2 text-4xl opacity-20">✨</p>
                 <p>Your creation will appear here</p>
               </div>
             )}
             
             {isLoading && (
               <div className="text-center">
                  <Loader2 className="animate-spin mx-auto text-blue-500 mb-2" size={48} />
                  <p className="text-gray-400 animate-pulse">Calling {activeTab === 'video' ? 'Veo' : 'Gemini'}...</p>
                  {activeTab === 'video' && <p className="text-xs text-gray-500 mt-2">Videos take a moment...</p>}
               </div>
             )}

             {resultUrl && !isLoading && (
               <>
                 {activeTab === 'video' ? (
                   <video src={resultUrl} controls className="max-h-full max-w-full rounded shadow-2xl" autoPlay loop />
                 ) : (
                   <img src={resultUrl} alt="Result" className="max-h-full max-w-full object-contain rounded shadow-2xl" />
                 )}
                 <a href={resultUrl} download={`durgasos-${Date.now()}.${activeTab === 'video' ? 'mp4' : 'png'}`} className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 backdrop-blur p-2 rounded-full text-white">
                   <Download size={20} />
                 </a>
               </>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudioApp;
