/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MarriageDetails, CertificateThemeId, THEMES, VOWS_PRESETS } from '../types';
import PolaroidUpload from './PolaroidUpload';
import SignaturePad from './SignaturePad';
import { Heart, BookOpen, Calendar, MapPin, Feather, Sparkles, Sliders } from 'lucide-react';

interface CovenantFormProps {
  details: MarriageDetails;
  setDetails: React.Dispatch<React.SetStateAction<MarriageDetails>>;
  themeId: CertificateThemeId;
  setThemeId: (id: CertificateThemeId) => void;
  onSubmit: () => void;
}

export default function CovenantForm({
  details,
  setDetails,
  themeId,
  setThemeId,
  onSubmit,
}: CovenantFormProps) {
  const [activeTab, setActiveTab] = useState<'partners' | 'vows' | 'signatures'>('partners');

  // Input change helper
  const updateField = (key: keyof MarriageDetails, value: any) => {
    setDetails((prev) => ({ ...prev, [key]: value }));
  };

  const selectedTheme = THEMES[themeId];

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-xl border border-amber-900/10 overflow-hidden flex flex-col md:flex-row h-auto md:h-[680px]">
      
      {/* Visual Settings Palette Left Sidebar */}
      <div className="md:w-64 bg-[#fbf9f5] border-r border-stone-200/50 p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Heart size={16} className="text-amber-700 animate-pulse" />
            <h2 className="text-sm font-semibold uppercase tracking-widest text-[#725445] font-sans">
              Aesthetic Theme
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {Object.values(THEMES).map((t) => {
              const themeColors = {
                espresso: 'bg-[#5c3e35]',
                matcha: 'bg-[#435e49]',
                chai: 'bg-[#823d4c]',
                honey: 'bg-[#91712a]',
              };

              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setThemeId(t.id)}
                  className={`flex flex-col text-left p-3 rounded-md transition-all border ${
                    themeId === t.id
                      ? 'bg-amber-50 border-amber-800/30 ring-1 ring-amber-800/20 shadow-sm'
                      : 'border-transparent hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-3.5 h-3.5 rounded-full ${themeColors[t.id]} border border-black/10`} />
                    <span className="text-xs font-semibold text-stone-800">{t.name}</span>
                  </div>
                  <span className="text-[10px] text-stone-500 leading-snug">{t.description}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 md:mt-0 pt-4 border-t border-stone-200/50 text-[10px] text-stone-400 font-sans leading-relaxed">
          <p>Every theme incorporates warm botanical lines, handwritten styles, and retro elements optimized for aesthetic Pinterest moodboards.</p>
        </div>
      </div>

      {/* Main Form Fields Container (Right Side) */}
      <div className="flex-1 flex flex-col justify-between p-6">
        
        {/* Step Tabs header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('partners')}
              className={`pb-2 text-xs font-semibold uppercase tracking-wider font-sans transition-all border-b-2 ${
                activeTab === 'partners'
                  ? 'border-amber-800 text-amber-900'
                  : 'border-transparent text-stone-400 hover:text-stone-600'
              }`}
            >
              Hearts & Photos
            </button>
            <button
              onClick={() => setActiveTab('vows')}
              className={`pb-2 text-xs font-semibold uppercase tracking-wider font-sans transition-all border-b-2 ${
                activeTab === 'vows'
                  ? 'border-amber-800 text-amber-900'
                  : 'border-transparent text-stone-400 hover:text-stone-600'
              }`}
            >
              The Vows
            </button>
            <button
              onClick={() => setActiveTab('signatures')}
              className={`pb-2 text-xs font-semibold uppercase tracking-wider font-sans transition-all border-b-2 ${
                activeTab === 'signatures'
                  ? 'border-amber-800 text-amber-900'
                  : 'border-transparent text-stone-400 hover:text-stone-600'
              }`}
            >
              Signatures & Seals
            </button>
          </div>

          <div className="text-[10px] text-stone-400 font-mono tracking-wider italic">
            ✶ draft phase ✶
          </div>
        </div>

        {/* Form Body - scrollable content */}
        <div className="flex-1 overflow-y-auto py-5 pr-2 max-h-[460px]">
          
          {/* Tab 1: Spouses & Photos */}
          {activeTab === 'partners' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-amber-900/70 mb-1">
                    First Spouse Name
                  </label>
                  <input
                    type="text"
                    value={details.partner1}
                    onChange={(e) => updateField('partner1', e.target.value)}
                    placeholder="e.g., Aurelia Rose"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-sm text-sm focus:outline-none focus:border-amber-700/60"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-amber-900/70 mb-1">
                    Second Spouse Name
                  </label>
                  <input
                    type="text"
                    value={details.partner2}
                    onChange={(e) => updateField('partner2', e.target.value)}
                    placeholder="e.g., Julian Vance"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-sm text-sm focus:outline-none focus:border-amber-700/60"
                  />
                </div>
              </div>

              {/* Photo Upload Options */}
              <div className="border-t border-stone-100 pt-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-900/70 block">
                    Upload Polaroid Portals
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => updateField('photoOption', 'separate')}
                      className={`px-2.5 py-1 text-[10px] rounded-full font-medium ${
                        details.photoOption === 'separate' ? 'bg-[#7a5a4c] text-white' : 'bg-stone-100 text-stone-500'
                      }`}
                    >
                      Self & Spouse
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField('photoOption', 'single')}
                      className={`px-2.5 py-1 text-[10px] rounded-full font-medium ${
                        details.photoOption === 'single' ? 'bg-[#7a5a4c] text-white' : 'bg-stone-100 text-stone-500'
                      }`}
                    >
                      Single Couple Photo
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField('photoOption', 'none')}
                      className={`px-2.5 py-1 text-[10px] rounded-full font-medium ${
                        details.photoOption === 'none' ? 'bg-[#7a5a4c] text-white' : 'bg-stone-100 text-stone-500'
                      }`}
                    >
                      No Photos
                    </button>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 justify-center items-center py-2 bg-amber-50/[0.1] border border-dashed border-amber-900/5 rounded-md">
                  {details.photoOption === 'separate' && (
                    <>
                      <PolaroidUpload
                        label="First Spouse Picture"
                        imageSrc={details.polaroid1}
                        onImageChange={(src) => updateField('polaroid1', src)}
                        caption={details.polaroidCaption1}
                        onCaptionChange={(cap) => updateField('polaroidCaption1', cap)}
                        placeholderText="A beautiful photo of you"
                      />
                      <PolaroidUpload
                        label="Second Spouse Picture"
                        imageSrc={details.polaroid2}
                        onImageChange={(src) => updateField('polaroid2', src)}
                        caption={details.polaroidCaption2}
                        onCaptionChange={(cap) => updateField('polaroidCaption2', cap)}
                        placeholderText="A cozy photo of partner"
                      />
                    </>
                  )}

                  {details.photoOption === 'single' && (
                    <PolaroidUpload
                      label="Our Couple Photograph"
                      imageSrc={details.polaroid1}
                      onImageChange={(src) => {
                        updateField('polaroid1', src);
                        // Also mirror to second slot for aesthetic backup
                        updateField('polaroid2', null);
                      }}
                      caption={details.polaroidCaption1}
                      onCaptionChange={(cap) => updateField('polaroidCaption1', cap)}
                      placeholderText="Upload your favorite couple moment"
                    />
                  )}

                  {details.photoOption === 'none' && (
                    <div className="p-4 text-center text-stone-400 text-xs py-8">
                      No polaroid photographs configured. Your certificate will focus entirely on standard parchment text.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Vows & Details */}
          {activeTab === 'vows' && (
            <div className="space-y-5 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-amber-900/70 mb-1 flex items-center gap-1.5">
                    <Calendar size={13} /> Celebration Date
                  </label>
                  <input
                    type="date"
                    value={details.date}
                    onChange={(e) => updateField('date', e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-sm text-sm focus:outline-none focus:border-amber-700/60"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-amber-900/70 mb-1 flex items-center gap-1.5">
                    <MapPin size={13} /> Union Venue / Location
                  </label>
                  <input
                    type="text"
                    value={details.location}
                    onChange={(e) => updateField('location', e.target.value)}
                    placeholder="e.g., Cozy Kitchen at Dawn, Lake Alpine"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-sm text-sm focus:outline-none focus:border-amber-700/60"
                  />
                </div>
              </div>

              {/* Vows Picker */}
              <div className="border-t border-stone-100 pt-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <BookOpen size={13} className="text-[#8C5E3C]" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-900/70">
                    Select Cozy Vows Preset
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  {VOWS_PRESETS.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => {
                        updateField('vowsPreset', v.id);
                        updateField('customVows', v.content);
                      }}
                      className={`text-left p-2.5 rounded-md border text-xs transition-colors ${
                        details.vowsPreset === v.id
                          ? 'bg-amber-100/35 border-amber-800/40 text-amber-950 font-medium'
                          : 'bg-white border-stone-200/70 text-stone-600 hover:bg-[#FAF9F6]'
                      }`}
                    >
                      <span className="font-semibold block mb-0.5">{v.title}</span>
                      <span className="text-[10px] text-stone-400 block truncate">{v.content}</span>
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-red-950/40 mb-1">
                    Or scribe custom marital vows & promises...
                  </label>
                  <textarea
                    rows={4}
                    value={details.customVows}
                    onChange={(e) => {
                      updateField('customVows', e.target.value);
                      updateField('vowsPreset', 'custom');
                    }}
                    placeholder="Enter your beautiful vows here..."
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-sm text-xs italic font-serif focus:outline-none focus:border-amber-700/60 leading-relaxed text-stone-800"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Signatures & Witness */}
          {activeTab === 'signatures' && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SignaturePad
                  label="First Spouse"
                  nameKey={details.partner1 || 'First Spouse'}
                  value={details.signature1}
                  onChange={(dUrl) => updateField('signature1', dUrl)}
                  inkColor={selectedTheme.inkColor}
                />
                <SignaturePad
                  label="Second Spouse"
                  nameKey={details.partner2 || 'Second Spouse'}
                  value={details.signature2}
                  onChange={(dUrl) => updateField('signature2', dUrl)}
                  inkColor={selectedTheme.inkColor}
                />
              </div>

              {/* Witness Section */}
              <div className="border-t border-stone-100 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-amber-900/70 mb-1 flex items-center gap-1">
                      <Feather size={12} /> Key Witness Name
                    </label>
                    <input
                      type="text"
                      value={details.witness1}
                      onChange={(e) => updateField('witness1', e.target.value)}
                      placeholder="e.g., Warm Cup of Latte, Sunbeams"
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-sm text-sm focus:outline-none focus:border-amber-700/60"
                    />
                    <span className="text-[10px] text-stone-400 block mt-1 leading-snug">
                      Your witness can be a person, a cozy concept (like "Warm Sunbeans"), or an adored pet!
                    </span>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-sm border border-stone-250/50 flex flex-col items-center justify-center text-center h-24">
                    <Sparkles size={16} className="text-amber-600 mb-1" />
                    <span className="text-xs font-sans font-semibold text-[#8C5E3C]">Lover's Wax Stamp: Set</span>
                    <span className="text-[10px] text-stone-450 mt-1">
                      A premium, warm gold-wax seal will be stamped dynamically in the center of the certificate.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Form Bottom Submission Buttons */}
        <div className="border-t border-stone-100 pt-4 flex justify-between items-center bg-white">
          <div className="text-[10px] text-stone-400 font-sans">
            Make sure names & details are spelled correctly before starting your ceremony.
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onSubmit}
              className="px-5 py-2.5 bg-amber-800 hover:bg-amber-900 text-amber-50 font-sans text-xs font-semibold tracking-wider uppercase rounded-full shadow-md transition-all active:scale-95 flex items-center gap-1.5"
            >
              Prepare Ceremony Desk &rarr;
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
