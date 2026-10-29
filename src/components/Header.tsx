import React from 'react';
import { ActiveTab } from '../types';
import { Bell, Search, Lock, PenTool } from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  pendingTasksCount: number;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  pendingTasksCount,
  onOpenSearch,
  onOpenNotifications
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Wordmark */}
        <button
          onClick={() => setActiveTab('beranda')}
          className="flex items-center gap-2.5 text-left focus:outline-none whitespace-nowrap shrink-0 group"
        >
          <div className="w-8 h-8 rounded-lg bg-stone-900 text-white flex items-center justify-center font-bold text-sm tracking-tighter shadow-2xs group-hover:bg-emerald-700 transition-colors">
            X
          </div>
          <span className="text-lg font-extrabold tracking-tight text-stone-900 font-heading">
            DKV X Studio
          </span>
        </button>

        {/* Zone 2: 4-5 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-stone-600">
          <button
            onClick={() => setActiveTab('modul')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-stone-900 pb-0.5 ${
              activeTab === 'modul' ? 'text-stone-900 border-b-2 border-stone-900 font-bold' : ''
            }`}
          >
            Modul Teori
          </button>
          <button
            onClick={() => setActiveTab('studio-interaktif')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-stone-900 pb-0.5 ${
              activeTab === 'studio-interaktif' ? 'text-stone-900 border-b-2 border-stone-900 font-bold' : ''
            }`}
          >
            Studio Interaktif
          </button>
          <button
            onClick={() => setActiveTab('portofolio')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-stone-900 pb-0.5 ${
              activeTab === 'portofolio' ? 'text-stone-900 border-b-2 border-stone-900 font-bold' : ''
            }`}
          >
            Portofolio Siswa
          </button>
          <button
            onClick={() => setActiveTab('asesmen')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-stone-900 pb-0.5 ${
              activeTab === 'asesmen' ? 'text-stone-900 border-b-2 border-stone-900 font-bold' : ''
            }`}
          >
            Daily Asesmen
          </button>
          <button
            onClick={() => setActiveTab('guru')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 hover:text-stone-900 pb-0.5 ${
              activeTab === 'guru' ? 'text-stone-900 border-b-2 border-stone-900 font-bold' : ''
            }`}
          >
            <Lock className="w-3 h-3 text-stone-400" />
            <span>Dasbor Guru</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action with search and notification triggers */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-200/80 rounded-lg transition-colors"
            title="Cari Materi & Istilah DKV"
          >
            <Search className="w-3.5 h-3.5 text-stone-500" />
            <span className="hidden sm:inline">Cari Modul</span>
            <kbd className="hidden lg:inline text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border border-stone-300 text-stone-400">Ctrl+K</kbd>
          </button>

          <button
            onClick={onOpenNotifications}
            className="relative p-2 text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
            aria-label="Pemberitahuan Tugas"
          >
            <Bell className="w-4 h-4" />
            {pendingTasksCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('jadwal')}
            className="px-3.5 py-2 text-xs font-bold text-white bg-stone-900 rounded-lg hover:bg-stone-800 transition-colors whitespace-nowrap shrink-0 shadow-2xs"
          >
            Jadwal Praktik
          </button>
        </div>
      </div>
    </header>
  );
};
