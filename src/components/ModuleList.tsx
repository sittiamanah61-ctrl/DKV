import React, { useState } from 'react';
import { INITIAL_MODULES } from '../data/dkvData';
import { ModuleItem, ActiveTab } from '../types';
import { BookOpen, Clock, ArrowRight, CheckCircle2, Sparkles, X, ChevronRight, Layers } from 'lucide-react';

interface ModuleListProps {
  onNavigateToStudio?: (subTab: string) => void;
  setActiveTab?: (tab: ActiveTab) => void;
}

export const ModuleList: React.FC<ModuleListProps> = ({ onNavigateToStudio, setActiveTab }) => {
  const [selectedModule, setSelectedModule] = useState<ModuleItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('Semua');

  const categories = ['Semua', 'Prinsip Desain', 'Tipografi', 'Nirmana', 'Teori Warna', 'Desain Poster'];

  const filteredModules = INITIAL_MODULES.filter(m => {
    if (activeCategory === 'Semua') return true;
    return m.category === activeCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-heading font-bold text-stone-900 text-xl">Modul Pembelajaran DKV Kelas 10</h3>
            <span className="text-xs text-stone-600 bg-stone-100 px-2.5 py-0.5 rounded border border-stone-200">
              Standar Kompetensi Keahlian
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Materi terstruktur: Prinsip Desain, Anatomi Tipografi, Nirmana Dwimatra, Harmoni Warna, & Desain Poster
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-lg border border-stone-200 overflow-x-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Modules Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredModules.map(mod => (
          <div
            key={mod.id}
            className="group bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            {/* Image Header with Vector Grid Texture */}
            <div
              onClick={() => setSelectedModule(mod)}
              className="relative aspect-[16/10] overflow-hidden bg-stone-100 cursor-pointer"
            >
              <img
                src={mod.image}
                alt={mod.title}
                referrerPolicy="no-referrer"
                loading="lazy"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src.includes('/src/assets/')) {
                    target.src = target.src.replace('/src/assets/', '/assets/');
                  }
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded">
                {mod.badge}
              </div>
              <div className="absolute bottom-2.5 right-2.5 bg-white/90 backdrop-blur-xs text-stone-800 text-[10px] font-mono px-2 py-0.5 rounded flex items-center gap-1">
                <Clock className="w-3 h-3 text-stone-500" />
                <span>{mod.readTime}</span>
              </div>
            </div>

            {/* Content info */}
            <div className="p-5 flex flex-col justify-between flex-1">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                  {mod.category}
                </span>
                <h4
                  onClick={() => setSelectedModule(mod)}
                  className="font-heading font-bold text-stone-900 text-base mt-2 hover:text-emerald-700 cursor-pointer transition-colors leading-snug"
                >
                  {mod.title}
                </h4>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed line-clamp-2">
                  {mod.summary}
                </p>
              </div>

              {/* Action */}
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[11px] text-stone-400 font-mono">{mod.content.curriculumCode.split(' - ')[0]}</span>
                <button
                  onClick={() => setSelectedModule(mod)}
                  className="flex items-center gap-1 text-xs font-bold text-stone-900 hover:text-emerald-700 transition-colors"
                >
                  <span>Buka Modul</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DETAILED MODULE READER MODAL */}
      {selectedModule && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-stone-200 shadow-2xl p-6 sm:p-8 relative">
            <button
              onClick={() => setSelectedModule(null)}
              className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header info */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-mono uppercase font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                  {selectedModule.category}
                </span>
                <span className="text-xs text-stone-400">· {selectedModule.readTime} bacaan</span>
                <span className="text-xs text-stone-400">· {selectedModule.content.curriculumCode}</span>
              </div>
              <h2 className="font-heading font-black text-stone-900 text-2xl leading-tight">
                {selectedModule.title}
              </h2>
            </div>

            {/* Visual Banner */}
            <div className="rounded-xl overflow-hidden border border-stone-200 aspect-[21/9] mb-6 bg-stone-100">
              <img
                src={selectedModule.image}
                alt={selectedModule.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src.includes('/src/assets/')) {
                    target.src = target.src.replace('/src/assets/', '/assets/');
                  }
                }}
              />
            </div>

            {/* Overview Section */}
            <div className="space-y-6 text-stone-800 text-sm">
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 leading-relaxed text-xs sm:text-sm">
                <strong className="text-stone-900 block mb-1">Pengantar Modul:</strong>
                {selectedModule.content.overview}
              </div>

              {/* Key Points */}
              <div>
                <h4 className="font-heading font-bold text-stone-900 text-base mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  <span>Pokok Materi Pembelajaran:</span>
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-stone-700">
                  {selectedModule.content.keyPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 bg-stone-50/60 p-2.5 rounded-lg border border-stone-100">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Visual Tips */}
              <div>
                <h4 className="font-heading font-bold text-stone-900 text-base mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Kaidah & Tips Visual Desainer:</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {selectedModule.content.visualTips.map((tip, idx) => (
                    <div key={idx} className="p-3 bg-amber-50/50 border border-amber-200/80 rounded-lg text-xs text-amber-950 leading-relaxed">
                      {tip}
                    </div>
                  ))}
                </div>
              </div>

              {/* Practice Assignment Task */}
              <div className="p-4 bg-stone-900 text-white rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                    Tugas Praktik Mandiri
                  </span>
                  <span className="text-[11px] text-stone-400">Portofolio Siswa</span>
                </div>
                <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
                  {selectedModule.content.practiceTask}
                </p>
              </div>
            </div>

            {/* Footer with direct simulator navigation */}
            <div className="mt-6 pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => {
                  setSelectedModule(null);
                  if (setActiveTab) setActiveTab('studio-interaktif');
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>Buka Simulator Interaktif Terkait</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setSelectedModule(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100 rounded-lg"
              >
                Tutup Modul
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
