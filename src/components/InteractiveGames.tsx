import React, { useState, useEffect } from 'react';
import { Trophy, Timer, RotateCcw, Sparkles, CheckCircle2, XCircle, Award, Target, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export const InteractiveGames: React.FC = () => {
  const [activeGame, setActiveGame] = useState<'color-sense' | 'font-detective' | 'bezier-challenge'>('color-sense');

  // --- GAME 1: Color Sense Challenge ---
  const [colorLevel, setColorLevel] = useState<number>(1);
  const [colorScore, setColorScore] = useState<number>(0);
  const [colorTimeLeft, setColorTimeLeft] = useState<number>(15);
  const [colorGameStatus, setColorGameStatus] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [gridSize, setGridSize] = useState<number>(3);
  const [targetTileIdx, setTargetTileIdx] = useState<number>(0);
  const [currentColorHue, setCurrentColorHue] = useState<number>(140);
  const [colorDelta, setColorDelta] = useState<number>(18);

  const startColorGame = () => {
    setColorLevel(1);
    setColorScore(0);
    setColorTimeLeft(15);
    setGridSize(3);
    setColorDelta(18);
    generateColorRound(1, 3, 18);
    setColorGameStatus('playing');
  };

  const generateColorRound = (lvl: number, size: number, delta: number) => {
    const totalTiles = size * size;
    const target = Math.floor(Math.random() * totalTiles);
    const hue = Math.floor(Math.random() * 360);
    setTargetTileIdx(target);
    setCurrentColorHue(hue);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (colorGameStatus === 'playing' && colorTimeLeft > 0) {
      timer = setInterval(() => {
        setColorTimeLeft(prev => {
          if (prev <= 1) {
            setColorGameStatus('gameover');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [colorGameStatus, colorTimeLeft]);

  const handleTileClick = (index: number) => {
    if (colorGameStatus !== 'playing') return;
    if (index === targetTileIdx) {
      // Correct!
      const nextScore = colorScore + 10 * colorLevel;
      const nextLevel = colorLevel + 1;
      setColorScore(nextScore);
      setColorTimeLeft(prev => Math.min(25, prev + 2)); // bonus time

      // Increase grid size dynamically
      let nextGridSize = 3;
      if (nextLevel >= 4) nextGridSize = 4;
      if (nextLevel >= 8) nextGridSize = 5;
      if (nextLevel >= 13) nextGridSize = 6;
      setGridSize(nextGridSize);

      // Decrease delta (make it subtly harder)
      const nextDelta = Math.max(3, 18 - Math.floor(nextLevel * 0.9));
      setColorDelta(nextDelta);

      generateColorRound(nextLevel, nextGridSize, nextDelta);

      if (nextLevel % 5 === 0) {
        confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
      }
    } else {
      // Wrong tile penalty
      setColorTimeLeft(prev => Math.max(0, prev - 2));
    }
  };

  // --- GAME 2: Font Detective ---
  const fontSpecimens = [
    {
      text: 'VINTAGE EDITORIAL',
      fontClass: 'font-serif',
      category: 'Serif',
      clue: 'Memiliki kait sirip (serif) pada ujung tangkai huruf, anggun dan berkarakter buku klasik.',
      options: ['Serif', 'Sans-Serif', 'Slab Serif', 'Script']
    },
    {
      text: 'MODERN MINIMALIST',
      fontClass: 'font-sans font-bold',
      category: 'Sans-Serif',
      clue: 'Tanpa kait sirip, garis batang bersih dan geometris, cocok untuk layar digital.',
      options: ['Serif', 'Sans-Serif', 'Blackletter', 'Display']
    },
    {
      text: 'ROBUST INDUSTRIAL',
      fontClass: 'font-mono font-black tracking-tight',
      category: 'Slab Serif',
      clue: 'Sirip berbentuk balok tebal dan kaku dengan ketebalan yang hampir setara garis utama batang huruf.',
      options: ['Slab Serif', 'Script', 'Sans-Serif', 'Cursive']
    },
    {
      text: 'Creative Signature',
      fontClass: 'font-sketch text-3xl',
      category: 'Script',
      clue: 'Goresan luwes menyerupai tulisan tangan bersambung atau kaligrafi kuas.',
      options: ['Script', 'Serif', 'Monospace', 'Display']
    },
    {
      text: 'TABULAR CODE 1024',
      fontClass: 'font-mono',
      category: 'Monospace',
      clue: 'Setiap karakter memiliki lebar ruang horizontal yang persis sama (fixed-pitch).',
      options: ['Monospace', 'Serif', 'Sans-Serif', 'Script']
    }
  ];

  const [fontRound, setFontRound] = useState<number>(0);
  const [fontScore, setFontScore] = useState<number>(0);
  const [fontSelectedAnswer, setFontSelectedAnswer] = useState<string | null>(null);
  const [fontAnswerFeedback, setFontAnswerFeedback] = useState<boolean | null>(null);

  const handleFontAnswer = (selected: string) => {
    if (fontSelectedAnswer) return;
    setFontSelectedAnswer(selected);
    const isCorrect = selected === fontSpecimens[fontRound].category;
    setFontAnswerFeedback(isCorrect);
    if (isCorrect) {
      setFontScore(prev => prev + 20);
      confetti({ particleCount: 25, spread: 50, origin: { y: 0.6 } });
    }
  };

  const nextFontQuestion = () => {
    setFontSelectedAnswer(null);
    setFontAnswerFeedback(null);
    if (fontRound < fontSpecimens.length - 1) {
      setFontRound(prev => prev + 1);
    } else {
      setFontRound(0); // loop or restart
    }
  };

  // --- GAME 3: Bezier Pen Tool Challenge ---
  const [controlY, setControlY] = useState<number>(100);
  const [targetY] = useState<number>(60);
  const isBezierMatched = Math.abs(controlY - targetY) <= 8;

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
      {/* Game Selector Header */}
      <div className="p-4 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 bg-stone-50/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-stone-900 text-lg">Arena Game & Kuis Desain Interaktif</span>
            <span className="text-xs text-stone-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Asah Insting DKV</span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">Latih kepekaan mata terhadap nilai warna, klasifikasi huruf, dan kurva pen tool</p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 bg-stone-200/70 p-1 rounded-lg">
          <button
            onClick={() => setActiveGame('color-sense')}
            className={`px-3 py-1 text-xs font-medium rounded transition-all ${
              activeGame === 'color-sense' ? 'bg-white text-stone-900 shadow-xs font-semibold' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Color Eye Challenge
          </button>
          <button
            onClick={() => setActiveGame('font-detective')}
            className={`px-3 py-1 text-xs font-medium rounded transition-all ${
              activeGame === 'font-detective' ? 'bg-white text-stone-900 shadow-xs font-semibold' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Font Detective
          </button>
          <button
            onClick={() => setActiveGame('bezier-challenge')}
            className={`px-3 py-1 text-xs font-medium rounded transition-all ${
              activeGame === 'bezier-challenge' ? 'bg-white text-stone-900 shadow-xs font-semibold' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Master Pen Tool
          </button>
        </div>
      </div>

      {/* GAME 1: COLOR SENSE CHALLENGE */}
      {activeGame === 'color-sense' && (
        <div className="p-6">
          <div className="max-w-xl mx-auto flex flex-col items-center">
            {/* Status bar */}
            <div className="w-full flex items-center justify-between p-3 bg-stone-50 rounded-lg border border-stone-200 mb-5">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span className="text-xs text-stone-600 font-medium">Skor: <span className="font-bold text-stone-900">{colorScore}</span></span>
                <span className="text-stone-300">|</span>
                <span className="text-xs text-stone-600 font-medium">Level: <span className="font-bold text-stone-900">{colorLevel}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Timer className={`w-4 h-4 ${colorTimeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-stone-500'}`} />
                <span className={`text-xs font-bold font-mono ${colorTimeLeft <= 5 ? 'text-red-600' : 'text-stone-800'}`}>
                  {colorTimeLeft}s
                </span>
              </div>
            </div>

            {colorGameStatus === 'idle' && (
              <div className="text-center py-10 px-4 bg-stone-50/60 rounded-xl border border-dashed border-stone-300 w-full">
                <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h4 className="font-heading font-bold text-lg text-stone-900">Uji Kepekaan Mata Kromatik</h4>
                <p className="text-xs text-stone-600 max-w-md mx-auto mt-1 mb-5">
                  Di antara kotak-kotak warna berikut, temukan 1 kotak yang memiliki tingkat terang (lightness) sedikit berbeda. Kecepatan dan ketepatan mata desainer diuji di sini!
                </p>
                <button
                  onClick={startColorGame}
                  className="px-5 py-2 text-xs font-bold text-white bg-stone-900 rounded-lg hover:bg-stone-800 transition-all shadow-sm"
                >
                  Mulai Tantangan Sekarang
                </button>
              </div>
            )}

            {colorGameStatus === 'playing' && (
              <div 
                className="grid gap-2 p-3 bg-stone-100 rounded-xl border border-stone-300 w-full max-w-[380px] aspect-square"
                style={{
                  gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                  gridTemplateRows: `repeat(${gridSize}, minmax(0, 1fr))`
                }}
              >
                {Array.from({ length: gridSize * gridSize }).map((_, idx) => {
                  const isTarget = idx === targetTileIdx;
                  // Base color vs target slight lightness deviation
                  const lightness = isTarget ? 50 + colorDelta : 50;
                  const bgStyle = `hsl(${currentColorHue}, 75%, ${lightness}%)`;

                  return (
                    <button
                      key={idx}
                      onClick={() => handleTileClick(idx)}
                      style={{ backgroundColor: bgStyle }}
                      className="w-full h-full rounded-lg transition-transform active:scale-95 hover:opacity-90 shadow-2xs"
                      aria-label={`Color tile ${idx + 1}`}
                    />
                  );
                })}
              </div>
            )}

            {colorGameStatus === 'gameover' && (
              <div className="text-center py-10 px-4 bg-stone-50 rounded-xl border border-stone-300 w-full">
                <div className="w-14 h-14 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-3">
                  <Award className="w-7 h-7" />
                </div>
                <h4 className="font-heading font-bold text-lg text-stone-900">Waktu Habis!</h4>
                <p className="text-xs text-stone-600 mt-1">
                  Skor Akhir: <span className="font-bold text-stone-900 text-sm">{colorScore} Poin</span> · Level Capaian: <span className="font-bold text-stone-900 text-sm">{colorLevel}</span>
                </p>
                <div className="my-3 text-xs font-medium text-emerald-700 bg-emerald-50 py-1.5 px-3 rounded-full inline-block border border-emerald-200">
                  {colorLevel >= 10 ? 'Gelar: Mata Elang Desainer Senior' : colorLevel >= 5 ? 'Gelar: Pengamat Warna Tajam' : 'Gelar: Calon Desainer Berbakat'}
                </div>
                <div className="mt-4">
                  <button
                    onClick={startColorGame}
                    className="px-5 py-2 text-xs font-bold text-white bg-stone-900 rounded-lg hover:bg-stone-800 transition-all shadow-sm"
                  >
                    Mainkan Lagi
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* GAME 2: FONT DETECTIVE */}
      {activeGame === 'font-detective' && (
        <div className="p-6">
          <div className="max-w-xl mx-auto">
            {/* Round info */}
            <div className="flex items-center justify-between text-xs text-stone-500 mb-4 pb-2 border-b border-stone-200">
              <span>Kasus Font {fontRound + 1} dari {fontSpecimens.length}</span>
              <span className="font-semibold text-stone-900">Skor Detektif: {fontScore}</span>
            </div>

            {/* Specimen Card */}
            <div className="p-8 bg-stone-50 rounded-xl border border-stone-300 text-center flex flex-col items-center justify-center min-h-[160px] relative">
              <span className="text-[10px] font-mono uppercase text-stone-400 absolute top-3 left-3">Spesimen Tipografi</span>
              <div className={`text-2xl md:text-3xl font-bold text-stone-900 tracking-wide ${fontSpecimens[fontRound].fontClass}`}>
                {fontSpecimens[fontRound].text}
              </div>
              <p className="text-xs text-stone-500 mt-3 italic">
                "{fontSpecimens[fontRound].clue}"
              </p>
            </div>

            {/* Choices */}
            <div className="grid grid-cols-2 gap-3 mt-5">
              {fontSpecimens[fontRound].options.map((option) => {
                let btnStyle = 'border-stone-300 bg-white text-stone-800 hover:bg-stone-50';
                if (fontSelectedAnswer) {
                  if (option === fontSpecimens[fontRound].category) {
                    btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                  } else if (option === fontSelectedAnswer) {
                    btnStyle = 'border-red-400 bg-red-50 text-red-800 line-through';
                  } else {
                    btnStyle = 'border-stone-200 bg-stone-50 text-stone-400 opacity-60';
                  }
                }

                return (
                  <button
                    key={option}
                    onClick={() => handleFontAnswer(option)}
                    disabled={fontSelectedAnswer !== null}
                    className={`p-3 text-xs rounded-lg border transition-all text-center ${btnStyle}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {/* Next question button */}
            {fontSelectedAnswer && (
              <div className="mt-4 flex items-center justify-between p-3 bg-stone-100 rounded-lg">
                <div className="text-xs">
                  {fontAnswerFeedback ? (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Tepat sekali! Anda mengidentifikasi ciri anatominya.
                    </span>
                  ) : (
                    <span className="text-red-700 font-semibold flex items-center gap-1.5">
                      <XCircle className="w-4 h-4" /> Belum tepat. Huruf ini masuk kategori {fontSpecimens[fontRound].category}.
                    </span>
                  )}
                </div>
                <button
                  onClick={nextFontQuestion}
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-stone-900 rounded-md hover:bg-stone-800 transition-colors"
                >
                  {fontRound < fontSpecimens.length - 1 ? 'Soal Berikutnya →' : 'Ulangi Latihan'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* GAME 3: BEZIER PEN TOOL CHALLENGE */}
      {activeGame === 'bezier-challenge' && (
        <div className="p-6">
          <div className="max-w-xl mx-auto flex flex-col items-center">
            <div className="text-center mb-4">
              <h4 className="font-heading font-bold text-stone-900 text-base">Tantangan Kurva Pen Tool (Bezier Curve)</h4>
              <p className="text-xs text-stone-500 mt-0.5">
                Geser handle kontrol kurva untuk menyelaraskan garis biru agar menempel pas pada garis putus-putus target emas!
              </p>
            </div>

            {/* Interactive SVG Canvas */}
            <div className="w-full max-w-[440px] aspect-[4/3] bg-stone-900 rounded-xl p-4 relative overflow-hidden border border-stone-800 flex items-center justify-center">
              {/* Graph grid lines */}
              <svg className="w-full h-full" viewBox="0 0 400 240">
                <defs>
                  <pattern id="game-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="400" height="240" fill="url(#game-grid)" />

                {/* Target Ghost Curve */}
                <path
                  d={`M 50 180 Q 200 ${targetY} 350 180`}
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="3"
                  strokeDasharray="6 6"
                  opacity="0.8"
                />

                {/* Student's Current Curve */}
                <path
                  d={`M 50 180 Q 200 ${controlY} 350 180`}
                  fill="none"
                  stroke={isBezierMatched ? '#10b981' : '#38bdf8'}
                  strokeWidth="3.5"
                />

                {/* Vector Anchor Points */}
                <circle cx="50" cy="180" r="5" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
                <circle cx="350" cy="180" r="5" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />

                {/* Control Handle Line */}
                <line x1="200" y1="180" x2="200" y2={controlY} stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                <circle cx="200" cy={controlY} r="7" fill={isBezierMatched ? '#10b981' : '#38bdf8'} stroke="#ffffff" strokeWidth="2" />
              </svg>

              {/* Status pill in canvas */}
              <div className="absolute top-3 right-3 text-[11px] font-mono px-2 py-0.5 rounded bg-black/60 text-white border border-white/10">
                {isBezierMatched ? 'STATUS: KURVA SEMPURNA (MATCH!)' : 'STATUS: SESUAIKAN TINGGI HANDLE'}
              </div>
            </div>

            {/* Slider Control */}
            <div className="w-full max-w-[440px] mt-4 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-stone-700 font-medium">Posisi Handle Y (Tarik Kurva)</span>
                <span className="font-mono text-stone-500">{controlY} px (Target: {targetY} px)</span>
              </div>
              <input
                type="range"
                min="20"
                max="200"
                value={controlY}
                onChange={(e) => setControlY(Number(e.target.value))}
                className="w-full accent-emerald-600 h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {isBezierMatched && (
              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 text-center font-medium animate-bounce">
                🎉 Hebat! Anda memahami prinsip tegangan kurva bezier pen tool dengan titik jangkar minimal.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
