/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { Camera, RefreshCw, Trash2, Sliders } from 'lucide-react';
import { motion } from 'motion/react';

interface PolaroidUploadProps {
  label: string;
  imageSrc: string | null;
  onImageChange: (src: string | null) => void;
  caption: string;
  onCaptionChange: (text: string) => void;
  placeholderText: string;
}

type PhotoFilter = 'normal' | 'vintage-warm' | 'sepia' | 'rose-tint' | 'retro-noir';

const FILTERS: { id: PhotoFilter; name: string; class: string }[] = [
  { id: 'normal', name: 'Raw', class: 'brightness-100 contrast-100 saturate-100' },
  { id: 'vintage-warm', name: 'Cozy Glow', class: 'sepia-[15%] contrast-[95%] brightness-[102%] saturate-[110%] hue-rotate-[5deg]' },
  { id: 'sepia', name: 'Almanac', class: 'sepia-[75%] contrast-[90%] brightness-[95%] saturate-[80%]' },
  { id: 'rose-tint', name: 'Velvet Rose', class: 'sepia-[10%] contrast-[95%] brightness-[100%] saturate-[105%] hue-rotate-[-10deg] multiply-blend-pink' },
  { id: 'retro-noir', name: 'Black Velvet', class: 'grayscale contrast-[110%] brightness-[90%]' },
];

export default function PolaroidUpload({
  label,
  imageSrc,
  onImageChange,
  caption,
  onCaptionChange,
  placeholderText,
}: PolaroidUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [filter, setFilter] = useState<PhotoFilter>('vintage-warm');
  const [showFilters, setShowFilters] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onImageChange(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const removePhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const selectedFilterClass = FILTERS.find((f) => f.id === filter)?.class || '';

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-sm">
      <span className="text-xs font-semibold uppercase tracking-widest text-amber-900/60 font-sans">
        {label}
      </span>

      {/* Styled Physical Polaroid Frame */}
      <div 
        onClick={!imageSrc ? triggerUpload : undefined}
        className={`relative w-64 bg-[#f8f5ee] p-4 pb-10 border border-amber-900/10 shadow-lg rounded-sm cursor-pointer transition-transform hover:rotate-1 hover:scale-[1.01] hover:shadow-xl group select-none`}
        style={{
          boxShadow: '0 10px 25px -5px rgba(115, 80, 50, 0.12), 0 8px 10px -6px rgba(115, 80, 50, 0.12)'
        }}
      >
        {/* Tape Asset on Top */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-amber-100/50 mix-blend-multiply border border-amber-200/20 shadow-sm rotate-2 z-10 font-mono text-[9px] text-[#A67C52]/40 flex items-center justify-center pointer-events-none">
          ✶ COZY MEMORY ✶
        </div>

        {/* Polaroid Image Area */}
        <div className="relative aspect-square w-full bg-[#eeeae0] overflow-hidden border border-black/5 flex flex-col items-center justify-center">
          {imageSrc ? (
            <>
              {/* Photo */}
              <img
                src={imageSrc}
                alt="Memory"
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover transition-all duration-300 ${selectedFilterClass}`}
              />

              {/* Action Buttons on Hover */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-20">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowFilters(!showFilters);
                  }}
                  className="p-1.5 rounded-full bg-white/90 shadow-md text-amber-900 hover:bg-amber-50 hover:scale-105 transition-all"
                  title="Filter style"
                >
                  <Sliders size={13} />
                </button>
                <button
                  type="button"
                  onClick={triggerUpload}
                  className="p-1.5 rounded-full bg-white/90 shadow-md text-amber-900 hover:bg-amber-50 hover:scale-105 transition-all"
                  title="Change photo"
                >
                  <RefreshCw size={13} />
                </button>
                <button
                  type="button"
                  onClick={removePhoto}
                  className="p-1.5 rounded-full bg-white/90 shadow-md text-red-700 hover:bg-red-50 hover:scale-105 transition-all"
                  title="Remove photo"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 p-4 text-center">
              <Camera size={28} className="text-[#A67C52]/40 animate-pulse" />
              <p className="text-xs font-sans text-amber-900/60 font-medium">
                {placeholderText}
              </p>
              <p className="text-[10px] font-mono text-amber-900/40">
                Click to browse photo
              </p>
            </div>
          )}

          {/* Filter Palette overlay */}
          {imageSrc && showFilters && (
            <div 
              className="absolute inset-x-0 bottom-0 bg-stone-900/90 text-white p-2 flex flex-col gap-1 z-30 text-[10px] backdrop-blur-xs"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="font-sans font-medium text-amber-200 self-start">Photo Filter:</span>
              <div className="flex gap-1 overflow-x-auto py-1">
                {FILTERS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFilter(f.id)}
                    className={`px-1.5 py-0.5 rounded-sm shrink-0 border transition-all ${
                      filter === f.id
                        ? 'bg-amber-600 border-amber-400 text-white font-bold'
                        : 'bg-stone-800 border-stone-700 text-stone-300 hover:bg-stone-700'
                    }`}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Polaroid Bottom Caption */}
        <div className="absolute bottom-1.5 inset-x-4 text-center">
          <input
            type="text"
            value={caption}
            onChange={(e) => onCaptionChange(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            placeholder="Write caption... ♡"
            className="w-full text-center bg-transparent border-none text-[#5c4a38] text-sm focus:outline-none focus:ring-0 placeholder-amber-900/30 truncate"
            style={{ fontFamily: '"Great Vibes", cursive, sans-serif' }}
          />
        </div>

        {/* Secret Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
