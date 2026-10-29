import React, { useState } from 'react';
import { INITIAL_VIDEOS } from '../data/dkvData';
import { VideoCreative } from '../types';
import { 
  Play, 
  Clock, 
  User, 
  Bookmark, 
  X, 
  CheckCircle2, 
  ExternalLink, 
  Plus, 
  Youtube,
  Search,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const VideoSection: React.FC = () => {
  const [videos, setVideos] = useState<VideoCreative[]>(() => {
    const saved = localStorage.getItem('dkv_custom_videos');
    if (saved) {
      try {
        return [...INITIAL_VIDEOS, ...JSON.parse(saved)];
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_VIDEOS;
  });

  const [selectedVideo, setSelectedVideo] = useState<VideoCreative | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // New video form
  const [newUrl, setNewUrl] = useState<string>('');
  const [newTitle, setNewTitle] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('Prinsip Desain');
  const [newMentor, setNewMentor] = useState<string>('Ibu Sitti Saadah Al amanah, S.Kom');
  const [newDescription, setNewDescription] = useState<string>('');

  const categories = [
    'Semua', 
    'Prinsip Desain', 
    'Tipografi', 
    'Teori Warna', 
    'Desain Poster', 
    'Pen Tool & Vektor'
  ];

  const filteredVideos = videos.filter(v => {
    const matchCategory = selectedCategory === 'Semua' || v.category === selectedCategory;
    const matchQuery = !searchQuery || 
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.mentor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchQuery;
  });

  // Extract YouTube ID from URL
  const extractYouTubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleAddYouTubeVideo = (e: React.FormEvent) => {
    e.preventDefault();
    const id = extractYouTubeId(newUrl);
    if (!id) {
      alert('Tautan YouTube tidak valid. Mohon masukkan link YouTube standar (misal: https://www.youtube.com/watch?v=... atau https://youtu.be/...)');
      return;
    }

    const created: VideoCreative = {
      id: `custom-vid-${Date.now()}`,
      title: newTitle || 'Video Pembelajaran DKV',
      category: newCategory,
      duration: 'YouTube',
      thumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
      videoEmbedId: id,
      mentor: newMentor || 'Ibu Sitti Saadah Al amanah, S.Kom',
      description: newDescription || 'Video materi pembelajaran desain komunikasi visual kelas 10.',
      timestamps: [
        { time: '00:00', topic: 'Mulai Pembahasan Video' }
      ]
    };

    const nextList = [created, ...videos];
    setVideos(nextList);

    // Save custom additions
    const customList = nextList.filter(v => v.id.startsWith('custom-vid-'));
    localStorage.setItem('dkv_custom_videos', JSON.stringify(customList));

    setIsAddModalOpen(false);
    setNewUrl('');
    setNewTitle('');
    setNewDescription('');
    confetti({ particleCount: 30, spread: 60 });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Youtube className="w-5 h-5 text-red-600" />
            <h3 className="font-heading font-bold text-stone-900 text-xl">Materi Video Pembelajaran DKV YouTube</h3>
            <span className="text-xs text-stone-600 bg-stone-100 px-2.5 py-0.5 rounded border border-stone-200 font-mono">
              6 Materi Terverifikasi
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Video edukasi terkurasi kurikulum: Prinsip Desain, Tipografi, Teori Warna, Komposisi Poster, dan Tutorial Pen Tool Illustrator
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-stone-900 rounded-lg hover:bg-stone-800 transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Video YouTube</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-stone-200 shadow-2xs">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-stone-900 text-white shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari judul atau topik video..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white"
          />
        </div>
      </div>

      {/* Video Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredVideos.map(video => (
          <div
            key={video.id}
            className="group bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            {/* Thumbnail with YouTube Badge & Play Overlay */}
            <div
              onClick={() => setSelectedVideo(video)}
              className="relative aspect-video overflow-hidden bg-stone-950 cursor-pointer"
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
                loading="lazy"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.src = '/assets/images/poster_swiss_reference_1793273438057.jpg';
                }}
              />
              
              {/* YouTube corner badge */}
              <div className="absolute top-2.5 left-2.5 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow-sm">
                <Youtube className="w-3 h-3 fill-current" />
                <span>YouTube</span>
              </div>

              {/* Central Play Button */}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>
              </div>

              {/* Duration badge */}
              <div className="absolute bottom-2.5 right-2.5 bg-black/85 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded">
                {video.duration}
              </div>
            </div>

            {/* Video Meta */}
            <div className="p-4 flex flex-col justify-between flex-1">
              <div>
                <span className="text-[10px] uppercase font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-100">
                  {video.category}
                </span>
                <h4
                  onClick={() => setSelectedVideo(video)}
                  className="font-heading font-bold text-stone-900 text-sm mt-2 leading-snug hover:text-red-600 cursor-pointer transition-colors line-clamp-2"
                >
                  {video.title}
                </h4>
                <p className="text-xs text-stone-500 mt-1 flex items-center gap-1.5">
                  <User className="w-3 h-3 text-stone-400" />
                  <span>{video.mentor}</span>
                </p>
                <p className="text-xs text-stone-600 mt-2 line-clamp-2 leading-relaxed">
                  {video.description}
                </p>
              </div>

              {/* Footer action */}
              <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-stone-400 font-mono text-[11px]">{video.timestamps.length} Topik Bab</span>
                <button
                  onClick={() => setSelectedVideo(video)}
                  className="text-stone-900 font-bold hover:text-red-600 flex items-center gap-1 transition-colors"
                >
                  <Play className="w-3 h-3 fill-current text-red-600" />
                  <span>Putar Video →</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredVideos.length === 0 && (
        <div className="py-12 text-center bg-white rounded-xl border border-stone-200 text-stone-400 text-xs">
          Tidak ada video yang cocok dengan filter atau kata kunci "{searchQuery}".
        </div>
      )}

      {/* REAL YOUTUBE PLAYER EMBED MODAL */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto border border-stone-200 shadow-2xl p-6 relative">
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Embedded YouTube 16:9 Iframe Player */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black mb-4 border border-stone-800 shadow-lg">
              {selectedVideo.videoEmbedId ? (
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${selectedVideo.videoEmbedId}?autoplay=1&rel=0`}
                  title={selectedVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-xs">
                  Video tidak memiliki ID embed YouTube.
                </div>
              )}
            </div>

            {/* Video Details & Timestamps */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              <div className="md:col-span-7 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-100">
                    {selectedVideo.category}
                  </span>
                  <span className="text-xs text-stone-400">· Durasi {selectedVideo.duration}</span>
                </div>

                <h3 className="font-heading font-bold text-stone-900 text-lg leading-snug">
                  {selectedVideo.title}
                </h3>

                <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-3.5 rounded-lg border border-stone-200">
                  {selectedVideo.description}
                </p>

                <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
                  <span>Instruktur: <strong className="text-stone-800">{selectedVideo.mentor}</strong></span>
                  {selectedVideo.videoEmbedId && (
                    <a
                      href={`https://www.youtube.com/watch?v=${selectedVideo.videoEmbedId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-600 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <span>Buka di Aplikasi YouTube</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Timestamp Navigation */}
              <div className="md:col-span-5 bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2.5">
                <div className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-stone-200">
                  <Clock className="w-3.5 h-3.5 text-stone-500" />
                  <span>Daftar Bab & Timestamp Pembahasan</span>
                </div>

                <div className="space-y-1.5">
                  {selectedVideo.timestamps.map((ts, idx) => (
                    <div
                      key={idx}
                      className="p-2 bg-white rounded-md border border-stone-200 hover:border-red-400 flex items-center justify-between text-xs cursor-pointer transition-colors group"
                    >
                      <span className="text-stone-800 font-medium group-hover:text-red-700">{ts.topic}</span>
                      <span className="font-mono text-stone-400 bg-stone-100 px-1.5 py-0.2 rounded text-[10px]">
                        {ts.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-stone-200 flex justify-end">
              <button
                onClick={() => setSelectedVideo(null)}
                className="px-4 py-1.5 text-xs font-semibold bg-stone-900 text-white rounded-lg hover:bg-stone-800"
              >
                Tutup Video
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD YOUTUBE VIDEO */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-stone-200 shadow-2xl p-6 relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2 text-red-600">
              <Youtube className="w-6 h-6 fill-current" />
              <h3 className="font-heading font-bold text-stone-900 text-lg">
                Tambah Video YouTube DKV
              </h3>
            </div>
            <p className="text-xs text-stone-500 mb-5">
              Tempelkan tautan video YouTube pembelajaran untuk ditambahkan ke kurikulum DKV kelas 10.
            </p>

            <form onSubmit={handleAddYouTubeVideo} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  URL / Link YouTube (watch atau youtu.be)
                </label>
                <input
                  type="url"
                  required
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=YqQx75OPWA0"
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Judul Video Pembelajaran
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Contoh: Bedah Poster Tipografi Swiss Style"
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Kategori</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none"
                  >
                    <option value="Prinsip Desain">Prinsip Desain</option>
                    <option value="Tipografi">Tipografi</option>
                    <option value="Teori Warna">Teori Warna</option>
                    <option value="Desain Poster">Desain Poster</option>
                    <option value="Pen Tool & Vektor">Pen Tool & Vektor</option>
                    <option value="Nirmana">Nirmana</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Mentor / Narasumber</label>
                  <input
                    type="text"
                    value={newMentor}
                    onChange={(e) => setNewMentor(e.target.value)}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Ringkasan Materi</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Jelaskan intisari konsep yang diajarkan dalam video ini..."
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-xs"
                >
                  Tambahkan ke Playlist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
