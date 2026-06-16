/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect } from 'react';
import { CoffeeRing, CertificateTheme, MarriageDetails, VOWS_PRESETS } from '../types';
import { Leaf, Award, Compass, Sparkles } from 'lucide-react';

interface CertificateProps {
  details: MarriageDetails;
  theme: CertificateTheme;
  writingProgress: {
    partner1: number; // 0 to 1
    partner2: number;
    date: number;
    location: number;
    sig1: number;
    sig2: number;
    wit1: number;
    wit2: number;
    seal: number;
  };
  onAddCoffeeRing?: (ring: CoffeeRing) => void;
  stampingMode: 'ring' | 'stain' | 'drip' | null;
  className?: string;
  isInteractive?: boolean;
}

export default function Certificate({
  details,
  theme,
  writingProgress,
  onAddCoffeeRing,
  stampingMode,
  className = '',
  isInteractive = true,
}: CertificateProps) {
  const paperRef = useRef<HTMLDivElement>(null);

  // Click on the paper to stamp coffee ring/stain
  const handlePaperClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stampingMode || !onAddCoffeeRing || !paperRef.current) return;

    const rect = paperRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newRing: CoffeeRing = {
      id: `ring-${Date.now()}-${Math.random()}`,
      x,
      y,
      rotation: Math.floor(Math.random() * 360),
      scale: 0.6 + Math.random() * 0.8,
      type: stampingMode,
    };

    onAddCoffeeRing(newRing);
  };

  // Helper to slice text for cursive typewriter/stroke look based on progress
  const getRevealedText = (text: string, progress: number) => {
    if (progress <= 0) return '';
    if (progress >= 1) return text;
    const length = Math.floor(text.length * progress);
    return text.substring(0, length);
  };

  return (
    <div
      ref={paperRef}
      onClick={handlePaperClick}
      className={`relative w-[850px] h-[600px] ${theme.paperBg} p-8 select-none transition-all duration-500 overflow-hidden text-center flex flex-col justify-between ${className} ${
        stampingMode ? 'cursor-cell ring-2 ring-amber-700/50' : ''
      }`}
      style={{
        boxShadow: '0 25px 50px -12px rgba(92, 62, 53, 0.25), inset 0 0 40px rgba(115, 80, 50, 0.05)',
        fontFamily: '"Cormorant Garamond", serif',
      }}
    >
      {/* Tea stained/linen texture overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.06] bg-repeat mix-blend-multiply" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.3'/%3E%3C/svg%3E")`
        }}
      />

      {/* Elegant Double Floral Border (SVG) */}
      <div className="absolute inset-4 border border-double pointer-events-none rounded-xs flex flex-col justify-between"
        style={{ borderColor: `${theme.inkColor}33`, borderWidth: '3px' }}
      >
        <div className="absolute inset-1.5 border pointer-events-none" style={{ borderColor: `${theme.inkColor}15`, borderWidth: '1px' }} />
      </div>

      {/* Botanical Corner Flourishes */}
      <div className="absolute top-6 left-6 w-16 h-16 pointer-events-none opacity-40" style={{ color: theme.inkColor }}>
        <svg viewBox="0 0 100 100" fill="currentColor">
          <path d="M0,0 C30,10 50,30 60,60 C40,50 15,35 0,0" />
          <circle cx="20" cy="20" r="3" />
          <circle cx="35" cy="15" r="2" />
          <path d="M0,0 C10,30 30,50 60,60 C50,40 35,15 0,0" />
        </svg>
      </div>
      <div className="absolute top-6 right-6 w-16 h-16 pointer-events-none opacity-40 scale-x-[-1]" style={{ color: theme.inkColor }}>
        <svg viewBox="0 0 100 100" fill="currentColor">
          <path d="M0,0 C30,10 50,30 60,60 C40,50 15,35 0,0" />
          <circle cx="20" cy="20" r="3" />
          <circle cx="35" cy="15" r="2" />
        </svg>
      </div>
      <div className="absolute bottom-6 left-6 w-16 h-16 pointer-events-none opacity-40 scale-y-[-1]" style={{ color: theme.inkColor }}>
        <svg viewBox="0 0 100 100" fill="currentColor">
          <path d="M0,0 C30,10 50,30 60,60 C40,50 15,35 0,0" />
          <circle cx="20" cy="20" r="3" />
          <circle cx="35" cy="15" r="2" />
        </svg>
      </div>
      <div className="absolute bottom-6 right-6 w-16 h-16 pointer-events-none opacity-40 scale-x-[-1] scale-y-[-1]" style={{ color: theme.inkColor }}>
        <svg viewBox="0 0 100 100" fill="currentColor">
          <path d="M0,0 C30,10 50,30 60,60 C40,50 15,35 0,0" />
          <circle cx="20" cy="20" r="3" />
          <circle cx="35" cy="15" r="2" />
        </svg>
      </div>

      {/* Main Content Area */}
      <div className={`relative h-full flex flex-col justify-between py-6 px-10 ${theme.textColor}`}>
        
        {/* Certificate Header */}
        <div className="flex flex-col items-center gap-1">
          <p className="text-xs uppercase tracking-[0.3em] font-sans text-amber-900/60 font-semibold flex items-center gap-2">
            <Leaf size={12} className="opacity-80" /> 
            Sacred Covenant of Marriage 
            <Leaf size={12} className="scale-x-[-1] opacity-80" />
          </p>
          <h1 className="text-4xl md:text-5xl font-normal font-serif italic tracking-wide mt-2" 
              style={{ color: theme.inkColor, textShadow: '0.5px 0.5px 0px rgba(255,255,255,0.7)' }}>
            Certificate of Matrimony
          </h1>
          <div className="w-24 h-[1px] mt-2 opacity-30" style={{ backgroundColor: theme.inkColor }} />
        </div>

        {/* Declarative statement */}
        <div className="my-1">
          <p className="text-md text-amber-950/70 italic font-serif">
            This documents the sacred and eternal union that joins two hearts as one
          </p>
        </div>

        {/* Partners Section */}
        <div className="grid grid-cols-5 items-center gap-4 my-3">
          {/* Partner 1 */}
          <div className="col-span-2 text-right pr-4 flex flex-col justify-center h-16">
            <span className="text-[11px] font-sans uppercase tracking-widest text-[#8C5E3C] font-semibold block mb-0.5">
              The First Partner
            </span>
            <span 
              className="text-3xl font-normal italic leading-relaxed tracking-wider overflow-hidden block min-h-[40px]" 
              style={{ 
                fontFamily: '"Great Vibes", cursive, sans-serif',
                color: theme.inkColor,
              }}
            >
              {getRevealedText(details.partner1 || 'First Spouse', writingProgress.partner1)}
            </span>
          </div>

          {/* Infinity Love knot */}
          <div className="col-span-1 flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center">
              <span className="text-2xl opacity-40" style={{ color: theme.inkColor }}>
                ❦
              </span>
              <div className="absolute -top-1 -bottom-1 w-[1px] opacity-20" style={{ backgroundColor: theme.inkColor }} />
            </div>
            <span className="text-[10px] uppercase font-sans tracking-widest text-amber-900/40 font-bold block mt-1">
              and
            </span>
          </div>

          {/* Partner 2 */}
          <div className="col-span-2 text-left pl-4 flex flex-col justify-center h-16">
            <span className="text-[11px] font-sans uppercase tracking-widest text-[#8C5E3C] font-semibold block mb-0.5">
              The Second Partner
            </span>
            <span 
              className="text-3xl font-normal italic leading-relaxed tracking-wider overflow-hidden block min-h-[40px]" 
              style={{ 
                fontFamily: '"Great Vibes", cursive, sans-serif',
                color: theme.inkColor,
              }}
            >
              {getRevealedText(details.partner2 || 'Second Spouse', writingProgress.partner2)}
            </span>
          </div>
        </div>

        {/* The Vows / Promises Section */}
        <div className="mx-auto max-w-xl my-2 px-6 py-3 border-y border-dashed border-amber-900/10 bg-amber-50/[0.15]">
          <p className="text-[10px] uppercase tracking-widest font-sans text-amber-900/50 mb-1 font-bold">
            Their Solemn Vows
          </p>
          <p className="text-sm font-serif italic text-amber-950/80 leading-relaxed text-center">
            “{details.customVows || VOWS_PRESETS[0].content}”
          </p>
        </div>

        {/* Marriage Meta Details (Date & Location) */}
        <div className="flex justify-center items-center gap-12 text-sm my-3 font-serif">
          <div className="text-right">
            <span className="text-[10px] uppercase font-sans tracking-widest text-amber-900/40 block">Date of Covenant</span>
            <span className="italic text-amber-950 font-medium block">
              {writingProgress.date > 0 
                ? getRevealedText(details.date ? new Date(details.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }), writingProgress.date)
                : '\u2002'
              }
            </span>
          </div>
          <div className="h-6 w-[1px] opacity-20" style={{ backgroundColor: theme.inkColor }} />
          <div className="text-left">
            <span className="text-[10px] uppercase font-sans tracking-widest text-amber-900/40 block">Solemnized At</span>
            <span className="italic text-amber-950 font-medium block">
              {writingProgress.location > 0 
                ? getRevealedText(details.location || 'The Warm Coffee Shop', writingProgress.location)
                : '\u2002'
              }
            </span>
          </div>
        </div>

        {/* Signatures & Wax Seal Section */}
        <div className="grid grid-cols-4 items-end gap-2 mt-4">
          
          {/* Partner 1 Signature */}
          <div className="flex flex-col items-center">
            <div className="h-10 w-32 relative flex items-center justify-center">
              {writingProgress.sig1 > 0 && details.signature1 && (
                <img
                  src={details.signature1}
                  alt="Partner 1 Signature"
                  referrerPolicy="no-referrer"
                  className="max-h-full max-w-full object-contain pointer-events-none transition-all duration-500"
                  style={{ 
                    opacity: writingProgress.sig1,
                    transform: `scale(${0.9 + writingProgress.sig1 * 0.1})`,
                    filter: 'multiply-blend-ink'
                  }}
                />
              )}
            </div>
            <div className="w-28 h-[1px] opacity-30 mt-1" style={{ backgroundColor: theme.inkColor }} />
            <span className="text-[9px] uppercase font-sans tracking-widest text-amber-900/50 mt-1">Signature</span>
          </div>

          {/* Witness 1 Signature */}
          <div className="flex flex-col items-center">
            <div className="h-10 w-28 relative flex items-center justify-center text-xs italic font-semibold">
              {writingProgress.wit1 > 0 && (
                <span 
                  className="text-lg text-stone-800 transition-all duration-500" 
                  style={{ 
                    fontFamily: '"Great Vibes", cursive, sans-serif',
                    opacity: writingProgress.wit1,
                  }}
                >
                  {getRevealedText(details.witness1 || 'Witness Cup', writingProgress.wit1)}
                </span>
              )}
            </div>
            <div className="w-24 h-[1px] opacity-30 mt-1" style={{ backgroundColor: theme.inkColor }} />
            <span className="text-[9px] uppercase font-sans tracking-widest text-amber-900/50 mt-1">Witness ({details.witness1 || 'A Friends Hand'})</span>
          </div>

          {/* Wax Seal Area (Center Pillar of Matrimony) */}
          <div className="flex flex-col items-center justify-center relative">
            <div 
              className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transform transition-all duration-1000 ${
                writingProgress.seal > 0 
                  ? 'scale-100 opacity-100 rotate-12 rotate-[-5deg]' 
                  : 'scale-0 opacity-0'
              } ${theme.sealColor} border border-black/10`}
              style={{
                boxShadow: 'inset 0 4px 6px rgba(255,255,255,0.25), 0 6px 12px rgba(60,40,30,0.4)',
              }}
            >
              <div 
                className="w-11 h-11 rounded-full border-2 border-dashed border-white/20 flex flex-col items-center justify-center text-amber-100 text-[10px] uppercase font-sans font-extrabold tracking-tighter"
              >
                <Compass size={14} className="mb-0.5 text-amber-100/70" />
                <span>HEARTS</span>
              </div>
            </div>
            <span className="text-[8px] uppercase tracking-widest text-amber-900/30 mt-1 font-bold">Lover's Seal</span>
          </div>

          {/* Partner 2 Signature */}
          <div className="flex flex-col items-center">
            <div className="h-10 w-32 relative flex items-center justify-center">
              {writingProgress.sig2 > 0 && details.signature2 && (
                <img
                  src={details.signature2}
                  alt="Partner 2 Signature"
                  referrerPolicy="no-referrer"
                  className="max-h-full max-w-full object-contain pointer-events-none transition-all duration-500"
                  style={{ 
                    opacity: writingProgress.sig2,
                    transform: `scale(${0.9 + writingProgress.sig2 * 0.1})`,
                    filter: 'multiply-blend-ink'
                  }}
                />
              )}
            </div>
            <div className="w-28 h-[1px] opacity-30 mt-1" style={{ backgroundColor: theme.inkColor }} />
            <span className="text-[9px] uppercase font-sans tracking-widest text-amber-900/50 mt-1">Signature</span>
          </div>

        </div>

      </div>

      {/* Coffee Rings and Dripping details layered on TOP of the document */}
      {details.coffeeRings.map((ring) => {
        const ringColor = theme.id === 'matcha' ? 'rgba(74, 110, 80, 0.15)' : 'rgba(115, 80, 50, 0.16)';
        const stainColor = theme.id === 'matcha' ? 'rgba(94, 130, 95, 0.08)' : 'rgba(130, 95, 75, 0.10)';

        return (
          <div
            key={ring.id}
            className="absolute pointer-events-none mix-blend-multiply z-40 transition-all duration-300"
            style={{
              left: `${ring.x}%`,
              top: `${ring.y}%`,
              transform: `translate(-50%, -50%) rotate(${ring.rotation}deg) scale(${ring.scale})`,
            }}
          >
            {ring.type === 'ring' && (
              <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
                {/* Vintage imperfect coffee ring */}
                <circle 
                  cx="50" 
                  cy="50" 
                  r="35" 
                  stroke={ringColor} 
                  strokeWidth="2.5" 
                  strokeDasharray="40 5 15 2 25 8" 
                  className="blur-[0.5px]"
                />
                <circle 
                  cx="51" 
                  cy="49" 
                  r="34.5" 
                  stroke={ringColor} 
                  strokeWidth="1.2" 
                  strokeDasharray="20 18 35 12" 
                  className="blur-[0.7px]"
                />
                {/* Secondary smudges */}
                <path d="M45 15 C 30 20, 25 35, 20 40" stroke={ringColor} strokeWidth="1" className="blur-[1.5px]" />
                <path d="M75 70 C 80 80, 60 85, 55 80" stroke={ringColor} strokeWidth="1.5" className="blur-[1px]" />
              </svg>
            )}

            {ring.type === 'stain' && (
              <div 
                className="w-16 h-12 rounded-full blur-[4px]" 
                style={{ backgroundColor: stainColor, transform: 'scaleX(1.4)' }}
              />
            )}

            {ring.type === 'drip' && (
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                {/* Small coffee drop spill with splatter */}
                <circle cx="20" cy="20" r="4" fill={ringColor} className="blur-[0.3px]" />
                <circle cx="28" cy="18" r="1" fill={ringColor} className="blur-[0.5px]" />
                <circle cx="16" cy="26" r="1.5" fill={ringColor} className="blur-[0.4px]" />
                <path d="M20 20 Q 22 28, 21 32" stroke={ringColor} strokeWidth="1" className="blur-[0.5px]" />
              </svg>
            )}
          </div>
        );
      })}
    </div>
  );
}
