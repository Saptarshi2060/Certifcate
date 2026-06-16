/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { MarriageDetails, CertificateThemeId, THEMES, VOWS_PRESETS } from './types';
import CovenantForm from './components/CovenantForm';
import DeskScene from './components/DeskScene';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Volume2, VolumeX, Coffee, Sparkles, Sliders, Music, Award } from 'lucide-react';

const INITIAL_DETAILS: MarriageDetails = {
  partner1: 'Aurelia Rose',
  partner2: 'Julian Vance',
  vowsPreset: 'coffee',
  customVows: VOWS_PRESETS[0].content,
  date: new Date().toISOString().substring(0, 10),
  location: 'Pine Redwood Cabin, Portland',
  witness1: 'Winston the Cat',
  witness2: '',
  photoOption: 'separate',
  polaroid1: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80', // Cozy aesthetic female portrait
  polaroid2: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80', // Cozy sunshine male portrait
  polaroidCaption1: 'Aurelia ♡',
  polaroidCaption2: 'Julian ✶',
  coffeeRings: [],
  signature1: null,
  signature2: null,
  witnessSignature1: null,
  witnessSignature2: null,
};

export default function App() {
  const [details, setDetails] = useState<MarriageDetails>(INITIAL_DETAILS);
  const [themeId, setThemeId] = useState<CertificateThemeId>('espresso');
  const [stage, setStage] = useState<'edit' | 'writing' | 'completed'>('edit');
  
  // Ambient browser sound synthesis for lo-fi cafe vibe
  const [isLofiMuted, setIsLofiMuted] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lofiIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // If unmuted, start our sweet procedural lo-fi ambient bells
    if (!isLofiMuted) {
      startAmbientLofi();
    } else {
      stopAmbientLofi();
    }

    return () => {
      stopAmbientLofi();
    };
  }, [isLofiMuted]);

  const startAmbientLofi = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Procedural lofi bells generator playing warm notes on a pentatonic scale
      const notes = [130.81, 146.83, 164.81, 196.00, 220.00, 261.63, 293.66, 329.63, 392.00, 440.00]; // C pentatonic chill
      
      const playBellNote = () => {
        if (!ctx || isLofiMuted) return;
        
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        // Soft vintage low pass filter
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 550; // Muffly analog feeling
        
        osc.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        // Random pentatonic note selection
        const randomNote = notes[Math.floor(Math.random() * notes.length)];
        osc.type = 'sine';
        osc.frequency.setValueAtTime(randomNote, ctx.currentTime);
        
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.024, ctx.currentTime + 0.15); // Calm build
        gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 4.0); // Very long ring delay
        
        osc.start();
        osc.stop(ctx.currentTime + 4.2);
      };

      // Play introductory bell chord
      playBellNote();
      
      // Setup scheduler interval
      lofiIntervalRef.current = setInterval(() => {
        // Play soft notes randomly every 2-4 seconds
        if (Math.random() > 0.4) {
          playBellNote();
        }
      }, 2500);

    } catch (e) {
      console.warn('Lofi synthesizer could not boot:', e);
    }
  };

  const stopAmbientLofi = () => {
    if (lofiIntervalRef.current) {
      clearInterval(lofiIntervalRef.current);
      lofiIntervalRef.current = null;
    }
  };

  const handleAddCoffeeRing = (newRing: any) => {
    setDetails((prev) => ({
      ...prev,
      coffeeRings: [...prev.coffeeRings, newRing],
    }));
  };

  const handleClearCoffeeRings = () => {
    setDetails((prev) => ({ ...prev, coffeeRings: [] }));
  };

  const handleResetScene = () => {
    setStage('edit');
    // We keep custom details but restore the progressive states
  };

  const currentTheme = THEMES[themeId];

  // Auto sign both if not configured yet
  const handleSubmitForm = () => {
    // If no signatures, auto-initialize with cursive placeholders so writing runs beautifully!
    let updatedDetails = { ...details };
    
    if (!details.signature1) {
      // Create off-screen canvas to write a quick elegant signature
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 96;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.font = 'italic 34px "Great Vibes", cursive, sans-serif';
        ctx.fillStyle = currentTheme.inkColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(details.partner1 || 'Spouse A', 150, 48);
        ctx.beginPath();
        ctx.strokeStyle = currentTheme.inkColor;
        ctx.lineWidth = 1.8;
        ctx.moveTo(90, 72);
        ctx.bezierCurveTo(120, 75, 170, 68, 210, 73);
        ctx.stroke();
        updatedDetails.signature1 = canvas.toDataURL('image/png');
      }
    }

    if (!details.signature2) {
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 96;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.font = 'italic 34px "Great Vibes", cursive, sans-serif';
        ctx.fillStyle = currentTheme.inkColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(details.partner2 || 'Spouse B', 150, 48);
        ctx.beginPath();
        ctx.strokeStyle = currentTheme.inkColor;
        ctx.lineWidth = 1.8;
        ctx.moveTo(90, 72);
        ctx.bezierCurveTo(120, 75, 170, 68, 210, 73);
        ctx.stroke();
        updatedDetails.signature2 = canvas.toDataURL('image/png');
      }
    }

    setDetails(updatedDetails);
    setStage('writing');
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] text-stone-800 selection:bg-amber-100 selection:text-amber-900 transition-colors duration-500 pb-16">
      
      {/* Dynamic Background subtle grid and coffee drop stamps */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#8c533c 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Main Header toolbar */}
      <header className="sticky top-0 bg-[#faf7f2]/90 backdrop-blur-md z-40 border-b border-stone-200/40 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center border border-amber-900/10 shadow-sm">
              <Coffee size={18} className="text-amber-800" />
            </div>
            <div>
              <h1 className="text-sm font-bold uppercase tracking-widest text-[#5c4a38] font-sans flex items-center gap-1.5">
                Covenant Atelier
              </h1>
              <p className="text-[10px] text-stone-400 font-serif italic">
                Vintage Marriage Certificate Generator & Scrapbook
              </p>
            </div>
          </div>

          {/* Interactive Lo-fi Radio Controller */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsLofiMuted(!isLofiMuted)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-sans tracking-wide transition-all shadow-xs ${
                !isLofiMuted 
                  ? 'bg-amber-50 border-amber-800/20 text-amber-900 font-medium scale-103' 
                  : 'bg-white border-stone-200 text-stone-500'
              }`}
            >
              {!isLofiMuted ? (
                <>
                  <Volume2 size={13} className="text-amber-700 animate-bounce" />
                  <span>Lo-Fi Radio Active</span>
                </>
              ) : (
                <>
                  <VolumeX size={13} />
                  <span>Lo-Fi Radio Off</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Primary Workspace Stage Switcher */}
      <main className="max-w-6xl mx-auto px-4 mt-6">
        
        <AnimatePresence mode="wait">
          {stage === 'edit' ? (
            <motion.div
              key="edit-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              {/* Introduction Banner card */}
              <div className="bg-[#f2efe9] border border-amber-900/5 p-8 rounded-lg text-center shadow-xs">
                <p className="text-xs uppercase tracking-widest text-amber-900/50 font-bold mb-1">
                  Scribe Your Story
                </p>
                <h2 className="text-3xl md:text-4xl font-serif italic font-normal text-amber-950">
                  Marriage Certificate Atelier 
                </h2>
                <p className="text-xs text-amber-900/70 mt-2 max-w-lg mx-auto leading-relaxed">
                  Generate a highly customized, vintage marriage certificate framed inside a warm Pinteresty desktop layout. Complete names, sketch signatures, upload polaroids, and trigger an automated fountain-pen signing ceremony.
                </p>
                
                {/* Decorative flourish line */}
                <div className="flex items-center justify-center gap-3 mt-4 opacity-30">
                  <span className="w-12 h-[1px] bg-amber-950" />
                  <span className="text-xs">❦</span>
                  <span className="w-12 h-[1px] bg-amber-950" />
                </div>
              </div>

              {/* Central Workbench Setup Form */}
              <CovenantForm
                details={details}
                setDetails={setDetails}
                themeId={themeId}
                setThemeId={setThemeId}
                onSubmit={handleSubmitForm}
              />
            </motion.div>
          ) : (
            <motion.div
              key="desk-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
            >
              {/* Desktop Scene Container */}
              <DeskScene
                details={details}
                theme={currentTheme}
                onAddCoffeeRing={handleAddCoffeeRing}
                onClearCoffeeRings={handleClearCoffeeRings}
                onResetScene={handleResetScene}
                stage={stage}
                setStage={setStage}
              />
            </motion.div>
          )}
        </AnimatePresence>

      </main>

    </div>
  );
}
