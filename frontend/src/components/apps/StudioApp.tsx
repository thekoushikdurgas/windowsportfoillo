'use client';

import React, { useState } from 'react';
import { WindowProps } from '@/types';
import { generateImage, editImage, generateVideo } from '@/services/geminiService';
import { Image as ImageIcon, Video, Wand2, Download, Upload, Loader2 } from 'lucide-react';

const StudioApp: React.FC<WindowProps> = () => {
  const [activeTab, setActiveTab] = useState<'generate' | 'edit' | 'video'>('generate');
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [isHQ, setIsHQ] = useState(false);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
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
    if (!prompt && activeTab !== 'edit') return;
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

      <div className="flex-1 flex flex-col p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4">
            {activeTab === 'generate' ? 'Generate Image' : activeTab === 'edit' ? 'Edit Image' : 'Generate Video'}
          </h1>
          
          {activeTab === 'edit' && (
            <div className="mb-4">
              <label className="block mb-2">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, setEditImageFile, setPreviewUrl)}
                className="block w-full text-sm text-gray-300"
              />
              {previewUrl && (
                <img src={previewUrl} alt="Preview" className="mt-2 max-w-xs rounded" />
              )}
            </div>
          )}

          {activeTab === 'video' && (
            <div className="mb-4">
              <label className="block mb-2">Reference Image (Optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, setVideoRefImage)}
                className="block w-full text-sm text-gray-300"
              />
            </div>
          )}

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want to generate..."
            className="w-full h-32 p-4 bg-[#2d2d2d] border border-gray-600 rounded-lg text-white placeholder-gray-400 resize-none"
          />

          <div className="mt-4 flex gap-4 items-center">
            <select
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value)}
              className="px-4 py-2 bg-[#2d2d2d] border border-gray-600 rounded text-white"
            >
              <option value="1:1">1:1</option>
              <option value="16:9">16:9</option>
              <option value="9:16">9:16</option>
              <option value="4:3">4:3</option>
            </select>
            
            {activeTab === 'generate' && (
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isHQ}
                  onChange={(e) => setIsHQ(e.target.checked)}
                  className="rounded"
                />
                <span>High Quality</span>
              </label>
            )}

            <button
              onClick={handleAction}
              disabled={isLoading || !prompt}
              className="ml-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'Generate'}
            </button>
          </div>
        </div>

        {resultUrl && (
          <div className="flex-1 flex items-center justify-center bg-[#2d2d2d] rounded-lg p-4">
            {activeTab === 'video' ? (
              <video src={resultUrl} controls className="max-w-full max-h-full rounded" />
            ) : (
              <div className="relative">
                <img src={resultUrl} alt="Generated" className="max-w-full max-h-[600px] rounded" />
                <a
                  href={resultUrl}
                  download
                  className="absolute top-4 right-4 p-2 bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  <Download size={20} />
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudioApp;

