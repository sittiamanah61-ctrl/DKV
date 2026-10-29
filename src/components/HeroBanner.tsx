import React from 'react';
import { ActiveTab } from '../types';
import { Sparkles, ArrowRight, BookOpen, PenTool, Award, Play, CheckCircle2 } from 'lucide-react';

interface HeroBannerProps {
  onNavigate: (tab: ActiveTab) => void;
  unlockedBadgesCount: number;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onNavigate, unlockedBadgesCount }) => {
  return (
    <div className="relative rounded-2xl border border-stone-200 bg-white bg-grid-notebook overflow-hidden shadow-xs">
      {/* Decorative vector corner handles */}
      <div className="vector-handle top-3 left-3" />
      <div className="vector-handle top-3 right-3" />
      <div className="vector-handle bottom-3 left-3" />
      <div className="vector-handle bottom-3 right-3" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-10 items-center">
        {/* Left Column: Headline and Call-to-actions */}
        <div className="lg:col-span-7 space-y-5">
          {/* Natural human editorial kicker */}
          <div className="flex items-center gap-2 text-xs text-stone-600 font-mono">
            <span className="font-bold text-stone-900">Kurikulum Merdeka SMK</span>
            <span aria-hidden="true">·</span>
            <span>Kompetensi Keahlian DKV Kelas 10</span>
            <span aria-hidden="true">·</span>
            <span>Tahun Ajaran 2026/2027</span>
          </div>

          <h1 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-stone-900 tracking-tight leading-[1.12]">
            Eksplorasi Rupa, Tipografi & Nirmana Interaktif
          </h1>

          <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-xl">
            Selamat datang di studio belajar Desain Komunikasi Visual kelas 10. Jelajahi modul interaktif, simulator anatomi huruf & gelombang nirmana, portofolio karya siswa, serta daily asesmen terpadu.
          </p>

          {/* Quick Pillar Tags */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-stone-700 pt-1">
            <span className="bg-stone-100/90 border border-stone-200 px-3 py-1 rounded-md">
              01. Prinsip Desain
            </span>
            <span className="bg-stone-100/90 border border-stone-200 px-3 py-1 rounded-md">
              02. Tipografi
            </span>
            <span className="bg-stone-100/90 border border-stone-200 px-3 py-1 rounded-md">
              03. Nirmana Dwimatra
            </span>
            <span className="bg-stone-100/90 border border-stone-200 px-3 py-1 rounded-md">
              04. Desain Poster
            </span>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={() => onNavigate('modul')}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-stone-900 rounded-lg hover:bg-stone-800 transition-all shadow-xs"
            >
              <BookOpen className="w-4 h-4" />
              <span>Buka Modul Teori</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onNavigate('studio-interaktif')}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-emerald-900 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
            >
              <PenTool className="w-4 h-4 text-emerald-700" />
              <span>Studio Nirmana & Type</span>
            </button>

            <button
              onClick={() => onNavigate('asesmen')}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors"
            >
              <Award className="w-4 h-4 text-amber-500" />
              <span>Daily Asesmen (10 PG + 5 Esai)</span>
            </button>
          </div>

          {/* Student Status indicator */}
          <div className="pt-2 flex items-center gap-4 text-xs text-stone-500 font-mono">
            <span>Prestasi Siswa: <strong className="text-stone-800">{unlockedBadgesCount} Lencana Aktif</strong></span>
            <span>·</span>
            <span>Pengampu: Ibu Sitti Saadah Al amanah, S.Kom</span>
          </div>
        </div>

        {/* Right Column: Visual Artwork Canvas featuring User Uploaded Sketch Reference */}
        <div className="lg:col-span-5 relative flex justify-center">
          <div className="relative w-full max-w-sm rounded-xl overflow-hidden border border-stone-300 shadow-md bg-white p-2">
            {/* Visual selection box styling mimicking vector design software */}
            <div className="relative rounded-lg overflow-hidden border border-stone-200 bg-stone-50">
              <img
                src="/assets/aistudio/image_e92f0533.png"
                alt="Desain Grafis Studio DKV"
                className="w-full h-auto object-contain"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes('/assets/aistudio/')) {
                    target.src = '/assets/aistudio/image_e92f0533.png';
                  }
                }}
              />

              {/* Bounding box guide overlaid */}
              <div className="absolute inset-1 border border-stone-900/40 pointer-events-none">
                <div className="vector-handle -top-1 -left-1" />
                <div className="vector-handle -top-1 -right-1" />
                <div className="vector-handle -bottom-1 -left-1" />
                <div className="vector-handle -bottom-1 -right-1" />
              </div>
            </div>

            {/* Quick Caption Strip */}
            <div className="mt-2.5 px-2 py-1 flex items-center justify-between text-[11px] text-stone-600">
              <span className="font-semibold text-stone-900">DKV Reference Artboard</span>
              <span className="font-mono text-[10px] text-stone-400">Grid: 28px · Vector Bézier</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
