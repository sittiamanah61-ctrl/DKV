import React, { useState, useEffect } from 'react';
import { Search, X, BookOpen, Video, Award, ArrowRight } from 'lucide-react';
import { INITIAL_MODULES, INITIAL_VIDEOS, ASSESSMENT_QUESTIONS } from '../data/dkvData';
import { ActiveTab } from '../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: ActiveTab) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // toggle or open
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const normalized = query.toLowerCase().trim();

  const matchingModules = INITIAL_MODULES.filter(m =>
    !normalized ||
    m.title.toLowerCase().includes(normalized) ||
    m.category.toLowerCase().includes(normalized) ||
    m.summary.toLowerCase().includes(normalized)
  );

  const matchingVideos = INITIAL_VIDEOS.filter(v =>
    !normalized ||
    v.title.toLowerCase().includes(normalized) ||
    v.category.toLowerCase().includes(normalized) ||
    v.description.toLowerCase().includes(normalized)
  );

  const matchingQuestions = ASSESSMENT_QUESTIONS.filter(q =>
    !normalized ||
    q.question.toLowerCase().includes(normalized) ||
    q.category.toLowerCase().includes(normalized)
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-20 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-stone-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Input Bar */}
        <div className="p-4 border-b border-stone-200 flex items-center gap-3 bg-stone-50/80">
          <Search className="w-5 h-5 text-stone-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ketik topik, kata kunci (misal: 'kerning', 'nirmana', 'swiss grid', 'komplementer')..."
            className="flex-1 text-sm bg-transparent border-none text-stone-900 focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-stone-400 hover:text-stone-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="text-[10px] font-mono text-stone-400 bg-white px-2 py-0.5 rounded border border-stone-300">
            ESC
          </kbd>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {/* Modules Section */}
          {matchingModules.length > 0 && (
            <div>
              <div className="text-[11px] font-mono uppercase text-stone-400 font-bold mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                <span>Modul Kurikulum ({matchingModules.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchingModules.slice(0, 4).map(mod => (
                  <button
                    key={mod.id}
                    onClick={() => {
                      onNavigate('modul');
                      onClose();
                    }}
                    className="w-full text-left p-2.5 rounded-lg hover:bg-stone-50 border border-transparent hover:border-stone-200 flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <div className="text-xs font-bold text-stone-900 group-hover:text-emerald-700">
                        {mod.title}
                      </div>
                      <div className="text-[11px] text-stone-500 line-clamp-1">{mod.summary}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-stone-900 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Videos Section */}
          {matchingVideos.length > 0 && (
            <div className="pt-2 border-t border-stone-100">
              <div className="text-[11px] font-mono uppercase text-stone-400 font-bold mb-2 flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-amber-500" />
                <span>Video Tutorial Kreatif ({matchingVideos.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchingVideos.map(vid => (
                  <button
                    key={vid.id}
                    onClick={() => {
                      onNavigate('video');
                      onClose();
                    }}
                    className="w-full text-left p-2.5 rounded-lg hover:bg-stone-50 border border-transparent hover:border-stone-200 flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <div className="text-xs font-bold text-stone-900 group-hover:text-amber-700">
                        {vid.title}
                      </div>
                      <div className="text-[11px] text-stone-500">Mentor: {vid.mentor} · {vid.duration}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-stone-900 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Assessment Section */}
          {matchingQuestions.length > 0 && (
            <div className="pt-2 border-t border-stone-100">
              <div className="text-[11px] font-mono uppercase text-stone-400 font-bold mb-2 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-stone-700" />
                <span>Bank Soal Asesmen Harian</span>
              </div>
              <div className="space-y-1.5">
                {matchingQuestions.slice(0, 3).map(q => (
                  <button
                    key={q.id}
                    onClick={() => {
                      onNavigate('asesmen');
                      onClose();
                    }}
                    className="w-full text-left p-2.5 rounded-lg hover:bg-stone-50 border border-transparent hover:border-stone-200 flex items-center justify-between group transition-colors"
                  >
                    <div className="text-xs text-stone-800 line-clamp-1">
                      <span className="font-bold text-emerald-800 mr-2">[{q.category}]</span>
                      {q.question}
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-stone-900 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {matchingModules.length === 0 && matchingVideos.length === 0 && matchingQuestions.length === 0 && (
            <div className="py-8 text-center text-xs text-stone-400">
              Tidak ada konten yang cocok dengan kata kunci "{query}".
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-stone-50 border-t border-stone-200 text-[11px] text-stone-400 flex items-center justify-between">
          <span>Gunakan panah atau klik untuk membuka halaman</span>
          <button
            onClick={onClose}
            className="text-stone-600 hover:text-stone-900 font-medium"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
