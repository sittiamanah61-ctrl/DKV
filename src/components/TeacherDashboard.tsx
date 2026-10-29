import React, { useState, useEffect } from 'react';
import { StudentWork, StudentEssaySubmission, BadgeItem } from '../types';
import { INITIAL_STUDENT_WORKS, ESSAY_QUESTIONS, INITIAL_BADGES } from '../data/dkvData';
import { 
  Lock, 
  Unlock, 
  ShieldCheck, 
  CheckCircle2, 
  Award, 
  MessageSquare, 
  Download, 
  Filter, 
  Search,
  Star,
  Users,
  ClipboardList,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface TeacherDashboardProps {
  onUpdateBadge?: (badgeId: string) => void;
  onUpdateWorkGrade?: (workId: string, grade: number, feedback: string, badge?: string) => void;
  studentWorks: StudentWork[];
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ 
  onUpdateBadge, 
  onUpdateWorkGrade,
  studentWorks 
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState<boolean>(false);

  // Filter
  const [classFilter, setClassFilter] = useState<'All' | 'X DKV 1' | 'X DKV 2'>('All');
  const [activeTab, setActiveTab] = useState<'essays' | 'portfolio' | 'badges'>('essays');

  // Submissions state
  const [essaySubmissions, setEssaySubmissions] = useState<StudentEssaySubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<StudentEssaySubmission | null>(null);
  const [gradingScore, setGradingScore] = useState<number>(85);
  const [teacherNotes, setTeacherNotes] = useState<string>('');
  const [feedbackSuccess, setFeedbackSuccess] = useState<boolean>(false);

  // Portfolio grading state
  const [selectedWorkId, setSelectedWorkId] = useState<string | null>(null);
  const [workGrade, setWorkGrade] = useState<number>(90);
  const [workFeedback, setWorkFeedback] = useState<string>('');
  const [selectedBadgeToAward, setSelectedBadgeToAward] = useState<string>('Master Nirmana');

  // Check existing session
  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('dkv_teacher_authenticated');
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
    }
    loadSubmissions();
  }, []);

  const loadSubmissions = () => {
    const raw = localStorage.getItem('dkv_teacher_submissions');
    if (raw) {
      try {
        setEssaySubmissions(JSON.parse(raw));
      } catch (e) {
        console.error(e);
      }
    } else {
      // Seed realistic initial submissions so teacher dashboard isn't blank
      const seed: StudentEssaySubmission[] = [
        {
          id: 'sub-seed-1',
          studentName: 'Ahmad Rizky Pratama',
          studentClass: 'X DKV 1',
          submittedAt: '28 Okt 2026, 09:15',
          mcqScore: 90,
          totalGrade: 92,
          teacherNotes: 'Analisis mengenai ritme garis nirmana sangat komprehensif. Pemahaman tentang optical depth sangat tajam.',
          isGraded: true,
          answers: [
            { questionId: 1, answer: 'Keseimbangan asimetris memanfaatkan perbedaan bobot visual objek besar di satu sisi yang diimbangi oleh beberapa objek kecil atau aksen warna berdaya kejut tinggi di sisi lain. Contohnya pada poster festival musik jazz, foto penyanyi besar di kiri diseimbangkan dengan tipografi jadwal yang tebal dan berwarna kontras di kanan.' },
            { questionId: 2, answer: 'Leading yang terlalu sempit membuat huruf bertabrakan antara ascender baris bawah dan descender baris atas sehingga mata pembaca tersendat. Solusinya adalah memberi leading 120-140% dari ukuran font body.' },
            { questionId: 3, answer: 'Nirmana garis menciptakan gerak melalui pengulangan garis lengkung dengan jarak yang kian merapat secara gradual, memicu efek moire dan ilusi kedalaman kinetik pada retina.' },
            { questionId: 4, answer: 'Skema analogous warna hijau daun, cokelat tanah, dan aksen kuning jagung. Hijau melambangkan kesegaran alami, sedangkan cokelat memberi asosiasi organik bumi tanpa pestisida.' },
            { questionId: 5, answer: 'Sistem grid membagi ruang kanvas menjadi modul terukur. Ini menjamin alignment yang rapi antar paragraf teks dan foto, sehingga audiens mudah menelusuri pesan secara teratur.' }
          ]
        },
        {
          id: 'sub-seed-2',
          studentName: 'Nabila Syahrani',
          studentClass: 'X DKV 2',
          submittedAt: '28 Okt 2026, 14:30',
          mcqScore: 80,
          isGraded: false,
          answers: [
            { questionId: 1, answer: 'Keseimbangan asimetris menciptakan dinamika karena mata pemirsa dipandu bergerak menjelajah kanvas secara diagonal dan tidak kaku seperti cermin simetris.' },
            { questionId: 2, answer: 'Jika leading terlalu mepet, baris kalimat terlihat menumpuk dan melelahkan mata saat perpindahan antar baris.' },
            { questionId: 3, answer: 'Melalui gradasi kerapatan garis dan lengkungan konsentris yang memberi ilusi getaran gelombang air.' },
            { questionId: 4, answer: 'Warna hijau zaitun dan krem alami untuk menimbulkan kesan hangat, bersih, dan menyehatkan tubuh.' },
            { questionId: 5, answer: 'Modular grid membantu menata informasi banyak agar tidak acak-acakan dan terlihat profesional ala Swiss Style.' }
          ]
        }
      ];
      setEssaySubmissions(seed);
      localStorage.setItem('dkv_teacher_submissions', JSON.stringify(seed));
    }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // PIN is "guru123" without revealing it anywhere on screen
    if (pinInput === 'guru123') {
      setIsAuthenticated(true);
      sessionStorage.setItem('dkv_teacher_authenticated', 'true');
      setPinError(null);
      setPinInput('');
    } else {
      setPinError('PIN verifikasi tidak sesuai. Silakan hubungi koordinator mapel.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('dkv_teacher_authenticated');
    setSelectedSubmission(null);
  };

  const handleSaveEssayGrading = () => {
    if (!selectedSubmission) return;

    const updated = essaySubmissions.map(sub => {
      if (sub.id === selectedSubmission.id) {
        return {
          ...sub,
          totalGrade: gradingScore,
          teacherNotes: teacherNotes,
          isGraded: true
        };
      }
      return sub;
    });

    setEssaySubmissions(updated);
    localStorage.setItem('dkv_teacher_submissions', JSON.stringify(updated));
    setSelectedSubmission(prev => prev ? { ...prev, totalGrade: gradingScore, teacherNotes, isGraded: true } : null);
    setFeedbackSuccess(true);
    setTimeout(() => setFeedbackSuccess(false), 3000);
    confetti({ particleCount: 30, spread: 50 });
  };

  const handleSaveWorkFeedback = (workId: string) => {
    if (onUpdateWorkGrade) {
      onUpdateWorkGrade(workId, workGrade, workFeedback, selectedBadgeToAward);
    }
    setSelectedWorkId(null);
    confetti({ particleCount: 25, spread: 60 });
  };

  const exportGradesToCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Nama Siswa,Kelas,Skor Pilihan Ganda,Nilai Akhir Esai,Status Penilaian,Catatan Guru\n';

    essaySubmissions.forEach(sub => {
      const row = `"${sub.studentName}","${sub.studentClass}",${sub.mcqScore},${sub.totalGrade || 'Belum Dinilai'},"${sub.isGraded ? 'Sudah Dinilai' : 'Menunggu Review'}","${(sub.teacherNotes || '').replace(/"/g, '""')}"`;
      csvContent += row + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_Nilai_DKV_Kelas10_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredSubmissions = essaySubmissions.filter(sub => {
    if (classFilter === 'All') return true;
    return sub.studentClass === classFilter;
  });

  const filteredWorks = studentWorks.filter(w => {
    if (classFilter === 'All') return true;
    return w.studentClass === classFilter;
  });

  // --- PIN LOCK SCREEN (Without displaying the pin) ---
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-12 px-4">
        <div className={`bg-white rounded-2xl border border-stone-200 p-8 shadow-sm transition-transform ${isShaking ? 'animate-shake' : ''}`}>
          <div className="w-12 h-12 rounded-xl bg-stone-900 text-white flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-stone-200" />
          </div>

          <div className="text-center mb-6">
            <h3 className="font-heading font-bold text-xl text-stone-900">Akses Dasbor Guru DKV</h3>
            <p className="text-xs text-stone-500 mt-1">
              Khusus guru pengampu (Ibu Sitti Saadah Al amanah, S.Kom & Tim DKV). Masukkan PIN keamanan untuk memantau progres dan memberi umpan balik tugas.
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                PIN Keamanan Guru
              </label>
              <input
                type="password"
                maxLength={16}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Masukkan PIN rahasia..."
                className="w-full px-4 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-lg text-stone-900 tracking-widest focus:outline-none focus:ring-2 focus:ring-stone-900 focus:bg-white"
                autoFocus
              />
            </div>

            {pinError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{pinError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-stone-900 rounded-lg hover:bg-stone-800 transition-colors shadow-xs"
            >
              Buka Dasbor Guru
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-stone-100 text-center text-[11px] text-stone-400">
            Sistem Penilaian Kurikulum Merdeka DKV SMK
          </div>
        </div>
      </div>
    );
  }

  // --- AUTHENTICATED TEACHER DASHBOARD ---
  return (
    <div className="space-y-6">
      {/* Top Banner & Control Bar */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="font-heading font-bold text-stone-900 text-xl">Dasbor Pengajar & Evaluasi Siswa</h3>
            <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-medium">
              Sesi Guru Aktif
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Pengampu: Ibu Sitti Saadah Al amanah, S.Kom · SMK Negeri Kompetensi Keahlian DKV
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportGradesToCSV}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-stone-100 border border-stone-300 rounded-lg hover:bg-stone-200 text-stone-800 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor Rekap CSV</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Kunci Dasbor</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <div className="text-xs text-stone-500 font-medium">Total Siswa Terdaftar</div>
          <div className="text-2xl font-black font-heading text-stone-900 mt-1 tabular-nums">72 Siswa</div>
          <div className="text-[11px] text-stone-400 mt-0.5">X DKV 1 & X DKV 2</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <div className="text-xs text-stone-500 font-medium">Asesmen Masuk</div>
          <div className="text-2xl font-black font-heading text-stone-900 mt-1 tabular-nums">{essaySubmissions.length} Berkas</div>
          <div className="text-[11px] text-stone-400 mt-0.5">{essaySubmissions.filter(s => !s.isGraded).length} Perlu Review</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <div className="text-xs text-stone-500 font-medium">Karya Portofolio</div>
          <div className="text-2xl font-black font-heading text-stone-900 mt-1 tabular-nums">{studentWorks.length} Karya</div>
          <div className="text-[11px] text-emerald-600 mt-0.5">Galeri Terkurasi</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <div className="text-xs text-stone-500 font-medium">Rata-Rata Asesmen</div>
          <div className="text-2xl font-black font-heading text-stone-900 mt-1 tabular-nums">88.5</div>
          <div className="text-[11px] text-emerald-600 mt-0.5">Diatas KKM (75)</div>
        </div>
      </div>

      {/* Filter and Tab Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-stone-200 shadow-2xs">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('essays')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'essays' ? 'bg-stone-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Review Esai & Asesmen ({essaySubmissions.length})
          </button>
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'portfolio' ? 'bg-stone-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Review Portofolio ({studentWorks.length})
          </button>
          <button
            onClick={() => setActiveTab('badges')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'badges' ? 'bg-stone-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Lencana Motivasi Siswa
          </button>
        </div>

        {/* Filter by class */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500 font-medium">Filter Kelas:</span>
          <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg border border-stone-200">
            {(['All', 'X DKV 1', 'X DKV 2'] as const).map(cls => (
              <button
                key={cls}
                onClick={() => setClassFilter(cls)}
                className={`px-2.5 py-1 text-xs rounded transition-all ${
                  classFilter === cls ? 'bg-white font-bold text-stone-900 shadow-xs' : 'text-stone-600'
                }`}
              >
                {cls === 'All' ? 'Semua' : cls}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TAB 1: ESSAY & ASSESSMENT REVIEW */}
      {activeTab === 'essays' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Submissions List */}
          <div className="lg:col-span-5 space-y-3">
            <span className="text-xs font-bold text-stone-700 block uppercase tracking-wider">
              Daftar Pengiriman Siswa
            </span>
            {filteredSubmissions.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-xl border border-stone-200 text-stone-400 text-xs">
                Belum ada berkas asesmen dari kelas ini.
              </div>
            ) : (
              filteredSubmissions.map(sub => (
                <div
                  key={sub.id}
                  onClick={() => {
                    setSelectedSubmission(sub);
                    setGradingScore(sub.totalGrade || sub.mcqScore);
                    setTeacherNotes(sub.teacherNotes || '');
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedSubmission?.id === sub.id
                      ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900 shadow-xs'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-stone-900 text-sm">{sub.studentName}</span>
                    <span className="text-xs text-stone-500 font-mono">{sub.studentClass}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs mt-2">
                    <span className="text-stone-500">{sub.submittedAt}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      sub.isGraded ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {sub.isGraded ? `Dinilai: ${sub.totalGrade}` : 'Perlu Dinilai'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Submission Details & Grading Deck */}
          <div className="lg:col-span-7">
            {selectedSubmission ? (
              <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div>
                    <h4 className="font-heading font-bold text-stone-900 text-base">
                      {selectedSubmission.studentName}
                    </h4>
                    <p className="text-xs text-stone-500">
                      Kelas: {selectedSubmission.studentClass} · Skor Pilihan Ganda: <strong className="text-stone-900">{selectedSubmission.mcqScore}</strong>/100
                    </p>
                  </div>
                  {selectedSubmission.isGraded && (
                    <div className="text-right">
                      <div className="text-2xl font-black font-heading text-emerald-700">{selectedSubmission.totalGrade}</div>
                      <div className="text-[10px] text-stone-400 font-mono">Nilai Terkoreksi</div>
                    </div>
                  )}
                </div>

                {/* Answers List */}
                <div className="space-y-4 max-h-[360px] overflow-y-auto pr-2">
                  {selectedSubmission.answers.map((ans, idx) => {
                    const questionObj = ESSAY_QUESTIONS.find(q => q.id === ans.questionId);
                    return (
                      <div key={idx} className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs">
                        <div className="font-semibold text-stone-800 mb-1">
                          Soal {idx + 1} ({questionObj?.category}): {questionObj?.question}
                        </div>
                        <div className="p-2.5 bg-white rounded border border-stone-200 text-stone-700 leading-relaxed">
                          {ans.answer}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Grading Controls */}
                <div className="pt-4 border-t border-stone-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-stone-800">
                      Berikan Nilai Akhir (0 - 100):
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={gradingScore}
                        onChange={(e) => setGradingScore(Number(e.target.value))}
                        className="w-20 px-2 py-1 text-sm font-bold text-stone-900 border border-stone-300 rounded text-center focus:outline-none focus:ring-1 focus:ring-stone-900"
                      />
                      <span className="text-xs text-stone-400">Poin</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      Catatan & Umpan Balik Kualitatif Guru:
                    </label>
                    <textarea
                      rows={3}
                      value={teacherNotes}
                      onChange={(e) => setTeacherNotes(e.target.value)}
                      placeholder="Tuliskan apresiasi, koreksi teknis anatomi/nirmana, dan saran pengembangan..."
                      className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
                    />
                  </div>

                  {feedbackSuccess && (
                    <div className="p-2 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Nilai dan catatan evaluasi berhasil disimpan dan diteruskan ke siswa!</span>
                    </div>
                  )}

                  <button
                    onClick={handleSaveEssayGrading}
                    className="w-full py-2 px-4 text-xs font-bold text-white bg-stone-900 rounded-lg hover:bg-stone-800 transition-colors shadow-xs"
                  >
                    Simpan & Publikasikan Umpan Balik Siswa
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center p-8 bg-white rounded-xl border border-dashed border-stone-300 text-center">
                <ClipboardList className="w-10 h-10 text-stone-300 mb-2" />
                <span className="text-xs font-medium text-stone-500">Pilih salah satu berkas siswa di sebelah kiri untuk mulai mengoreksi esai</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: PORTFOLIO REVIEW & GRADING */}
      {activeTab === 'portfolio' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredWorks.map(work => (
            <div key={work.id} className="bg-white rounded-xl border border-stone-200 p-4 shadow-2xs space-y-3">
              <div className="flex gap-4 items-start">
                <img
                  src={work.image}
                  alt={work.title}
                  className="w-24 h-24 object-cover rounded-lg border border-stone-200 shrink-0"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src.includes('/src/assets/')) {
                      target.src = target.src.replace('/src/assets/', '/assets/');
                    }
                  }}
                />
                <div className="flex-1">
                  <span className="text-[10px] uppercase font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                    {work.category}
                  </span>
                  <h4 className="font-heading font-bold text-stone-900 text-sm mt-1">{work.title}</h4>
                  <p className="text-xs text-stone-500">{work.author} ({work.studentClass})</p>
                  <div className="text-xs text-stone-600 mt-2 line-clamp-2">{work.description}</div>
                </div>
              </div>

              {/* Current grade & teacher note */}
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-stone-800">Nilai Karya: {work.grade ? `${work.grade}/100` : 'Belum Dinilai'}</span>
                  {work.badgeAwarded && (
                    <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1">
                      <Award className="w-3 h-3 text-amber-600" /> {work.badgeAwarded}
                    </span>
                  )}
                </div>
                <p className="text-stone-600 italic">
                  "{work.teacherFeedback || 'Belum ada umpan balik guru.'}"
                </p>
              </div>

              {/* Action modal trigger */}
              {selectedWorkId === work.id ? (
                <div className="p-3 bg-stone-100/70 rounded-lg space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-stone-700">Update Nilai (0-100):</span>
                    <input
                      type="number"
                      value={workGrade}
                      onChange={(e) => setWorkGrade(Number(e.target.value))}
                      className="w-16 px-2 py-0.5 text-xs font-bold border border-stone-300 rounded text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">Kritik & Umpan Balik Guru:</label>
                    <textarea
                      rows={2}
                      value={workFeedback}
                      onChange={(e) => setWorkFeedback(e.target.value)}
                      placeholder="Beri apresiasi atau saran perbaikan komposisi..."
                      className="w-full text-xs p-2 bg-white border border-stone-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">Berikan Lencana Prestasi:</label>
                    <select
                      value={selectedBadgeToAward}
                      onChange={(e) => setSelectedBadgeToAward(e.target.value)}
                      className="w-full text-xs p-1.5 bg-white border border-stone-300 rounded"
                    >
                      <option value="Master Nirmana">Master Nirmana</option>
                      <option value="Typo Guru">Typo Guru</option>
                      <option value="Kreator Poster Juara">Kreator Poster Juara</option>
                      <option value="Anatomi Huruf">Anatomi Huruf</option>
                      <option value="Mata Tajam Kromatik">Mata Tajam Kromatik</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      onClick={() => setSelectedWorkId(null)}
                      className="px-2.5 py-1 text-xs text-stone-600 hover:bg-stone-200 rounded"
                    >
                      Batal
                    </button>
                    <button
                      onClick={() => handleSaveWorkFeedback(work.id)}
                      className="px-3 py-1 text-xs font-bold text-white bg-stone-900 rounded hover:bg-stone-800"
                    >
                      Simpan Review
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setSelectedWorkId(work.id);
                    setWorkGrade(work.grade || 90);
                    setWorkFeedback(work.teacherFeedback || '');
                    setSelectedBadgeToAward(work.badgeAwarded || 'Master Nirmana');
                  }}
                  className="w-full py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
                >
                  Beri Nilai & Umpan Balik Guru
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: BADGES SYSTEM */}
      {activeTab === 'badges' && (
        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div>
            <h4 className="font-heading font-bold text-stone-900 text-base">Manajemen Lencana Motivasi Belajar</h4>
            <p className="text-xs text-stone-500 mt-0.5">
              Lencana ini diberikan kepada siswa yang aktif, berdisiplin, dan menunjukkan progres visual luar biasa setiap hari.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
            {INITIAL_BADGES.map(badge => (
              <div key={badge.id} className="p-4 rounded-xl border border-stone-200 bg-stone-50/70 flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 border border-amber-200">
                  <Award className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h5 className="font-heading font-bold text-stone-900 text-xs">{badge.name}</h5>
                    <span className="text-[10px] font-mono text-stone-400">{badge.category}</span>
                  </div>
                  <p className="text-[11px] text-stone-600 mt-1 leading-snug">{badge.description}</p>
                  <div className="mt-2.5">
                    <button
                      onClick={() => {
                        if (onUpdateBadge) onUpdateBadge(badge.id);
                        alert(`Lencana "${badge.name}" telah disematkan untuk memotivasi siswa kelas 10!`);
                      }}
                      className="px-2.5 py-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded hover:bg-emerald-100 transition-colors"
                    >
                      + Anugerahkan ke Kelas
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
