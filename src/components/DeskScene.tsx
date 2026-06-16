/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { MarriageDetails, CertificateTheme, CoffeeRing, VOWS_PRESETS } from '../types';
import Certificate from './Certificate';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Play, Coffee, Sparkles, RefreshCw, PenTool, CheckCircle, ArrowLeft, Leaf } from 'lucide-react';

interface DeskSceneProps {
  details: MarriageDetails;
  theme: CertificateTheme;
  onAddCoffeeRing: (ring: CoffeeRing) => void;
  onClearCoffeeRings: () => void;
  onResetScene: () => void;
  stage: 'edit' | 'writing' | 'completed';
  setStage: (s: 'edit' | 'writing' | 'completed') => void;
}

export default function DeskScene({
  details,
  theme,
  onAddCoffeeRing,
  onClearCoffeeRings,
  onResetScene,
  stage,
  setStage,
}: DeskSceneProps) {
  const [stampingMode, setStampingMode] = useState<'ring' | 'stain' | 'drip' | null>(null);
  const [penPos, setPenPos] = useState({ x: 50, y: -10, opacity: 0, isWriting: false });
  const [isExporting, setIsExporting] = useState(false);
  const [showParticleSparkle, setShowParticleSparkle] = useState(false);

  // Sound play helper (can use audio context for soft satisfying scratching/swoosh, synthesized procedurally so zero external assets are required!)
  const playWritingSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(100, audioCtx.currentTime); // Low rustle frequency
      
      // Add brown-like scratch filter
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 400;
      filter.Q.value = 1.0;

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      // Procedural rustling modulation
      gain.gain.setValueAtTime(0, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.015, audioCtx.currentTime + 0.05);
      
      // Scratch modulation
      for (let i = 0.1; i < 0.6; i += 0.08) {
        osc.frequency.setValueAtTime(120 + Math.random() * 80, audioCtx.currentTime + i);
        gain.gain.setValueAtTime(0.01 + Math.random() * 0.01, audioCtx.currentTime + i);
      }
      
      gain.gain.setValueAtTime(0.015, audioCtx.currentTime + 0.6);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.85);
    } catch (e) {
      // Ignored if browser blocks audio
    }
  };

  const playStampSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(80, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 0.3);
      
      gain.connect(audioCtx.destination);
      osc.connect(gain);
      
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.45);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } catch (e) {}
  };

  // State for progressive text rendering on certificate
  const [writingProgress, setWritingProgress] = useState({
    partner1: 1,
    partner2: 1,
    date: 1,
    location: 1,
    sig1: 1,
    sig2: 1,
    wit1: 1,
    wit2: 1,
    seal: 1,
  });

  // Effect to handle the elaborate automatic "Pen Signing Ceremony"
  useEffect(() => {
    if (stage !== 'writing') return;

    // Set writing states to zero initially
    setWritingProgress({
      partner1: 0,
      partner2: 0,
      date: 0,
      location: 0,
      sig1: 0,
      sig2: 0,
      wit1: 0,
      wit2: 0,
      seal: 0,
    });

    const runCeremony = async () => {
      const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

      // Show pen, move to staging coordinate
      setPenPos({ x: 10, y: 15, opacity: 1, isWriting: false });
      await delay(900);

      // 1. Write Partner 1 Name
      // Location corresponding to Partner 1 text line
      setPenPos({ x: 28, y: 38, opacity: 1, isWriting: true });
      playWritingSound();
      for (let p = 0; p <= 100; p += 5) {
        setWritingProgress((prev) => ({ ...prev, partner1: p / 100 }));
        // Jiggle pen slightly to simulate drawing curves
        setPenPos((prev) => ({ ...prev, x: 20 + (p / 100) * 16 + (p % 2 ? 0.3 : -0.3), isWriting: true }));
        await delay(35);
      }
      setPenPos({ x: 36, y: 35, opacity: 1, isWriting: false });
      await delay(450);

      // 2. Write Partner 2 Name
      setPenPos({ x: 64, y: 38, opacity: 1, isWriting: true });
      playWritingSound();
      for (let p = 0; p <= 100; p += 5) {
        setWritingProgress((prev) => ({ ...prev, partner2: p / 100 }));
        setPenPos((prev) => ({ ...prev, x: 64 + (p / 100) * 16 + (p % 2 ? 0.3 : -0.3), isWriting: true }));
        await delay(35);
      }
      setPenPos({ x: 80, y: 35, opacity: 1, isWriting: false });
      await delay(450);

      // 3. Write Marriage Date
      setPenPos({ x: 38, y: 64, opacity: 1, isWriting: true });
      playWritingSound();
      for (let p = 0; p <= 100; p += 4) {
        setWritingProgress((prev) => ({ ...prev, date: p / 100 }));
        setPenPos((prev) => ({ ...prev, x: 38 + (p / 100) * 24, isWriting: true }));
        await delay(25);
      }
      setPenPos({ x: 62, y: 60, opacity: 1, isWriting: false });
      await delay(400);

      // 4. Write Ceremony Location
      setPenPos({ x: 38, y: 70, opacity: 1, isWriting: true });
      playWritingSound();
      for (let p = 0; p <= 100; p += 4) {
        setWritingProgress((prev) => ({ ...prev, location: p / 100 }));
        setPenPos((prev) => ({ ...prev, x: 38 + (p / 100) * 24, isWriting: true }));
        await delay(25);
      }
      setPenPos({ x: 62, y: 66, opacity: 1, isWriting: false });
      await delay(400);

      // 5. Draw Spouse 1 Signature
      setPenPos({ x: 20, y: 82, opacity: 1, isWriting: true });
      playWritingSound();
      for (let p = 0; p <= 100; p += 8) {
        setWritingProgress((prev) => ({ ...prev, sig1: p / 100 }));
        setPenPos({ x: 20 + (p / 100) * 10 + (p % 2 ? 0.5 : -0.5), y: 82 + (p % 3 ? 1 : -1), opacity: 1, isWriting: true });
        await delay(40);
      }
      setPenPos({ x: 30, y: 78, opacity: 1, isWriting: false });
      await delay(400);

      // 6. Draw Spouse 2 Signature
      setPenPos({ x: 74, y: 82, opacity: 1, isWriting: true });
      playWritingSound();
      for (let p = 0; p <= 100; p += 8) {
        setWritingProgress((prev) => ({ ...prev, sig2: p / 100 }));
        setPenPos({ x: 74 + (p / 100) * 10 + (p % 2 ? 0.5 : -0.5), y: 82 + (p % 3 ? 1 : -1), opacity: 1, isWriting: true });
        await delay(40);
      }
      setPenPos({ x: 84, y: 78, opacity: 1, isWriting: false });
      await delay(400);

      // 7. Sign Witness Name
      setPenPos({ x: 46, y: 82, opacity: 1, isWriting: true });
      playWritingSound();
      for (let p = 0; p <= 100; p += 8) {
        setWritingProgress((prev) => ({ ...prev, wit1: p / 100 }));
        setPenPos({ x: 44 + (p / 100) * 8, y: 82 + (p % 2 ? 0.5 : -0.5), opacity: 1, isWriting: true });
        await delay(30);
      }
      setPenPos({ x: 52, y: 78, opacity: 1, isWriting: false });
      await delay(450);

      // 8. Place Wax Seal Stamp (Drop dynamically from sky!)
      setPenPos({ x: 50, y: 92, opacity: 1, isWriting: true });
      await delay(500);

      // Stamping Wax Seal triggers satisfying slam pop
      setWritingProgress((prev) => ({ ...prev, seal: 1 }));
      playStampSound();
      setShowParticleSparkle(true);
      
      // Withdraw Pen beautifully to top corner
      setPenPos({ x: 92, y: 10, opacity: 1, isWriting: false });
      await delay(800);
      setPenPos((prev) => ({ ...prev, opacity: 0 }));

      // Complete the phase
      await delay(200);
      setStage('completed');
    };

    runCeremony();
  }, [stage]);

  // Clean values on editing back-stage
  useEffect(() => {
    if (stage === 'edit') {
      setWritingProgress({
        partner1: 1,
        partner2: 1,
        date: 1,
        location: 1,
        sig1: 1,
        sig2: 1,
        wit1: 1,
        wit2: 1,
        seal: 1,
      });
      setShowParticleSparkle(false);
    }
  }, [stage]);

  // Exporter to High-Res Image (utilizing HTML5 Canvas fully)
  const handleExportAsImage = async () => {
    setIsExporting(true);
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(300);

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1700; // 2x Certificate dimensions for ultra print-ready clarity
      canvas.height = 1200;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error("Could not initialize canvas context");

      // Draw background theme colour
      ctx.fillStyle = theme.id === 'espresso' ? '#faf6f0' :
                      theme.id === 'matcha' ? '#f4f7f2' :
                      theme.id === 'chai' ? '#fbf5f4' : '#fdf9f2';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Subtle linen noise texture in canvas
      ctx.globalAlpha = 0.05;
      for (let i = 0; i < canvas.width; i += 4) {
        for (let j = 0; j < canvas.height; j += 4) {
          ctx.fillStyle = Math.random() > 0.5 ? '#ffffff' : '#4d3024';
          ctx.fillRect(i, j, 2, 2);
        }
      }
      ctx.globalAlpha = 1.0;

      // Draw Double Flourish Borders
      ctx.strokeStyle = theme.inkColor;
      ctx.lineWidth = 6;
      ctx.strokeRect(32, 32, canvas.width - 64, canvas.height - 64);
      
      ctx.lineWidth = 1.5;
      ctx.strokeRect(48, 48, canvas.width - 96, canvas.height - 96);

      // Corner vector curls
      ctx.fillStyle = theme.inkColor;
      ctx.globalAlpha = 0.35;
      ctx.beginPath();
      // Draw simulated ornamental designs
      ctx.arc(80, 80, 30, 0, Math.PI * 0.5);
      ctx.stroke();
      ctx.arc(canvas.width - 80, 80, 30, Math.PI * 0.5, Math.PI);
      ctx.stroke();
      ctx.globalAlpha = 1.0;

      // Render Title & Details
      ctx.textAlign = 'center';
      
      // Header Label
      ctx.font = 'bold 20px "Inter", sans-serif';
      ctx.fillStyle = '#8C5E3C';
      ctx.fillText('SACRED COVENANT OF MARRIAGE', canvas.width / 2, 160);

      // Certificate of Matrimony Title
      ctx.font = 'italic 76px "Cormorant Garamond", serif';
      ctx.fillStyle = theme.inkColor;
      ctx.fillText('Certificate of Matrimony', canvas.width / 2, 260);

      // Declarative statement
      ctx.font = 'italic 28px "Cormorant Garamond", serif';
      ctx.fillStyle = '#5c4a38';
      ctx.fillText('This documents the sacred and eternal union that joins two hearts as one', canvas.width / 2, 330);

      // Partner Names Titles
      ctx.font = 'bold 18px "Inter", sans-serif';
      ctx.fillStyle = '#8C5E3C';
      ctx.fillText('THE FIRST PARTNER', canvas.width * 0.28, 440);
      ctx.fillText('THE SECOND PARTNER', canvas.width * 0.72, 440);

      // Partner Names
      ctx.font = '64px "Great Vibes", cursive, sans-serif';
      ctx.fillStyle = theme.inkColor;
      ctx.fillText(details.partner1 || 'First Spouse', canvas.width * 0.28, 510);
      ctx.fillText(details.partner2 || 'Second Spouse', canvas.width * 0.72, 510);

      // Love Knot/Infinity Symbol
      ctx.font = 'italic 50px "Cormorant Garamond", serif';
      ctx.fillStyle = theme.inkColor;
      ctx.fillText('❦ and ❦', canvas.width / 2, 490);

      // Vows Panel background
      ctx.strokeStyle = 'rgba(140, 94, 60, 0.15)';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 8]);
      ctx.strokeRect(canvas.width / 2 - 450, 580, 900, 160);
      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(253, 249, 242, 0.4)';
      ctx.fillRect(canvas.width / 2 - 450, 580, 900, 160);

      // Vows Title
      ctx.font = 'bold 16px "Inter", sans-serif';
      ctx.fillStyle = 'rgba(140, 94, 60, 0.6)';
      ctx.fillText('THEIR SOLEMN VOWS', canvas.width / 2, 615);

      // Actual Vows (wrapped text algorithm)
      ctx.font = 'italic 25px "Cormorant Garamond", serif';
      ctx.fillStyle = '#1c120c';
      const maxVowWidth = 840;
      const vowsText = `“${details.customVows || VOWS_PRESETS[0].content}”`;
      const words = vowsText.split(' ');
      let line = '';
      let lineY = 660;
      for (let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + ' ';
        let metrics = ctx.measureText(testLine);
        if (metrics.width > maxVowWidth && n > 0) {
          ctx.fillText(line, canvas.width / 2, lineY);
          line = words[n] + ' ';
          lineY += 32;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, canvas.width / 2, lineY);

      // Date & Location metadata
      const dateText = details.date 
        ? new Date(details.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) 
        : new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      const locationText = details.location || 'The Warm Coffee Shop';

      ctx.font = 'bold 15px "Inter", sans-serif';
      ctx.fillStyle = 'rgba(140, 94, 60, 0.5)';
      ctx.fillText('DATE OF COVENANT', canvas.width * 0.3, 830);
      ctx.fillText('SOLEMNIZED AT', canvas.width * 0.7, 830);

      ctx.font = 'bold italic 24px "Cormorant Garamond", serif';
      ctx.fillStyle = '#1c120c';
      ctx.fillText(dateText, canvas.width * 0.3, 870);
      ctx.fillText(locationText, canvas.width * 0.7, 870);

      // Dividing pillar
      ctx.strokeStyle = 'rgba(92, 39, 35, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 810);
      ctx.lineTo(canvas.width / 2, 880);
      ctx.stroke();

      // Signatures Underlines
      ctx.strokeStyle = theme.inkColor;
      ctx.lineWidth = 1.5;
      
      // Line Partner 1
      ctx.beginPath();
      ctx.moveTo(canvas.width * 0.12, 1070);
      ctx.lineTo(canvas.width * 0.32, 1070);
      ctx.stroke();
      
      // Line Witness
      ctx.beginPath();
      ctx.moveTo(canvas.width * 0.4, 1070);
      ctx.lineTo(canvas.width * 0.6, 1070);
      ctx.stroke();

      // Line Partner 2
      ctx.beginPath();
      ctx.moveTo(canvas.width * 0.68, 1070);
      ctx.lineTo(canvas.width * 0.88, 1070);
      ctx.stroke();

      // Signature Labels
      ctx.font = 'bold 15px "Inter", sans-serif';
      ctx.fillStyle = 'rgba(140, 94, 60, 0.6)';
      ctx.fillText('SIGNATURE', canvas.width * 0.22, 1100);
      ctx.fillText(`WITNESS (${details.witness1 || 'A Friend'})`, canvas.width * 0.5, 1100);
      ctx.fillText('SIGNATURE', canvas.width * 0.78, 1100);

      // Stamp Drawn Signatures (Images)
      const drawImagePromise = (src: string): Promise<HTMLImageElement> => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => resolve(img); // resolve anyway to avoid breaking
          img.src = src;
        });
      };

      // Draw Witness signature text
      ctx.font = '36px "Great Vibes", cursive, sans-serif';
      ctx.fillStyle = '#0a0502';
      ctx.fillText(details.witness1 || 'Love & Co.', canvas.width * 0.5, 1050);

      if (details.signature1) {
        const sig1Img = await drawImagePromise(details.signature1);
        ctx.drawImage(sig1Img, canvas.width * 0.15, 960, 200, 100);
      }
      if (details.signature2) {
        const sig2Img = await drawImagePromise(details.signature2);
        ctx.drawImage(sig2Img, canvas.width * 0.71, 960, 200, 100);
      }

      // Draw Wax Seal Stamp
      const sealHue = theme.id === 'espresso' ? '#5c3e35' :
                        theme.id === 'matcha' ? '#435e49' :
                        theme.id === 'chai' ? '#823d4c' : '#91712a';
      
      ctx.save();
      // Drop shadow for seal
      ctx.shadowColor = 'rgba(40, 24, 18, 0.4)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 5;

      ctx.fillStyle = sealHue;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, 970, 52, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowColor = 'transparent'; // Reset shadow
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(canvas.width / 2, 970, 44, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = 'rgba(255,250,240,0.85)';
      ctx.font = '900 13px "Inter", sans-serif';
      ctx.fillText('HEARTS', canvas.width / 2, 966);
      ctx.font = 'bold 10px "Inter", sans-serif';
      ctx.fillText('UNITED', canvas.width / 2, 982);
      ctx.restore();

      // Render Coffee Rings, Splats, and stains onto the final export!
      const drawCoffeeSplats = () => {
        const ringCol = theme.id === 'matcha' ? 'rgba(74, 110, 80, 0.15)' : 'rgba(115, 80, 50, 0.17)';
        const stainCol = theme.id === 'matcha' ? 'rgba(94, 130, 95, 0.08)' : 'rgba(130, 95, 75, 0.10)';

        details.coffeeRings.forEach((ring) => {
          // Calculate high-res positions
          const rawX = (ring.x / 100) * canvas.width;
          const rawY = (ring.y / 100) * canvas.height;
          const sz = 120 * ring.scale * 1.5;

          ctx.save();
          ctx.translate(rawX, rawY);
          ctx.rotate((ring.rotation * Math.PI) / 180);

          if (ring.type === 'ring') {
            ctx.strokeStyle = ringCol;
            ctx.lineWidth = 4;
            // Draw ring arcs
            ctx.beginPath();
            ctx.arc(0, 0, sz / 2.2, 0, Math.PI * 1.4);
            ctx.stroke();
            
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.arc(0, 0, sz / 2.3, Math.PI * 0.4, Math.PI * 1.8);
            ctx.stroke();
          } else if (ring.type === 'stain') {
            ctx.fillStyle = stainCol;
            ctx.beginPath();
            ctx.ellipse(0, 0, sz / 2, sz / 3.4, 0, 0, Math.PI * 2);
            ctx.fill();
          } else if (ring.type === 'drip') {
            ctx.fillStyle = ringCol;
            ctx.beginPath();
            ctx.arc(0, 0, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(15, -8, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(-10, 14, 3, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        });
      };
      
      drawCoffeeSplats();

      // Export file link
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `marriage_certificate_${(details.partner1 || 'spouse').toLowerCase().replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();

    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="relative w-full overflow-hidden flex flex-col items-center justify-center p-6 min-h-screen">
      
      {/* Floating Sparkle Particles */}
      {showParticleSparkle && (
        <div className="absolute inset-0 pointer-events-none z-50">
          <div className="absolute top-1/4 left-1/4 text-yellow-300 animate-ping opacity-75">✦</div>
          <div className="absolute top-1/3 left-2/3 text-amber-400 animate-pulse delay-300">✶</div>
          <div className="absolute top-2/3 left-1/3 text-emerald-300 animate-ping delay-500">🌸</div>
          <div className="absolute top-1/2 left-1/2 text-rose-300 animate-bounce">♡</div>
          <div className="absolute top-3/4 left-3/4 text-yellow-100 animate-pulse delay-750">✦</div>
        </div>
      )}

      {/* Atmospheric Controls Panel above table */}
      <div className="w-full max-w-5xl flex items-center justify-between mb-4 z-20">
        <button
          type="button"
          onClick={onResetScene}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 hover:bg-white text-stone-700 shadow-sm border border-stone-200/50 text-xs font-sans tracking-wide transition-all"
        >
          <ArrowLeft size={13} /> Edit Covenant Setup
        </button>

        <div className="flex gap-2">
          {stage === 'edit' && (
            <button
              type="button"
              onClick={() => setStage('writing')}
              className="flex items-center gap-2 px-4 py-1.8 bg-amber-800 text-amber-50 hover:bg-amber-900 rounded-full shadow-md font-sans text-xs font-medium tracking-wide transition-all scale-105 active:scale-95"
            >
              <PenTool size={14} className="animate-spin" /> Begin Writing Ceremony
            </button>
          )}

          {stage === 'writing' && (
            <div className="px-5 py-1.5 bg-[#4c3528]/80 text-amber-100/90 rounded-full text-xs font-sans animate-pulse flex items-center gap-2 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              Ceremony in Progress... Ink is setting.
            </div>
          )}

          {stage === 'completed' && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleExportAsImage}
                disabled={isExporting}
                className="flex items-center gap-2 px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-full shadow-md font-sans text-xs font-medium tracking-wide transition-all hover:scale-103 active:scale-97"
              >
                {isExporting ? (
                  <>
                    <RefreshCw size={13} className="animate-spin" /> Gathering Coffee Stains...
                  </>
                ) : (
                  <>
                    <Download size={13} /> Export High-Res Certificate
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStage('writing')}
                className="flex items-center gap-1.5 px-3 py-2 bg-stone-150 hover:bg-stone-200 text-stone-700 rounded-full shadow-sm text-xs border border-stone-200/55 transition-all"
              >
                <RefreshCw size={13} /> Replay
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Desk Table Layout */}
      <div 
        className={`relative w-full max-w-[1100px] h-[720px] rounded-lg shadow-2xl p-6 flex items-center justify-center overflow-hidden transition-all duration-700`}
        style={{
          boxShadow: 'inset 0 0 100px rgba(0,0,0,0.8), 0 35px 60px -15px rgba(0,0,0,0.7)',
          background: theme.id === 'espresso' ? 'radial-gradient(circle, #382721 0%, #150d0a 100%)' :
                     theme.id === 'matcha' ? 'radial-gradient(circle, #2d332d 0%, #0e120e 100%)' :
                     theme.id === 'chai' ? 'radial-gradient(circle, #382427 0%, #170b0c 100%)' :
                     'radial-gradient(circle, #2e2a22 0%, #0e0d0a 100%)',
        }}
      >
        
        {/* Subtle wooden rings texture overlay */}
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 200 200'%3E%3Cpath d='M0 40 C 50 60, 150 20, 200 40 M0 80 C 60 70, 140 100, 200 80 M0 120 C 55 140, 120 110, 200 130 M0 160 C 80 150, 130 180, 200 160' stroke='white' fill='none' strokeWidth='0.5'/%3E%3C/svg%3E")`
          }}
        />

        {/* Scattered Coffee Shop Props & Flowers */}
        <div className="absolute inset-0 pointer-events-none z-10 select-none">
          
          {/* Flickering Cozy Candle holding on Desk (Top-Left) */}
          <div className="absolute top-10 left-12 flex flex-col items-center">
            {/* Candle Pot */}
            <div className="w-12 h-16 bg-stone-100 rounded-b-md shadow-lg border border-white/20 relative flex items-center justify-center">
              <div className="absolute -top-3 w-10 h-3 bg-stone-200 rounded-full border border-stone-300 flex items-center justify-center">
                <div className="w-6 h-6 bg-[#A1C9A4] rounded-full blur-[2px] opacity-10" />
              </div>
              <span className="text-[7px] text-stone-400 font-mono scale-90">COZY</span>
              
              {/* Flame (animated) */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center justify-center">
                {/* Outer Glow */}
                <span className="absolute w-12 h-12 bg-amber-400/20 rounded-full blur-[10px] animate-pulse" />
                {/* Yellow core */}
                <div 
                  className="w-3 h-5 bg-amber-400 rounded-full rotate-[-5deg] animate-bounce blur-[0.5px]"
                  style={{
                    animationDuration: '1.4s',
                    boxShadow: '0 0 12px #f59e0b, 0 0 20px #d97706'
                  }}
                />
              </div>
            </div>
            {/* Wooden Coaster */}
            <div className="w-16 h-2 bg-[#5c4436] rounded-full shadow-md" />
          </div>

          {/* Coffee Mug with clickable stamp activation (Top-Right) */}
          <div className="absolute top-8 right-16 flex flex-col items-center pointer-events-auto">
            <div 
              onClick={() => {
                const types: ('ring' | 'stain' | 'drip')[] = ['ring', 'stain', 'drip'];
                const next = stampingMode === 'ring' ? 'stain' : stampingMode === 'stain' ? 'drip' : stampingMode === 'drip' ? null : 'ring';
                setStampingMode(next);
                if (next) playStampSound();
              }}
              className={`w-20 h-20 rounded-full flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-108 active:scale-95 shadow-2xl relative ${
                stampingMode ? 'ring-4 ring-amber-500 ring-offset-4 ring-offset-stone-900 scale-103' : ''
              } ${theme.mugColor}`}
              title="Click to stamp coffee spots or dry trails!"
            >
              {/* Coffee Liquid / Latte pattern inside */}
              <div className="w-16 h-16 rounded-full bg-[#4e3629] border-[3px] border-amber-900/30 flex items-center justify-center overflow-hidden">
                {/* Latte Art Foam */}
                <div className="w-12 h-12 rounded-full border border-orange-100/20 bg-gradient-to-tr from-[#c8ab97] via-[#f7ebd9] to-[#8d6e63] flex items-center justify-center shadow-inner">
                  {/* Fluffy Heart Latte Art SVG */}
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#fdf0e6" className="opacity-80">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>
              </div>

              {/* Handle */}
              <div className={`absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-8 rounded-r-md border-[4px] shadow-sm ${theme.mugColor}`} />

              {/* Rising Coffee Steam (Animated SVG inline) */}
              <div className="absolute -top-12 inset-x-0 flex justify-center gap-1.5 pointer-events-none opacity-40">
                <svg width="6" height="25" className="animate-pulse" style={{ animationDuration: '3s' }}>
                  <path d="M 3 25 Q 6 18, 0 12 T 3 0" fill="none" stroke="#fcf6ec" strokeWidth="1.2" />
                </svg>
                <svg width="6" height="25" className="animate-pulse delay-750" style={{ animationDuration: '2.5s' }}>
                  <path d="M 3 25 Q 0 18, 6 12 T 3 0" fill="none" stroke="#fcf6ec" strokeWidth="1" />
                </svg>
              </div>
            </div>
            
            <span className="text-[9px] font-sans text-stone-300 tracking-widest uppercase mt-2.5 opacity-80 text-center self-center flex items-center gap-1 bg-[#1a110e]/70 px-2 py-0.5 rounded-full shadow-inner">
              <Coffee size={10} className="text-amber-500 animate-pulse" /> Mug Stamp
            </span>

            {/* Coffee stamp context helper bubble on hover/active */}
            {stampingMode && (
              <div className="absolute top-24 origin-top bg-amber-950 border border-amber-800 text-stone-100 text-[9px] p-2 rounded-md shadow-xl text-center w-28 scale-100 transition-all font-sans">
                <span className="font-bold block uppercase tracking-wider text-amber-300">Stamping Active</span>
                <span>Click certificate to stamp a <b>{stampingMode}</b>!</span>
              </div>
            )}
          </div>

          {/* Scattered Theme-based Petals / Grains */}
          <div className="absolute bottom-16 left-16 flex gap-2">
            {theme.id === 'matcha' ? (
              <>
                <Leaf size={14} className="text-emerald-800/40 rotate-[35deg] transform hover:scale-110 cursor-pointer pointer-events-auto" />
                <Leaf size={10} className="text-emerald-800/20 rotate-[-15deg]" />
              </>
            ) : theme.id === 'chai' ? (
              <>
                <span className="text-lg opacity-35 filter blur-[0.2px] rotate-12 inline-block">🌸</span>
                <span className="text-sm opacity-20 rotate-[-45deg] inline-block">🌸</span>
              </>
            ) : theme.id === 'espresso' ? (
              <div className="flex gap-1.5">
                {/* Render three tiny coffee beans */}
                <div className="w-2.5 h-4 bg-[#2b170e] rounded-full rotate-45 shadow-md border border-amber-950" />
                <div className="w-2.5 h-4 bg-[#3d2316] rounded-full rotate-[-25deg] shadow-md border border-amber-950" />
              </div>
            ) : (
              <>
                <div className="w-2.5 h-4 bg-[#d9a05b] rounded-full rotate-12 shadow-sm" />
                <span className="text-xs opacity-30">🌻</span>
              </>
            )}
          </div>

        </div>

        {/* Polaroid Photos arranged organically around the table on the desk */}
        <div className="absolute inset-x-0 bottom-4 pointer-events-none z-10 select-none flex justify-between px-10 h-36">
          
          {/* Polaroid 1 (Left Spouse) */}
          {details.polaroid1 && (
            <motion.div 
              initial={{ opacity: 0, y: 50, rotate: -8 }}
              animate={{ opacity: 1, y: 0, rotate: -6 }}
              className="pointer-events-auto bg-[#faf8f2] p-2.5 pb-6 border border-white/10 rounded-xs shadow-xl h-44 w-36 overflow-hidden flex flex-col justify-between"
              style={{
                boxShadow: '0 8px 20px -3px rgba(0,0,0,0.5)',
              }}
            >
              <div className="aspect-square w-full bg-stone-300 overflow-hidden border border-black/5">
                <img 
                  src={details.polaroid1} 
                  alt="Partner 1 portrait" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover sepia-[15%] filter"
                />
              </div>
              <div className="text-center font-serif italic text-amber-950/70 text-xs mt-1.5 overflow-hidden truncate">
                {details.polaroidCaption1 || 'Spouse 1'}
              </div>
            </motion.div>
          )}

          {/* Polaroid 2 (Right Spouse or Single Couple Photo) */}
          {details.polaroid2 && (
            <motion.div 
              initial={{ opacity: 0, y: 50, rotate: 8 }}
              animate={{ opacity: 1, y: 0, rotate: 6 }}
              className="pointer-events-auto bg-[#faf8f2] p-2.5 pb-6 border border-white/10 rounded-xs shadow-xl h-44 w-36 overflow-hidden flex flex-col justify-between"
              style={{
                boxShadow: '0 8px 20px -3px rgba(0,0,0,0.5)',
              }}
            >
              <div className="aspect-square w-full bg-stone-300 overflow-hidden border border-black/5">
                <img 
                  src={details.polaroid2} 
                  alt="Partner 2 portrait" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover sepia-[15%] filter"
                />
              </div>
              <div className="text-center font-serif italic text-amber-950/70 text-xs mt-1.5 overflow-hidden truncate">
                {details.polaroidCaption2 || 'Spouse 2'}
              </div>
            </motion.div>
          )}

        </div>

        {/* Certificate Display Screen */}
        <div className="relative transform scale-[0.95] md:scale-100 z-0">
          <Certificate
            details={details}
            theme={theme}
            writingProgress={writingProgress}
            onAddCoffeeRing={onAddCoffeeRing}
            stampingMode={stampingMode}
            isInteractive={stage === 'completed'}
          />
        </div>

        {/* Elegant Floating Fountain Pen Cursor / Writing Overlay */}
        <AnimatePresence>
          {penPos.opacity > 0 && (
            <motion.div
              className="absolute pointer-events-none z-50 transition-all duration-300 w-16 h-16 origin-bottom-left"
              style={{
                left: `${penPos.x}%`,
                top: `${penPos.y}%`,
                opacity: penPos.opacity,
                transform: `translate(-15%, -85%) rotate(${penPos.isWriting ? '-42deg' : '-35deg'})`,
              }}
              animate={penPos.isWriting ? {
                y: [0, -2, 2, -1, 1, 0],
                x: [0, 1, -1, 1, 0, 0],
                transition: {
                  repeat: Infinity,
                  duration: 0.25,
                }
              } : {}}
            >
              {/* Elegant Gold Fountain Pen Nib Artwork SVG */}
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <g filter="url(#shadow)">
                  {/* Pen Body/Casing */}
                  <path d="M50 4 L14 40 L18 44 L54 8 Z" fill="url(#metal-gold)" />
                  <path d="M14 40 L2 52 L6 56 L18 44 Z" fill="url(#nib-gold)" stroke="#78592c" strokeWidth="0.8" />
                  {/* Active Ink tip point */}
                  <circle cx="2" cy="52" r="1.5" fill="#3e2723" />
                  {/* Ink slit line */}
                  <line x1="2" y1="52" x2="10" y2="44" stroke="#4a3114" strokeWidth="1" />
                  <circle cx="10" cy="44" r="1.2" fill="#522a07" />
                </g>
                <defs>
                  <linearGradient id="metal-gold" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#ffd700" />
                    <stop offset="50%" stopColor="#b8860b" />
                    <stop offset="100%" stopColor="#cd7f32" />
                  </linearGradient>
                  <linearGradient id="nib-gold" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="30%" stopColor="#f3e5ab" />
                    <stop offset="70%" stopColor="#b8860b" />
                    <stop offset="100%" stopColor="#4a3b05" />
                  </linearGradient>
                  <filter id="shadow" x="0" y="0" width="80" height="80">
                    <feDropShadow dx="3" dy="5" stdDeviation="2" floodOpacity="0.35" />
                  </filter>
                </defs>
              </svg>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      <div className="mt-4 text-[10px] text-stone-500 font-mono tracking-wider bg-stone-100 px-3 py-1 rounded-sm text-center">
        ✦ Interactive Pinteresty Scrapbook Desk • Use Stamp Coffee Cup to add spills & drip rings! ✶
      </div>
    </div>
  );
}
