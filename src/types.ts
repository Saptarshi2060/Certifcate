/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CoffeeRing {
  id: string;
  x: number; // percentage from left (0-100)
  y: number; // percentage from top (0-100)
  rotation: number; // degrees
  scale: number;
  type: 'ring' | 'stain' | 'drip';
}

export interface SignatureStroke {
  points: { x: number; y: number }[];
}

export type CertificateThemeId = 'espresso' | 'matcha' | 'chai' | 'honey';

export interface CertificateTheme {
  id: CertificateThemeId;
  name: string;
  description: string;
  paperBg: string; // Tailwind class or hex
  textColor: string;
  inkColor: string;
  accentColor: string;
  borderColor: string;
  sealColor: string;
  deskBg: string; // Background for the desk
  mugColor: string;
}

export interface CertificateTemplate {
  id: string;
  name: string;
  borderStyle: string; // 'botanical', 'minimal', 'classic-baroque'
}

export interface MarriageDetails {
  partner1: string;
  partner2: string;
  vowsPreset: string;
  customVows: string;
  date: string;
  location: string;
  witness1: string;
  witness2: string;
  photoOption: 'single' | 'separate' | 'none';
  polaroid1: string | null; // dataURL or image source
  polaroid2: string | null;
  polaroidCaption1: string;
  polaroidCaption2: string;
  coffeeRings: CoffeeRing[];
  signature1: string | null; // DataURL of drawn signature
  signature2: string | null;
  witnessSignature1: string | null;
  witnessSignature2: string | null;
}

export const THEMES: Record<CertificateThemeId, CertificateTheme> = {
  espresso: {
    id: 'espresso',
    name: 'Espresso Roast',
    description: 'Rich coffee brown, linen papers, and dark cocoa ink.',
    paperBg: 'bg-[#faf6f0] shadow-xl border-amber-900/10',
    textColor: 'text-amber-950',
    inkColor: '#3e2723', // deep brown
    accentColor: 'text-amber-800 border-amber-900/20',
    borderColor: 'border-amber-900/30',
    sealColor: 'bg-[#5c3e35]',
    deskBg: 'bg-gradient-to-br from-[#2a1b18] via-[#1d1210] to-[#120a09]', // deep dark mahogany wood desk
    mugColor: 'bg-[#eee4d9]',
  },
  matcha: {
    id: 'matcha',
    name: 'Matcha Moss',
    description: 'Earthy sage, morning dew, and forest botanical borders.',
    paperBg: 'bg-[#f4f7f2] shadow-xl border-emerald-900/10',
    textColor: 'text-[#1e3422]',
    inkColor: '#1b321f', // dark matcha forest green
    accentColor: 'text-emerald-800 border-emerald-900/20',
    borderColor: 'border-emerald-800/20',
    sealColor: 'bg-[#435e49]',
    deskBg: 'bg-gradient-to-br from-[#2b332d] via-[#1a211b] to-[#0f1411]', // slate or dark granite forest desk
    mugColor: 'bg-[#e2edd9]',
  },
  chai: {
    id: 'chai',
    name: 'Chai Rose',
    description: 'Blush pink, cozy cardamom tones, and delicate floral hints.',
    paperBg: 'bg-[#fbf5f4] shadow-xl border-rose-900/10',
    textColor: 'text-rose-950',
    inkColor: '#4a1525', // rosewood burgundy ink
    accentColor: 'text-rose-800 border-rose-900/20',
    borderColor: 'border-rose-300/40',
    sealColor: 'bg-[#823d4c]',
    deskBg: 'bg-gradient-to-br from-[#302123] via-[#211416] to-[#150a0b]', // rich dark cedar wood desk
    mugColor: 'bg-[#fae3e3]',
  },
  honey: {
    id: 'honey',
    name: 'Lavender Honey',
    description: 'Amber warmth, delicate purples, and rich sunflower borders.',
    paperBg: 'bg-[#fdf9f2] shadow-xl border-amber-800/10',
    textColor: 'text-[#3d2f0a]',
    inkColor: '#2b1d04', // charcoal amber ink
    accentColor: 'text-amber-700 border-amber-700/20',
    borderColor: 'border-amber-600/30',
    sealColor: 'bg-[#91712a]',
    deskBg: 'bg-gradient-to-br from-[#24211a] via-[#171510] to-[#0d0c09]', // charcoal warm desk
    mugColor: 'bg-[#fcf3cf]',
  },
};

export const VOWS_PRESETS = [
  {
    id: 'coffee',
    title: 'A Lifetime of Coffee Mornings',
    content: 'I promise to stand by your side through every sunrise and sunset, to brew your morning coffee exactly the way you love it, and to cherish our quiet moments together above all else. Today, tomorrow, and for all our cozy days, we write our future together.',
  },
  {
    id: 'classic',
    title: 'Classic & Timeless Promises',
    content: 'To have and to hold from this day forward, for better, for worse, in sickness and in health, to love and to cherish, till death do us part. I pledge my deep devotion and swear to support you, laugh with you, and love you unconditionally as your partner in all things.',
  },
  {
    id: 'whimsical',
    title: 'Whimsical & Adventurous',
    content: 'I promise to find magic in the ordinary with you. To dance with you in the kitchen, to read books with you on rainy Sunday afternoons, to explore untrodden paths, and to wrap you warm on cold nights. You are my home, my favorite adventure, and my daily cup of joy.',
  },
  {
    id: 'minimalist',
    title: 'Short & Soulful',
    content: 'In your hands, my heart is home. I promise to support your dreams, cushion your falls, share your silences, and celebrate your triumphs. I choose you today, and every single day that follows, with peaceful joy and steady devotion.',
  },
];
