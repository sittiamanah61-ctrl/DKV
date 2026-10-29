import React, { useState, useEffect } from 'react';
import { ActiveTab, StudentWork, TaskNotification, BadgeItem } from './types';
import { 
  INITIAL_STUDENT_WORKS, 
  INITIAL_TASKS, 
  INITIAL_BADGES, 
  INITIAL_MODULES 
} from './data/dkvData';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { ModuleList } from './components/ModuleList';
import { InteractiveNirmana } from './components/InteractiveNirmana';
import { InteractiveTypography } from './components/InteractiveTypography';
import { InteractiveColorWheel } from './components/InteractiveColorWheel';
import { InteractiveGames } from './components/InteractiveGames';
import { DailyAssessment } from './components/DailyAssessment';
import { TeacherDashboard } from './components/TeacherDashboard';
import { PortfolioSection } from './components/PortfolioSection';
import { ScheduleSection } from './components/ScheduleSection';
import { ForumSection } from './components/ForumSection';
import { VideoSection } from './components/VideoSection';
import { TaskNotificationDrawer } from './components/TaskNotificationDrawer';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { 
  BookOpen, 
  PenTool, 
  Trophy, 
  Users, 
  Calendar, 
  Award, 
  Sparkles, 
  ArrowRight, 
  Heart, 
  CheckCircle2, 
  Clock,
  Layers,
  Palette
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('beranda');
  const [studioSubTab, setStudioSubTab] = useState<'nirmana' | 'typography' | 'color'>('nirmana');

  // Persistence State
  const [studentWorks, setStudentWorks] = useState<StudentWork[]>(() => {
    const saved = localStorage.getItem('dkv_student_works');
    if (saved) {
      try {
        const parsed: StudentWork[] = JSON.parse(saved);
        return parsed.map(w => ({
          ...w,
          image: w.image.replace('/src/assets/images/', '/assets/images/')
        }));
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_STUDENT_WORKS;
  });

  const [tasks, setTasks] = useState<TaskNotification[]>(() => {
    const saved = localStorage.getItem('dkv_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [badges, setBadges] = useState<BadgeItem[]>(() => {
    const saved = localStorage.getItem('dkv_badges');
    return saved ? JSON.parse(saved) : INITIAL_BADGES;
  });

  // Modals & Drawers
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('dkv_student_works', JSON.stringify(studentWorks));
  }, [studentWorks]);

  useEffect(() => {
    localStorage.setItem('dkv_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('dkv_badges', JSON.stringify(badges));
  }, [badges]);

  // Handlers
  const handleAddWork = (newWork: StudentWork) => {
    setStudentWorks(prev => [newWork, ...prev]);
    // Also unlock badge if first work
    unlockBadge('badge-2');
  };

  const handleLikeWork = (id: string) => {
    setStudentWorks(prev => prev.map(w => w.id === id ? { ...w, likes: w.likes + 1 } : w));
  };

  const handleToggleTaskStatus = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const nextStatus = t.status === 'Selesai' ? 'Belum Selesai' : 'Selesai';
        if (nextStatus === 'Selesai') {
          confetti({ particleCount: 20, spread: 40 });
        }
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  const unlockBadge = (badgeId: string) => {
    setBadges(prev => prev.map(b => {
      if (b.id === badgeId && !b.unlocked) {
        return {
          ...b,
          unlocked: true,
          unlockedAt: 'Hari ini'
        };
      }
      return b;
    }));
  };

  const handleUpdateWorkGrade = (workId: string, grade: number, feedback: string, badge?: string) => {
    setStudentWorks(prev => prev.map(w => {
      if (w.id === workId) {
        return {
          ...w,
          grade,
          teacherFeedback: feedback,
          badgeAwarded: badge || w.badgeAwarded
        };
      }
      return w;
    }));
  };

  const pendingTasksCount = tasks.filter(t => t.status !== 'Selesai').length;
  const unlockedBadgesCount = badges.filter(b => b.unlocked).length;

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Bar Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingTasksCount={pendingTasksCount}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* Navigation Breadcrumbs & Secondary Tab Bar for Mobile / Fast Switching */}
        <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-stone-200 overflow-x-auto shadow-2xs">
          {[
            { id: 'beranda', label: 'Beranda' },
            { id: 'modul', label: 'Modul Teori' },
            { id: 'studio-interaktif', label: 'Studio Interaktif' },
            { id: 'portofolio', label: 'Portofolio' },
            { id: 'asesmen', label: 'Daily Asesmen' },
            { id: 'game', label: 'Game Desain' },
            { id: 'video', label: 'Video Kreatif' },
            { id: 'forum', label: 'Forum Kolaborasi' },
            { id: 'jadwal', label: 'Jadwal Praktik' },
            { id: 'guru', label: 'Dasbor Guru' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as ActiveTab)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                activeTab === item.id
                  ? 'bg-stone-900 text-white shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* TAB: BERANDA */}
        {activeTab === 'beranda' && (
          <div className="space-y-8">
            {/* Hero Section */}
            <HeroBanner
              onNavigate={setActiveTab}
              unlockedBadgesCount={unlockedBadgesCount}
            />

            {/* Quick Curriculum Modules Showcase */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-heading font-bold text-stone-900 text-lg">Pilar Kurikulum DKV Kelas 10</h3>
                  <p className="text-xs text-stone-500 mt-0.5">Materi inti yang dipelajari dan diujikan semester ini</p>
                </div>
                <button
                  onClick={() => setActiveTab('modul')}
                  className="text-xs font-bold text-stone-800 hover:text-emerald-700 flex items-center gap-1"
                >
                  <span>Lihat Seluruh Modul</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {INITIAL_MODULES.slice(0, 4).map(mod => (
                  <div
                    key={mod.id}
                    onClick={() => setActiveTab('modul')}
                    className="group bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-md cursor-pointer transition-all flex flex-col justify-between"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                      <img
                        src={mod.image}
                        alt={mod.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (target.src.includes('/src/assets/')) {
                            target.src = target.src.replace('/src/assets/', '/assets/');
                          }
                        }}
                      />
                      <span className="absolute top-2 left-2 text-[10px] font-mono bg-black/75 text-white px-2 py-0.5 rounded">
                        {mod.badge}
                      </span>
                    </div>
                    <div className="p-4 flex flex-col justify-between flex-1">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded uppercase">
                          {mod.category}
                        </span>
                        <h4 className="font-heading font-bold text-stone-900 text-sm mt-1.5 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                          {mod.title}
                        </h4>
                        <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                          {mod.summary}
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                        <span>{mod.readTime}</span>
                        <span className="font-semibold text-stone-900">Buka →</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Interactive Studio Teaser & Two-Column Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Studio Shortcut Card */}
              <div className="lg:col-span-8 bg-stone-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-sm">
                <div className="relative z-10 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono uppercase text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800 font-bold">
                      Interactive Visualizers
                    </span>
                    <span className="text-xs text-stone-400">Sentuh & Eksplorasi Langsung</span>
                  </div>
                  <h3 className="font-heading font-black text-2xl sm:text-3xl tracking-tight">
                    Studio Nirmana & Tipografi Interaktif
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-300 max-w-xl leading-relaxed">
                    Uji langsung konsep anatomi huruf, sesuaikan kerning dan leading secara bebas, serta buat karya nirmana dwimatra kinetik yang bereaksi terhadap sentuhan dan kursor Anda.
                  </p>
                </div>

                <div className="relative z-10 flex flex-wrap items-center gap-3 mt-6 pt-4 border-t border-stone-800">
                  <button
                    onClick={() => {
                      setStudioSubTab('nirmana');
                      setActiveTab('studio-interaktif');
                    }}
                    className="px-4 py-2 text-xs font-bold text-stone-900 bg-white rounded-lg hover:bg-stone-100 transition-colors"
                  >
                    Simulator Nirmana Kinetik
                  </button>
                  <button
                    onClick={() => {
                      setStudioSubTab('typography');
                      setActiveTab('studio-interaktif');
                    }}
                    className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 rounded-lg hover:bg-emerald-600 transition-colors"
                  >
                    Anatomi & Kerning Huruf
                  </button>
                  <button
                    onClick={() => {
                      setStudioSubTab('color');
                      setActiveTab('studio-interaktif');
                    }}
                    className="px-4 py-2 text-xs font-bold text-stone-300 bg-stone-800 rounded-lg hover:bg-stone-700 transition-colors"
                  >
                    Color Palette Studio (Roda Warna)
                  </button>
                </div>

                {/* Abstract geometric circle background motif */}
                <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full border border-stone-800 opacity-40 pointer-events-none" />
              </div>

              {/* Badges / Motivation Strip */}
              <div className="lg:col-span-4 bg-white rounded-2xl border border-stone-200 p-6 flex flex-col justify-between shadow-2xs">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-heading font-bold text-stone-900 text-base">Lencana Penghargaan</h4>
                    <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {unlockedBadgesCount} / {badges.length} Terbuka
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mb-4">
                    Kumpulkan seluruh lencana prestasi dari tugas harian, eksplorasi studio, dan evaluasi guru.
                  </p>

                  <div className="space-y-2">
                    {badges.slice(0, 3).map(b => (
                      <div
                        key={b.id}
                        className={`p-2.5 rounded-lg border flex items-center gap-3 text-xs ${
                          b.unlocked
                            ? 'bg-amber-50/50 border-amber-200 text-stone-900'
                            : 'bg-stone-50 border-stone-200 text-stone-400 opacity-60'
                        }`}
                      >
                        <Award className={`w-4 h-4 shrink-0 ${b.unlocked ? 'text-amber-600' : 'text-stone-300'}`} />
                        <div className="flex-1 min-w-0">
                          <div className="font-bold truncate">{b.name}</div>
                          <div className="text-[10px] text-stone-500 truncate">{b.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-xs text-stone-500">Motivasi Siswa DKV</span>
                  <button
                    onClick={() => setActiveTab('game')}
                    className="text-xs font-bold text-stone-900 hover:text-emerald-700"
                  >
                    Mainkan Game Desain →
                  </button>
                </div>
              </div>
            </div>

            {/* Featured Student Works Preview */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-heading font-bold text-stone-900 text-lg">Karya Pilihan Siswa Minggu Ini</h3>
                  <p className="text-xs text-stone-500 mt-0.5">Portofolio tugas mandiri & praktik yang telah dinilai guru</p>
                </div>
                <button
                  onClick={() => setActiveTab('portofolio')}
                  className="text-xs font-bold text-stone-800 hover:text-emerald-700 flex items-center gap-1"
                >
                  <span>Lihat Galeri Lengkap</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {studentWorks.slice(0, 4).map(work => (
                  <div
                    key={work.id}
                    onClick={() => setActiveTab('portofolio')}
                    className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-md cursor-pointer transition-all flex flex-col justify-between"
                  >
                    <div className="relative aspect-square overflow-hidden bg-stone-100">
                      <img
                        src={work.image}
                        alt={work.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (target.src.includes('/src/assets/')) {
                            target.src = target.src.replace('/src/assets/', '/assets/');
                          }
                        }}
                      />
                      {work.grade && (
                        <span className="absolute top-2 right-2 bg-black/80 text-white font-mono text-[10px] px-2 py-0.5 rounded">
                          Nilai: {work.grade}
                        </span>
                      )}
                    </div>
                    <div className="p-3.5">
                      <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded">
                        {work.category}
                      </span>
                      <h5 className="font-heading font-bold text-stone-900 text-xs mt-1.5 truncate">
                        {work.title}
                      </h5>
                      <div className="flex items-center justify-between text-[11px] text-stone-500 mt-2">
                        <span>{work.author}</span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                          <span className="font-mono">{work.likes}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: MODUL TEORI */}
        {activeTab === 'modul' && (
          <ModuleList
            setActiveTab={setActiveTab}
            onNavigateToStudio={(tab) => {
              setStudioSubTab(tab as any);
              setActiveTab('studio-interaktif');
            }}
          />
        )}

        {/* TAB: STUDIO INTERAKTIF */}
        {activeTab === 'studio-interaktif' && (
          <div className="space-y-6">
            {/* Sub Tabs Switcher */}
            <div className="flex items-center gap-2 p-1.5 bg-white rounded-xl border border-stone-200 w-fit shadow-2xs">
              <button
                onClick={() => setStudioSubTab('nirmana')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  studioSubTab === 'nirmana'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                1. Nirmana Dwimatra Kinetik
              </button>
              <button
                onClick={() => setStudioSubTab('typography')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  studioSubTab === 'typography'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                2. Studio Anatomi & Kerning Huruf
              </button>
              <button
                onClick={() => setStudioSubTab('color')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  studioSubTab === 'color'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                3. Color Palette Studio Interaktif
              </button>
            </div>

            {studioSubTab === 'nirmana' && <InteractiveNirmana />}
            {studioSubTab === 'typography' && <InteractiveTypography />}
            {studioSubTab === 'color' && <InteractiveColorWheel />}
          </div>
        )}

        {/* TAB: PORTOFOLIO SISWA */}
        {activeTab === 'portofolio' && (
          <PortfolioSection
            works={studentWorks}
            onAddWork={handleAddWork}
            onLikeWork={handleLikeWork}
          />
        )}

        {/* TAB: DAILY ASESMEN (10 PG + 5 ESAI) */}
        {activeTab === 'asesmen' && (
          <DailyAssessment
            onAssessmentCompleted={(score) => {
              if (score >= 80) unlockBadge('badge-5');
            }}
          />
        )}

        {/* TAB: GAME DESAIN */}
        {activeTab === 'game' && <InteractiveGames />}

        {/* TAB: VIDEO KREATIF */}
        {activeTab === 'video' && <VideoSection />}

        {/* TAB: FORUM DISKUSI */}
        {activeTab === 'forum' && <ForumSection />}

        {/* TAB: JADWAL PRAKTIK */}
        {activeTab === 'jadwal' && <ScheduleSection />}

        {/* TAB: DASBOR GURU (PIN PROTECTED) */}
        {activeTab === 'guru' && (
          <TeacherDashboard
            studentWorks={studentWorks}
            onUpdateBadge={unlockBadge}
            onUpdateWorkGrade={handleUpdateWorkGrade}
          />
        )}
      </main>

      {/* Task Notifications Drawer */}
      <TaskNotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        tasks={tasks}
        onToggleTaskStatus={handleToggleTaskStatus}
      />

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={setActiveTab}
      />

      {/* Clean Minimalist Editorial Footer */}
      <footer className="mt-16 border-t border-stone-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-wrap items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-stone-900">DKV X Studio</span>
            <span aria-hidden="true">·</span>
            <span>Mata Pelajaran Desain Komunikasi Visual Kelas 10</span>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => setActiveTab('modul')} className="hover:text-stone-900">Modul</button>
            <button onClick={() => setActiveTab('studio-interaktif')} className="hover:text-stone-900">Studio Interaktif</button>
            <button onClick={() => setActiveTab('asesmen')} className="hover:text-stone-900">Asesmen Harian</button>
            <button onClick={() => setActiveTab('guru')} className="hover:text-stone-900">Dasbor Guru</button>
          </div>

          <div className="text-[11px] text-stone-400 font-mono">
            Kurikulum Merdeka SMK © 2026/2027
          </div>
        </div>
      </footer>
    </div>
  );
}
