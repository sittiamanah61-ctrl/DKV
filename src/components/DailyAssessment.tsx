import React, { useState, useEffect } from 'react';
import { ASSESSMENT_QUESTIONS, ESSAY_QUESTIONS } from '../data/dkvData';
import { StudentEssaySubmission } from '../types';
import { CheckCircle2, AlertCircle, FileText, Send, Sparkles, HelpCircle, Check, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DailyAssessmentProps {
  onAssessmentCompleted?: (score: number) => void;
}

export const DailyAssessment: React.FC<DailyAssessmentProps> = ({ onAssessmentCompleted }) => {
  const [activeTab, setActiveTab] = useState<'mcq' | 'essay'>('mcq');

  // Student details
  const [studentName, setStudentName] = useState<string>('Ahmad Rizky Pratama');
  const [studentClass, setStudentClass] = useState<'X DKV 1' | 'X DKV 2'>('X DKV 1');

  // MCQ state
  const [mcqAnswers, setMcqAnswers] = useState<Record<number, number>>({});
  const [isMcqSubmitted, setIsMcqSubmitted] = useState<boolean>(false);
  const [mcqScore, setMcqScore] = useState<number>(0);

  // Essay state
  const [essayAnswers, setEssayAnswers] = useState<Record<number, string>>({
    1: '',
    2: '',
    3: '',
    4: '',
    5: ''
  });
  const [isEssaySubmitted, setIsEssaySubmitted] = useState<boolean>(false);
  const [essaySubmitSuccess, setEssaySubmitSuccess] = useState<boolean>(false);

  // Load existing essay draft or submission
  useEffect(() => {
    const saved = localStorage.getItem('dkv_student_essay_draft');
    if (saved) {
      try {
        setEssayAnswers(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleSelectMcq = (questionId: number, optionIdx: number) => {
    if (isMcqSubmitted) return;
    setMcqAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleMcqSubmit = () => {
    if (Object.keys(mcqAnswers).length < ASSESSMENT_QUESTIONS.length) {
      const confirmIncomplete = window.confirm(
        `Anda baru menjawab ${Object.keys(mcqAnswers).length} dari 10 soal. Yakin ingin mengumpulkan sekarang?`
      );
      if (!confirmIncomplete) return;
    }

    let correctCount = 0;
    ASSESSMENT_QUESTIONS.forEach(q => {
      if (mcqAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / ASSESSMENT_QUESTIONS.length) * 100);
    setMcqScore(calculatedScore);
    setIsMcqSubmitted(true);

    if (calculatedScore >= 80) {
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    }

    if (onAssessmentCompleted) {
      onAssessmentCompleted(calculatedScore);
    }
  };

  const handleEssayChange = (qId: number, text: string) => {
    const updated = { ...essayAnswers, [qId]: text };
    setEssayAnswers(updated);
    localStorage.setItem('dkv_student_essay_draft', JSON.stringify(updated));
  };

  const handleEssaySubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const filledCount = Object.values(essayAnswers).filter(t => t.trim().length > 10).length;
    if (filledCount < 3) {
      alert('Mohon isi minimal 3 soal esai sebelum mengirim ke Dasbor Guru!');
      return;
    }

    const newSubmission: StudentEssaySubmission = {
      id: `sub-${Date.now()}`,
      studentName,
      studentClass,
      submittedAt: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      answers: ESSAY_QUESTIONS.map(q => ({
        questionId: q.id,
        answer: essayAnswers[q.id] || '(Belum dijawab)'
      })),
      mcqScore: isMcqSubmitted ? mcqScore : 85,
      isGraded: false
    };

    // Save to localStorage for Teacher Dashboard
    const existingRaw = localStorage.getItem('dkv_teacher_submissions');
    const existing: StudentEssaySubmission[] = existingRaw ? JSON.parse(existingRaw) : [];
    existing.unshift(newSubmission);
    localStorage.setItem('dkv_teacher_submissions', JSON.stringify(existing));

    setIsEssaySubmitted(true);
    setEssaySubmitSuccess(true);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
  };

  return (
    <div className="space-y-6">
      {/* Student Profile & Mode Selector Header */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-stone-900 text-xl">Daily Asesmen DKV Kelas 10</span>
              <span className="text-xs text-stone-600 bg-stone-100 px-2.5 py-0.5 rounded border border-stone-200">Kurikulum Merdeka SMK</span>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Evaluasi komprehensif harian: 10 Soal Pilihan Ganda Teori & 5 Soal Esai Analisis Konsep Rupa
            </p>
          </div>

          {/* Student Identifiers */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-200">
              <span className="text-xs text-stone-500 font-medium">Siswa:</span>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="text-xs font-semibold text-stone-900 bg-transparent border-none focus:outline-none w-36"
                placeholder="Nama Anda"
              />
            </div>
            <select
              value={studentClass}
              onChange={(e) => setStudentClass(e.target.value as 'X DKV 1' | 'X DKV 2')}
              className="text-xs font-semibold text-stone-900 bg-stone-50 px-2.5 py-1.5 rounded-lg border border-stone-200 focus:outline-none"
            >
              <option value="X DKV 1">X DKV 1</option>
              <option value="X DKV 2">X DKV 2</option>
            </select>
          </div>
        </div>

        {/* Tab switch between MCQ and Essay */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-stone-100">
          <button
            onClick={() => setActiveTab('mcq')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'mcq'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Bagian 1: 10 Soal Pilihan Ganda</span>
            {isMcqSubmitted && (
              <span className="bg-emerald-500 text-white text-[10px] px-1.5 py-0.2 rounded font-mono">
                {mcqScore}/100
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('essay')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'essay'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Bagian 2: 5 Soal Esai Analitis</span>
            {isEssaySubmitted && (
              <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.2 rounded">Terkirim</span>
            )}
          </button>
        </div>
      </div>

      {/* TAB 1: PILIHAN GANDA (10 SOAL) */}
      {activeTab === 'mcq' && (
        <div className="space-y-4">
          {/* Status summary banner if submitted */}
          {isMcqSubmitted && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
              <div>
                <h4 className="font-heading font-bold text-emerald-950 text-base">Hasil Asesmen Pilihan Ganda</h4>
                <p className="text-xs text-emerald-700 mt-0.5">
                  Anda menjawab benar {Math.round((mcqScore / 100) * ASSESSMENT_QUESTIONS.length)} dari 10 soal kurikulum DKV.
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black font-heading text-emerald-700">{mcqScore}</div>
                <div className="text-[10px] text-emerald-600 font-mono uppercase">Nilai Akhir (KBM: 75)</div>
              </div>
            </div>
          )}

          {/* List of 10 questions */}
          <div className="space-y-4">
            {ASSESSMENT_QUESTIONS.map((q, qIdx) => {
              const selectedOpt = mcqAnswers[q.id];
              const isAnswered = selectedOpt !== undefined;

              return (
                <div 
                  key={q.id} 
                  className={`bg-white rounded-xl border p-5 transition-all ${
                    isMcqSubmitted
                      ? selectedOpt === q.correctAnswer
                        ? 'border-emerald-200 bg-emerald-50/20'
                        : 'border-red-200 bg-red-50/20'
                      : 'border-stone-200 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-stone-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
                        {qIdx + 1}
                      </span>
                      <span className="text-xs font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                        {q.category}
                      </span>
                    </div>
                    {isMcqSubmitted && (
                      <span className={`text-xs font-bold ${selectedOpt === q.correctAnswer ? 'text-emerald-700' : 'text-red-600'}`}>
                        {selectedOpt === q.correctAnswer ? '✓ Benar (+10)' : '✗ Salah (0)'}
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-medium text-stone-900 leading-relaxed mb-4">
                    {q.question}
                  </p>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {q.options.map((opt, optIdx) => {
                      let optClass = 'border-stone-200 bg-stone-50/60 text-stone-700 hover:bg-stone-100';

                      if (selectedOpt === optIdx) {
                        optClass = 'border-stone-900 bg-stone-900 text-white font-medium shadow-xs';
                      }

                      if (isMcqSubmitted) {
                        if (optIdx === q.correctAnswer) {
                          optClass = 'border-emerald-600 bg-emerald-600 text-white font-semibold';
                        } else if (selectedOpt === optIdx && optIdx !== q.correctAnswer) {
                          optClass = 'border-red-500 bg-red-500 text-white';
                        } else {
                          optClass = 'border-stone-200 bg-stone-50 text-stone-400 opacity-60';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={isMcqSubmitted}
                          onClick={() => handleSelectMcq(q.id, optIdx)}
                          className={`p-3 text-xs text-left rounded-lg border transition-all flex items-center gap-2.5 ${optClass}`}
                        >
                          <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] font-mono shrink-0">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="leading-snug">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Pedagogical Explanation when submitted */}
                  {isMcqSubmitted && (
                    <div className="mt-3.5 p-3 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-600 space-y-1">
                      <span className="font-semibold text-stone-800 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Pembahasan Kurikulum:</span>
                      </span>
                      <p className="leading-relaxed pl-5">{q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Submit MCQ CTA */}
          <div className="bg-white p-4 rounded-xl border border-stone-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="text-xs text-stone-500">
              Status pengerjaan: <span className="font-bold text-stone-900">{Object.keys(mcqAnswers).length} dari 10</span> terjawab
            </div>
            <div className="flex items-center gap-3">
              {isMcqSubmitted ? (
                <button
                  onClick={() => {
                    setIsMcqSubmitted(false);
                    setMcqAnswers({});
                  }}
                  className="px-4 py-2 text-xs font-semibold bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200"
                >
                  Ulangi Pengerjaan Asesmen
                </button>
              ) : (
                <button
                  onClick={handleMcqSubmit}
                  className="px-5 py-2 text-xs font-bold text-white bg-stone-900 rounded-lg hover:bg-stone-800 transition-all shadow-sm"
                >
                  Kirim & Periksa Jawaban Pilihan Ganda
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SOAL ESAI (5 SOAL) */}
      {activeTab === 'essay' && (
        <form onSubmit={handleEssaySubmit} className="space-y-5">
          {essaySubmitSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Jawaban esai Anda telah berhasil dikirimkan ke <strong>Dasbor Guru (Ibu Sitti Saadah Al amanah, S.Kom)</strong> untuk proses penilaian kualitatif & feedback.</span>
              </div>
              <span className="font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">Tersimpan di Dasbor</span>
            </div>
          )}

          <div className="space-y-4">
            {ESSAY_QUESTIONS.map((eq, eqIdx) => (
              <div key={eq.id} className="bg-white rounded-xl border border-stone-200 p-5 shadow-2xs">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {eqIdx + 1}
                    </span>
                    <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                      {eq.category}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-stone-400">Bobot: 20 Poin</span>
                </div>

                <p className="text-sm font-semibold text-stone-900 leading-relaxed mb-2">
                  {eq.question}
                </p>

                {/* Rubric and Hint */}
                <div className="mb-3 p-2.5 bg-stone-50 rounded-lg border border-stone-200 text-xs text-stone-500 space-y-1">
                  <div><strong className="text-stone-700">Rubrik:</strong> {eq.rubric}</div>
                  <div><strong className="text-stone-700">Petunjuk:</strong> {eq.hint}</div>
                </div>

                {/* Textarea */}
                <div>
                  <textarea
                    rows={4}
                    value={essayAnswers[eq.id] || ''}
                    onChange={(e) => handleEssayChange(eq.id, e.target.value)}
                    placeholder="Tuliskan analisis dan penjelasan Anda secara runtut dan mendalam..."
                    className="w-full text-xs p-3 bg-stone-50/70 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white transition-colors"
                  />
                  <div className="flex justify-between items-center text-[10px] text-stone-400 mt-1">
                    <span>Draft otomatis tersimpan lokal</span>
                    <span>{(essayAnswers[eq.id] || '').length} karakter</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Submit Essay Action */}
          <div className="p-4 bg-white rounded-xl border border-stone-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="text-xs text-stone-500">
              Pengirim: <strong className="text-stone-900">{studentName} ({studentClass})</strong>
            </div>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-stone-900 rounded-lg hover:bg-stone-800 transition-all shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kirim 5 Esai ke Dasbor Guru</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
