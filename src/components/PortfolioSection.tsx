import React, { useState } from 'react';
import { StudentWork } from '../types';
import { Heart, Plus, Award, MessageSquare, Check, X, UploadCloud, Eye } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PortfolioSectionProps {
  works: StudentWork[];
  onAddWork: (work: StudentWork) => void;
  onLikeWork: (id: string) => void;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({
  works,
  onAddWork,
  onLikeWork
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [activeModalWork, setActiveModalWork] = useState<StudentWork | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

  // New work form
  const [newTitle, setNewTitle] = useState<string>('');
  const [newAuthor, setNewAuthor] = useState<string>('Ahmad Rizky Pratama');
  const [newClass, setNewClass] = useState<'X DKV 1' | 'X DKV 2'>('X DKV 1');
  const [newCategory, setNewCategory] = useState<'Nirmana' | 'Tipografi' | 'Poster' | 'Vektor' | 'Warna'>('Nirmana');
  const [newDescription, setNewDescription] = useState<string>('');
  const [newImagePreview, setNewImagePreview] = useState<string>('/assets/images/nirmana_dwimatra_visual_1793273438692.jpg');

  const categories = ['Semua', 'Nirmana', 'Tipografi', 'Poster', 'Vektor'];

  const filteredWorks = works.filter(w => {
    if (selectedCategory === 'Semua') return true;
    return w.category === selectedCategory;
  });

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      alert('Mohon isi judul karya Anda!');
      return;
    }

    const created: StudentWork = {
      id: `work-${Date.now()}`,
      title: newTitle,
      author: newAuthor,
      studentClass: newClass,
      category: newCategory,
      image: newImagePreview,
      description: newDescription || 'Karya eksplorasi materi desain komunikasi visual kelas 10.',
      likes: 1,
      date: 'Hari Ini'
    };

    onAddWork(created);
    setIsUploadModalOpen(false);
    setNewTitle('');
    setNewDescription('');
    confetti({ particleCount: 35, spread: 60 });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-heading font-bold text-stone-900 text-xl">Galeri Portofolio Siswa Kelas 10</h3>
            <span className="text-xs text-stone-600 bg-stone-100 px-2.5 py-0.5 rounded border border-stone-200">
              Karya Terkurasi
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Showcase nirmana dwimatra, eksperimen tipografi, desain poster, dan gubahan vektor siswa X DKV 1 & 2
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-stone-900 rounded-lg hover:bg-stone-800 transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Unggah Karya Baru</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-lg w-fit border border-stone-200">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              selectedCategory === cat
                ? 'bg-white text-stone-900 shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Student Works */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredWorks.map(work => (
          <div
            key={work.id}
            className="group bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            {/* Artwork Image Container with Vector Selection Handles on Hover */}
            <div 
              className="relative aspect-square overflow-hidden bg-stone-100 cursor-pointer"
              onClick={() => setActiveModalWork(work)}
            >
              <img
                src={work.image}
                alt={work.title}
                referrerPolicy="no-referrer"
                loading="lazy"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src.includes('/src/assets/')) {
                    target.src = target.src.replace('/src/assets/', '/assets/');
                  }
                }}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Bounding box hover frame */}
              <div className="absolute inset-2 border border-dashed border-white/60 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="vector-handle -top-1 -left-1" />
                <div className="vector-handle -top-1 -right-1" />
                <div className="vector-handle -bottom-1 -left-1" />
                <div className="vector-handle -bottom-1 -right-1" />
              </div>

              {/* Grade or badge overlay if exists */}
              {work.grade && (
                <div className="absolute top-2.5 right-2.5 bg-black/80 backdrop-blur-xs text-white text-[11px] font-mono px-2 py-0.5 rounded border border-white/20">
                  Nilai: {work.grade}
                </div>
              )}
            </div>

            {/* Content info */}
            <div className="p-4 flex flex-col justify-between flex-1">
              <div>
                <div className="flex items-center justify-between text-xs text-stone-400 mb-1.5">
                  <span className="font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px] font-bold">
                    {work.category}
                  </span>
                  <span>{work.date}</span>
                </div>
                <h4 
                  onClick={() => setActiveModalWork(work)}
                  className="font-heading font-bold text-stone-900 text-sm hover:text-emerald-700 cursor-pointer transition-colors line-clamp-1"
                >
                  {work.title}
                </h4>
                <p className="text-xs text-stone-500 mt-0.5">{work.author} ({work.studentClass})</p>
              </div>

              {/* Bottom footer: Likes & Teacher Feedback Indicator */}
              <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between">
                <button
                  onClick={() => onLikeWork(work.id)}
                  className="flex items-center gap-1.5 text-xs text-stone-600 hover:text-red-600 transition-colors"
                >
                  <Heart className={`w-3.5 h-3.5 ${work.likes > 40 ? 'fill-red-500 text-red-500' : ''}`} />
                  <span className="font-mono text-xs">{work.likes}</span>
                </button>

                {work.teacherFeedback ? (
                  <span 
                    onClick={() => setActiveModalWork(work)}
                    className="text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <MessageSquare className="w-3 h-3 text-emerald-600" />
                    <span>Ulasan Guru</span>
                  </span>
                ) : (
                  <span className="text-[10px] text-stone-400">Menunggu Review</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: VIEW WORK DETAIL & TEACHER FEEDBACK */}
      {activeModalWork && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-stone-200 shadow-2xl p-6 relative">
            <button
              onClick={() => setActiveModalWork(null)}
              className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="rounded-xl overflow-hidden border border-stone-200 bg-stone-100 aspect-square">
                <img
                  src={activeModalWork.image}
                  alt={activeModalWork.title}
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

              <div className="space-y-4">
                <div>
                  <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded uppercase font-bold">
                    {activeModalWork.category}
                  </span>
                  <h3 className="font-heading font-bold text-stone-900 text-xl mt-2">
                    {activeModalWork.title}
                  </h3>
                  <div className="text-xs text-stone-500 mt-1">
                    Karya oleh: <strong className="text-stone-800">{activeModalWork.author}</strong> ({activeModalWork.studentClass}) · {activeModalWork.date}
                  </div>
                </div>

                <div className="text-xs text-stone-700 leading-relaxed bg-stone-50 p-3 rounded-lg border border-stone-200">
                  <div className="font-semibold text-stone-900 mb-1">Deskripsi Konsep Karya:</div>
                  {activeModalWork.description}
                </div>

                {/* Teacher Grade & Feedback Card */}
                {activeModalWork.teacherFeedback ? (
                  <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950">
                        <Award className="w-4 h-4 text-emerald-600" />
                        <span>Evaluasi Pengajar (Ibu Sitti Saadah Al amanah, S.Kom)</span>
                      </div>
                      {activeModalWork.grade && (
                        <span className="text-xs font-black font-mono text-emerald-800 bg-emerald-200/60 px-2 py-0.5 rounded">
                          Nilai: {activeModalWork.grade}/100
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-emerald-900 italic leading-relaxed">
                      "{activeModalWork.teacherFeedback}"
                    </p>
                    {activeModalWork.badgeAwarded && (
                      <div className="pt-1 text-[11px] font-medium text-amber-800 flex items-center gap-1">
                        🏆 Lencana Diberikan: <strong>{activeModalWork.badgeAwarded}</strong>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs text-stone-500">
                    Karya ini telah terdaftar dan sedang dalam antrean kurasi guru pengampu.
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => {
                      onLikeWork(activeModalWork.id);
                      setActiveModalWork(prev => prev ? { ...prev, likes: prev.likes + 1 } : null);
                    }}
                    className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold bg-stone-100 hover:bg-stone-200 rounded-lg text-stone-800 transition-colors"
                  >
                    <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                    <span>Apresiasi ({activeModalWork.likes})</span>
                  </button>

                  <button
                    onClick={() => setActiveModalWork(null)}
                    className="px-4 py-1.5 text-xs font-semibold bg-stone-900 text-white rounded-lg hover:bg-stone-800"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: UPLOAD NEW WORK */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-stone-200 shadow-2xl p-6 relative">
            <button
              onClick={() => setIsUploadModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-heading font-bold text-stone-900 text-lg mb-1">
              Unggah Portofolio Desain Siswa
            </h3>
            <p className="text-xs text-stone-500 mb-5">
              Publikasikan tugas mandiri atau kelompok Anda untuk mendapatkan review dan nilai dari guru.
            </p>

            <form onSubmit={handleCreateSubmission} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Judul Karya Desain</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Misal: Studi Gubahan Nirmana Garis Kinetik"
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Nama Siswa</label>
                  <input
                    type="text"
                    required
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Kelas</label>
                  <select
                    value={newClass}
                    onChange={(e) => setNewClass(e.target.value as 'X DKV 1' | 'X DKV 2')}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none"
                  >
                    <option value="X DKV 1">X DKV 1</option>
                    <option value="X DKV 2">X DKV 2</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Kategori Karya</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none"
                >
                  <option value="Nirmana">Nirmana</option>
                  <option value="Tipografi">Tipografi</option>
                  <option value="Poster">Poster</option>
                  <option value="Vektor">Vektor</option>
                  <option value="Warna">Teori Warna</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">File Gambar Karya (Upload atau Pilih Preset)</label>
                <div className="flex items-center gap-3">
                  <img
                    src={newImagePreview}
                    alt="Preview"
                    className="w-16 h-16 object-cover rounded-lg border border-stone-300 shrink-0"
                  />
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="text-xs text-stone-500 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-stone-900 file:text-white hover:file:bg-stone-800 cursor-pointer"
                    />
                    <div className="text-[10px] text-stone-400 mt-1">Format: JPG, PNG (Maks 10MB)</div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Deskripsi & Proses Perancangan</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Ceritakan alat yang digunakan, konsep di balik karya, dan kesulitan yang dihadapi..."
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-stone-900 rounded-lg hover:bg-stone-800 transition-colors shadow-xs"
                >
                  Kirim ke Galeri Portofolio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
