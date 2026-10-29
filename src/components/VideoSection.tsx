import React, { useState } from 'react';
import { INITIAL_VIDEOS } from '../data/dkvData';
import { VideoCreative } from '../types';
import { Play, Clock, User, Bookmark, X, CheckCircle2 } from 'lucide-react';

export const VideoSection: React.FC = () => {
  const [videos] = useState<VideoCreative[]>(INITIAL_VIDEOS);
  const [selectedVideo, setSelectedVideo] = useState<VideoCreative | null>(null);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-heading font-bold text-stone-900 text-xl">Materi Video Kreatif DKV</h3>
            <span className="text-xs text-stone-600 bg-stone-100 px-2.5 py-0.5 rounded border border-stone-200">
              Video Pembelajaran Mandiri
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Panduan teknis step-by-step: Pen Tool Illustrator, Bedah Poster Swiss Grid, dan Pembuatan Nirmana
          </p>
        </div>
      </div>

      {/* Video Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {videos.map(video => (
          <div
            key={video.id}
            className="group bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            {/* Thumbnail with Play Overlay */}
            <div
              onClick={() => setSelectedVideo(video)}
              className="relative aspect-video overflow-hidden bg-stone-900 cursor-pointer"
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                <div className="w-12 h-12 rounded-full bg-white/90 text-stone-900 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>
              </div>

              {/* Duration badge */}
              <div className="absolute bottom-2.5 right-2.5 bg-black/80 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded">
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
                  className="font-heading font-bold text-stone-900 text-sm mt-2 leading-snug hover:text-emerald-700 cursor-pointer transition-colors"
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

              {/* Timestamp list preview */}
              <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-stone-400 font-mono text-[11px]">{video.timestamps.length} Topik Bab</span>
                <button
                  onClick={() => setSelectedVideo(video)}
                  className="text-stone-900 font-semibold hover:text-emerald-700 transition-colors"
                >
                  Tonton & Pelajari →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* VIDEO PLAYER MODAL */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto border border-stone-200 shadow-2xl p-6 relative">
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Video Player Mockup / Interactive Canvas Preview */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-stone-950 mb-4 border border-stone-800 flex items-center justify-center">
              <img
                src={selectedVideo.thumbnail}
                alt="Player"
                className="w-full h-full object-cover opacity-60"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-gradient-to-t from-black/80 via-black/30 to-black/60">
                <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xl animate-pulse mb-3">
                  <Play className="w-7 h-7 fill-current ml-1" />
                </div>
                <h4 className="text-white font-heading font-bold text-lg max-w-md">
                  {selectedVideo.title}
                </h4>
                <div className="text-stone-300 text-xs mt-1">
                  Instruktur: {selectedVideo.mentor} · Durasi: {selectedVideo.duration}
                </div>
              </div>
            </div>

            {/* Video Details & Timestamps */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              <div className="md:col-span-7 space-y-3">
                <span className="text-[10px] uppercase font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-100">
                  {selectedVideo.category}
                </span>
                <h3 className="font-heading font-bold text-stone-900 text-base">
                  {selectedVideo.title}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-3.5 rounded-lg border border-stone-200">
                  {selectedVideo.description}
                </p>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Materi video ini terintegrasi dengan modul KD Kurikulum DKV Kelas 10.</span>
                </div>
              </div>

              {/* Timestamp Navigation */}
              <div className="md:col-span-5 bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2.5">
                <div className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-stone-200">
                  <Clock className="w-3.5 h-3.5 text-stone-500" />
                  <span>Daftar Bab & Timestamp</span>
                </div>

                <div className="space-y-1.5">
                  {selectedVideo.timestamps.map((ts, idx) => (
                    <div
                      key={idx}
                      className="p-2 bg-white rounded-md border border-stone-200 hover:border-stone-400 flex items-center justify-between text-xs cursor-pointer transition-colors"
                    >
                      <span className="text-stone-800 font-medium">{ts.topic}</span>
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
    </div>
  );
};
