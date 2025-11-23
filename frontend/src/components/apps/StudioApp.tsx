'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { WindowProps } from '@/types';
import { generateImage, editImage, generateVideo } from '@/services/geminiService';
import { Image as ImageIcon, Video, Wand2, Download, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const StudioApp: React.FC<WindowProps> = () => {
  const [activeTab, setActiveTab] = useState<'generate' | 'edit' | 'video'>('generate');
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [isHQ, setIsHQ] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_editImageFile, setEditImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [videoRefImage, setVideoRefImage] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (file: File | null) => void, previewSetter?: (url: string | null) => void) => {
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
    <div className="studio-container">
      <div className="studio-sidebar">
        <button onClick={() => setActiveTab('generate')} className={cn('studio-sidebar-button', activeTab === 'generate' && 'studio-sidebar-button-active')}>
          <ImageIcon size={24} />
        </button>
        <button onClick={() => setActiveTab('edit')} className={cn('studio-sidebar-button', activeTab === 'edit' && 'studio-sidebar-button-active')}>
          <Wand2 size={24} />
        </button>
        <button onClick={() => setActiveTab('video')} className={cn('studio-sidebar-button', activeTab === 'video' && 'studio-sidebar-button-active')}>
          <Video size={24} />
        </button>
      </div>

      <div className="studio-content">
        <div className="studio-controls">
          <h1 className="studio-title">
            {activeTab === 'generate' ? 'Generate Image' : activeTab === 'edit' ? 'Edit Image' : 'Generate Video'}
          </h1>
          
          {activeTab === 'edit' && (
            <div className="studio-upload-section">
              <label className="studio-label">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, setEditImageFile, setPreviewUrl)}
                className="studio-file-input"
              />
              {previewUrl && (
                previewUrl.startsWith('data:') ? (
                  // Use regular img for base64 data URLs as next/image doesn't support them
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={previewUrl} alt="Preview" className="studio-preview-image" />
                ) : (
                  <div className="studio-preview-image-wrapper">
                    <Image 
                      src={previewUrl} 
                      alt="Preview" 
                      className="studio-preview-image"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      style={{ objectFit: 'contain' }}
                      unoptimized
                    />
                  </div>
                )
              )}
            </div>
          )}

          {activeTab === 'video' && (
            <div className="studio-upload-section">
              <label className="studio-label">Reference Image (Optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, setVideoRefImage)}
                className="studio-file-input"
              />
            </div>
          )}

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want to generate..."
            className="studio-textarea"
          />

          <div className="studio-options">
            <select
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value)}
              className="studio-select"
            >
              <option value="1:1">1:1</option>
              <option value="16:9">16:9</option>
              <option value="9:16">9:16</option>
              <option value="4:3">4:3</option>
            </select>
            
            {activeTab === 'generate' && (
              <label className="studio-checkbox-label">
                <input
                  type="checkbox"
                  checked={isHQ}
                  onChange={(e) => setIsHQ(e.target.checked)}
                  className="studio-checkbox"
                />
                <span>High Quality</span>
              </label>
            )}

            <button
              onClick={handleAction}
              disabled={isLoading || !prompt}
              className="studio-generate-button"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'Generate'}
            </button>
          </div>
        </div>

        {resultUrl && (
          <div className="studio-result">
            {activeTab === 'video' ? (
              <video src={resultUrl} controls className="studio-result-video" />
            ) : (
              <div className="studio-result-image-wrapper">
                {resultUrl.startsWith('data:') || resultUrl.startsWith('blob:') ? (
                  // Use regular img for base64/blob URLs as next/image doesn't support them
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={resultUrl} alt="Generated" className="studio-result-image" />
                ) : (
                  <Image 
                    src={resultUrl} 
                    alt="Generated" 
                    className="studio-result-image"
                    fill
                    sizes="(max-width: 768px) 100vw, 80vw"
                    style={{ objectFit: 'contain' }}
                    unoptimized
                  />
                )}
                <a
                  href={resultUrl}
                  download
                  className="studio-download-button"
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

