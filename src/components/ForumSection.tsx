import React, { useState } from 'react';
import { ForumPost, ForumReply } from '../types';
import { INITIAL_FORUM_POSTS } from '../data/dkvData';
import { MessageSquare, ThumbsUp, Plus, Pin, CheckCircle2, User, Send, X } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ForumSection: React.FC = () => {
  const [posts, setPosts] = useState<ForumPost[]>(INITIAL_FORUM_POSTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [activePost, setActivePost] = useState<ForumPost | null>(null);

  // New post modal state
  const [isNewPostOpen, setIsNewPostOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newContent, setNewContent] = useState<string>('');
  const [newCategory, setNewCategory] = useState<'Tanya Konsep' | 'Kritik Desain' | 'Tips Software' | 'Diskusi Proyek'>('Tanya Konsep');
  const [authorName, setAuthorName] = useState<string>('Ahmad Rizky Pratama');
  const [studentClass, setStudentClass] = useState<string>('X DKV 1');

  // Reply input state
  const [replyContent, setReplyContent] = useState<string>('');

  const categories = ['Semua', 'Tanya Konsep', 'Kritik Desain', 'Tips Software', 'Diskusi Proyek'];

  const filteredPosts = posts.filter(p => {
    if (selectedCategory === 'Semua') return true;
    return p.category === selectedCategory;
  });

  const handleLikePost = (postId: string) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
    if (activePost && activePost.id === postId) {
      setActivePost(prev => prev ? { ...prev, likes: prev.likes + 1 } : null);
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      alert('Mohon isi judul dan isi pertanyaan diskusi Anda!');
      return;
    }

    const newPost: ForumPost = {
      id: `forum-${Date.now()}`,
      author: authorName,
      studentClass,
      avatarColor: 'bg-emerald-600',
      title: newTitle,
      content: newContent,
      category: newCategory,
      likes: 1,
      repliesCount: 0,
      createdAt: 'Baru saja',
      replies: []
    };

    setPosts([newPost, ...posts]);
    setIsNewPostOpen(false);
    setNewTitle('');
    setNewContent('');
    confetti({ particleCount: 25, spread: 60 });
  };

  const handleAddReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || !activePost) return;

    const newReply: ForumReply = {
      id: `rep-${Date.now()}`,
      author: authorName,
      isTeacher: false,
      content: replyContent,
      createdAt: 'Baru saja',
      likes: 0
    };

    const updatedPosts = posts.map(p => {
      if (p.id === activePost.id) {
        return {
          ...p,
          repliesCount: p.repliesCount + 1,
          replies: [...p.replies, newReply]
        };
      }
      return p;
    });

    setPosts(updatedPosts);
    setActivePost(prev => prev ? {
      ...prev,
      repliesCount: prev.repliesCount + 1,
      replies: [...prev.replies, newReply]
    } : null);
    setReplyContent('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-heading font-bold text-stone-900 text-xl">Forum Kolaborasi & Diskusi Siswa DKV</h3>
            <span className="text-xs text-stone-600 bg-stone-100 px-2.5 py-0.5 rounded border border-stone-200">
              Peer Review & Tanya Guru
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Ruang diskusi terbuka untuk tanya konsep, problem solving software grafis, dan kritik karya konstruktif
          </p>
        </div>

        <button
          onClick={() => setIsNewPostOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-stone-900 rounded-lg hover:bg-stone-800 transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Mulai Topik Diskusi</span>
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

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.map(post => (
          <div
            key={post.id}
            className="bg-white rounded-xl border border-stone-200 p-5 shadow-2xs hover:border-stone-300 transition-all space-y-3"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-full ${post.avatarColor} text-white font-bold text-xs flex items-center justify-center shrink-0`}>
                  {post.author[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-900">{post.author}</span>
                    <span className="text-[11px] text-stone-400 font-mono">({post.studentClass})</span>
                    {post.isPinned && (
                      <span className="flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded font-semibold border border-amber-200">
                        <Pin className="w-3 h-3" /> Disematkan Guru
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-stone-400">{post.createdAt}</span>
                </div>
              </div>

              <span className="text-[10px] uppercase font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-100">
                {post.category}
              </span>
            </div>

            <div>
              <h4 
                onClick={() => setActivePost(post)}
                className="font-heading font-bold text-stone-900 text-base hover:text-emerald-700 cursor-pointer transition-colors"
              >
                {post.title}
              </h4>
              <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                {post.content}
              </p>
            </div>

            {/* Replies Preview & Action */}
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-stone-500">
                <button
                  onClick={() => handleLikePost(post.id)}
                  className="flex items-center gap-1.5 hover:text-stone-900 transition-colors"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span className="font-mono">{post.likes} Dukungan</span>
                </button>
                <button
                  onClick={() => setActivePost(post)}
                  className="flex items-center gap-1.5 hover:text-stone-900 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span className="font-mono">{post.repliesCount} Tanggapan</span>
                </button>
              </div>

              <button
                onClick={() => setActivePost(post)}
                className="text-xs font-semibold text-stone-800 hover:text-emerald-700"
              >
                Buka Diskusi & Beri Masukan →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DETAIL MODAL & REPLIES THREAD */}
      {activePost && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-stone-200 shadow-2xl p-6 relative flex flex-col justify-between">
            <button
              onClick={() => setActivePost(null)}
              className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              {/* Question Details */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] uppercase font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-100">
                  {activePost.category}
                </span>
                <span className="text-xs text-stone-400">{activePost.createdAt}</span>
              </div>

              <h3 className="font-heading font-bold text-stone-900 text-lg mb-2">
                {activePost.title}
              </h3>

              <div className="flex items-center gap-2 text-xs text-stone-500 mb-4 pb-3 border-b border-stone-100">
                <span>Ditanyakan oleh <strong className="text-stone-800">{activePost.author}</strong> ({activePost.studentClass})</span>
              </div>

              <p className="text-xs text-stone-700 leading-relaxed mb-6 bg-stone-50 p-4 rounded-xl border border-stone-200">
                {activePost.content}
              </p>

              {/* Replies Section */}
              <div className="space-y-3 mb-6">
                <div className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-stone-500" />
                  <span>Tanggapan & Diskusi ({activePost.replies.length})</span>
                </div>

                {activePost.replies.length === 0 ? (
                  <div className="p-4 bg-stone-50 rounded-lg text-xs text-stone-400 text-center">
                    Belum ada tanggapan untuk topik ini. Jadilah yang pertama memberikan masukan!
                  </div>
                ) : (
                  activePost.replies.map(rep => (
                    <div
                      key={rep.id}
                      className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                        rep.isTeacher
                          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                          : 'bg-white border-stone-200 text-stone-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <strong className="text-stone-900">{rep.author}</strong>
                          {rep.isTeacher && (
                            <span className="bg-emerald-600 text-white text-[10px] px-2 py-0.2 rounded font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Guru Terverifikasi
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-stone-400">{rep.createdAt}</span>
                      </div>
                      <p className="leading-relaxed pl-1">{rep.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Reply Input Form */}
            <form onSubmit={handleAddReply} className="pt-4 border-t border-stone-200 space-y-2">
              <label className="block text-xs font-semibold text-stone-700">Tulis Masukan / Solusi Anda:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Ketik tanggapan yang santun dan konstruktif..."
                  className="flex-1 text-xs px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-stone-900 rounded-lg hover:bg-stone-800 flex items-center gap-1.5 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE NEW FORUM TOPIC */}
      {isNewPostOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-stone-200 shadow-2xl p-6 relative">
            <button
              onClick={() => setIsNewPostOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-heading font-bold text-stone-900 text-lg mb-1">
              Mulai Topik Diskusi Baru
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Diskusikan materi kurikulum, tanyakan kendala teknis nirmana atau tipografi dengan teman dan guru.
            </p>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Judul Diskusi</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Contoh: Mengapa font Serif kurang cocok untuk display billboard dari kejauhan?"
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Nama Siswa</label>
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Kelas</label>
                  <select
                    value={studentClass}
                    onChange={(e) => setStudentClass(e.target.value)}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none"
                  >
                    <option value="X DKV 1">X DKV 1</option>
                    <option value="X DKV 2">X DKV 2</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Kategori Diskusi</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none"
                >
                  <option value="Tanya Konsep">Tanya Konsep</option>
                  <option value="Kritik Desain">Kritik Desain</option>
                  <option value="Tips Software">Tips Software</option>
                  <option value="Diskusi Proyek">Diskusi Proyek</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Penjelasan / Masalah yang Dihadapi</label>
                <textarea
                  rows={4}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Jelaskan secara detail pertanyaan Anda agar teman-teman atau Ibu Guru dapat menjawab dengan tepat..."
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewPostOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-stone-900 rounded-lg hover:bg-stone-800 transition-colors shadow-xs"
                >
                  Posting ke Forum
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
