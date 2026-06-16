/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { Eraser, Check, Edit2, Sparkles, RefreshCw } from 'lucide-react';

interface SignaturePadProps {
  label: string;
  nameKey: string; // The text name of the person (e.g. Partner 1)
  value: string | null; // DataURL output
  onChange: (dataUrl: string | null) => void;
  inkColor: string;
}

export default function SignaturePad({
  label,
  nameKey,
  value,
  onChange,
  inkColor = '#3e2723',
}: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [showAutoType, setShowAutoType] = useState(false);

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = inkColor;

    // If there is an existing signature dataUrl, draw it on the canvas
    if (value) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        setHasDrawn(true);
      };
      img.src = value;
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasDrawn(false);
    }
  }, [value, inkColor]);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent | TouchEvent): { x: number; y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    
    // Check if TouchEvent
    if ('touches' in e) {
      if (e.touches.length === 0) return null;
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const coords = getCoordinates(e);
    if (!coords) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const coords = getCoordinates(e);
    if (!coords) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
    setHasDrawn(true);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    saveSignature();
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Check if the canvas is blank
    if (!hasDrawn) {
      onChange(null);
      return;
    }

    const dataUrl = canvas.toDataURL('image/png');
    onChange(dataUrl);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    onChange(null);
  };

  // Automatically generates a beautiful, clean italicized brush stroke style signature
  const autoGenerateSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw using standard Great Vibes cursive representation
    ctx.save();
    ctx.font = 'italic 34px "Great Vibes", cursive, sans-serif';
    ctx.fillStyle = inkColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Adding a subtle underline flourish to simulate a real signature
    const text = nameKey || 'Lover';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2 - 5);
    
    // Draw gold flourish underscore
    ctx.beginPath();
    ctx.strokeStyle = inkColor;
    ctx.lineWidth = 1.8;
    const startX = Math.max(10, canvas.width / 2 - 60);
    const endX = Math.min(canvas.width - 10, canvas.width / 2 + 60);
    const midY = canvas.height / 2 + 18;
    
    // Swoosh flourish curve
    ctx.moveTo(startX, midY);
    ctx.bezierCurveTo(startX + 30, midY + 4, endX - 30, midY - 6, endX, midY + 2);
    ctx.stroke();

    ctx.restore();
    
    setHasDrawn(true);
    // Trigger tick delay to let the raster finalize
    setTimeout(() => {
      const dataUrl = canvas.toDataURL('image/png');
      onChange(dataUrl);
    }, 50);
  };

  return (
    <div className="flex flex-col gap-2 w-full p-3 bg-stone-50 border border-stone-200 rounded-md">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-semibold text-amber-900/70 font-sans tracking-wider uppercase">
          {label} Signature <span className="text-stone-400 font-normal">({nameKey || 'Enter name'})</span>
        </label>

        <div className="flex gap-2 text-[10px]">
          <button
            type="button"
            onClick={autoGenerateSignature}
            className="flex items-center gap-1 text-[#8C5E3C] hover:text-amber-800 transition-colors"
            title="Auto-sign in elegant cursive Script"
          >
            <Sparkles size={11} /> Auto Calligraphy
          </button>
          
          {hasDrawn && (
            <button
              type="button"
              onClick={clearCanvas}
              className="flex items-center gap-1 text-red-700 hover:text-red-900 transition-colors"
            >
              <Eraser size={11} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Signature drawing area */}
      <div className="relative w-full h-24 bg-white border border-stone-200/85 rounded-sm overflow-hidden flex items-center justify-center cursor-crosshair">
        <canvas
          ref={canvasRef}
          width={300}
          height={96}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="absolute inset-0 w-full h-full"
        />

        {!hasDrawn && (
          <div className="pointer-events-none text-stone-300 text-[11px] flex flex-col items-center gap-1 font-sans">
            <Edit2 size={14} className="opacity-40 animate-bounce" />
            <span>Scribble signature here or click Auto Calligraphy</span>
          </div>
        )}
      </div>
    </div>
  );
}
