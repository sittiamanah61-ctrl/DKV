import React, { useState } from 'react';
import { Type, Sliders, CheckCircle2, Info, ArrowLeftRight, Eye } from 'lucide-react';

export const InteractiveTypography: React.FC = () => {
  const [sampleWord, setSampleWord] = useState<string>('TYPOGRAPHY');
  const [selectedFont, setSelectedFont] = useState<'bricolage' | 'jakarta' | 'serif' | 'mono'>('bricolage');
  const [fontSize, setFontSize] = useState<number>(56);
  const [tracking, setTracking] = useState<number>(2);
  const [leading, setLeading] = useState<number>(1.2);
  const [fontWeight, setFontWeight] = useState<number>(700);
  const [showGuidelines, setShowGuidelines] = useState<boolean>(true);
  const [selectedAnatomy, setSelectedAnatomy] = useState<string | null>('baseline');
  
  // Interactive Kerning Game state for word "A V A T A R" or "D E S I G N"
  const [kerningLetters, setKerningLetters] = useState<{ char: string; offset: number }[]>([
    { char: 'D', offset: 0 },
    { char: 'E', offset: 0 },
    { char: 'S', offset: 0 },
    { char: 'I', offset: 0 },
    { char: 'G', offset: 0 },
    { char: 'N', offset: 0 }
  ]);
  const [activeLetterIdx, setActiveLetterIdx] = useState<number>(1);

  const anatomyDefinitions: Record<string, { title: string; desc: string; sample: string }> = {
    baseline: {
      title: 'Baseline (Garis Dasar)',
      desc: 'Garis maya horizontal di mana bagian bawah sebagian besar karakter bertumpu. Kunci keteraturan teks.',
      sample: 'Pijakan sejajar seluruh karakter'
    },
    capHeight: {
      title: 'Cap-Height (Tinggi Kapital)',
      desc: 'Tinggi huruf kapital dari baseline sampai ke titik puncak tertinggi huruf kapital (seperti H, T, B).',
      sample: 'Menentukan skala visual judul'
    },
    xHeight: {
      title: 'X-Height (Tinggi Huruf x)',
      desc: 'Tinggi tubuh utama huruf kecil (seperti x, o, a, c). Berpengaruh besar pada kenyamanan membaca ukuran kecil.',
      sample: 'Tinggi tubuh huruf non-ascender'
    },
    ascender: {
      title: 'Ascender (Bagian Menjulang)',
      desc: 'Bagian tangkai huruf kecil yang memanjang melampaui garis x-height (seperti pada huruf h, k, b, d).',
      sample: 'Tangkai ke atas melewati garis x'
    },
    descender: {
      title: 'Descender (Bagian Menjuntai)',
      desc: 'Bagian tubuh huruf kecil yang memanjang ke bawah menembus garis baseline (seperti pada huruf p, q, y, g, j).',
      sample: 'Ekor ke bawah menembus baseline'
    },
    kerning: {
      title: 'Kerning vs Tracking',
      desc: 'Kerning adalah penyesuaian optik jarak antara DUA karakter huruf berpasangan. Berbeda dengan tracking yang merata di seluruh kata.',
      sample: 'Harmonisasi ruang antar pasangan huruf'
    }
  };

  const updateLetterKerning = (delta: number) => {
    setKerningLetters(prev => prev.map((item, idx) => {
      if (idx === activeLetterIdx) {
        return { ...item, offset: Math.max(-20, Math.min(25, item.offset + delta)) };
      }
      return item;
    }));
  };

  const getFontFamilyClass = () => {
    switch (selectedFont) {
      case 'bricolage': return 'font-heading';
      case 'jakarta': return 'font-sans';
      case 'serif': return 'font-serif';
      case 'mono': return 'font-mono';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
      {/* Header */}
      <div className="p-4 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 bg-stone-50/70">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-stone-900 text-lg">Studio Anatomi & Eksplorasi Tipografi</span>
            <span className="text-xs text-stone-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Interaktif</span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">Uji kerning, tracking, leading, dan garis bantu anatomi huruf standar industri</p>
        </div>

        {/* Font Selection */}
        <div className="flex items-center gap-1 bg-stone-200/70 p-1 rounded-lg">
          <button
            onClick={() => setSelectedFont('bricolage')}
            className={`px-3 py-1 text-xs font-medium rounded transition-all ${
              selectedFont === 'bricolage' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Bricolage Grotesque
          </button>
          <button
            onClick={() => setSelectedFont('jakarta')}
            className={`px-3 py-1 text-xs font-medium rounded transition-all ${
              selectedFont === 'jakarta' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Plus Jakarta Sans
          </button>
          <button
            onClick={() => setSelectedFont('serif')}
            className={`px-3 py-1 text-xs font-medium rounded transition-all ${
              selectedFont === 'serif' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Serif Modern
          </button>
          <button
            onClick={() => setSelectedFont('mono')}
            className={`px-3 py-1 text-xs font-medium rounded transition-all ${
              selectedFont === 'mono' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Mono Tabular
          </button>
        </div>
      </div>

      {/* Main Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Visual Specimen Area */}
        <div className="lg:col-span-8 p-6 bg-stone-50/50 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-stone-200 min-h-[380px]">
          {/* Top Input Bar */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs font-semibold text-stone-600 whitespace-nowrap">Teks Sampel:</span>
            <input
              type="text"
              value={sampleWord}
              onChange={(e) => setSampleWord(e.target.value)}
              className="px-3 py-1.5 text-sm bg-white border border-stone-300 rounded-md text-stone-900 w-full max-w-sm focus:outline-none focus:ring-1 focus:ring-stone-900"
              placeholder="Ketik kata untuk uji tipografi..."
            />
            <button
              onClick={() => setShowGuidelines(!showGuidelines)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-all whitespace-nowrap ${
                showGuidelines ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-700 border-stone-300'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Garis Anatomi {showGuidelines ? 'Aktif' : 'Nonaktif'}</span>
            </button>
          </div>

          {/* Interactive Type Stage with Anatomical Guidelines */}
          <div className="relative py-12 px-6 bg-white rounded-lg border border-stone-200 shadow-xs overflow-hidden flex flex-col items-center justify-center min-h-[220px]">
            {/* Guide Lines */}
            {showGuidelines && (
              <div className="absolute inset-x-0 inset-y-0 pointer-events-none flex flex-col justify-center">
                {/* Ascender line */}
                <div className="w-full border-t border-dashed border-red-300 relative">
                  <span className="absolute right-2 -top-4 text-[10px] font-mono text-red-500 bg-white/90 px-1">Ascender Line</span>
                </div>
                {/* Cap height line */}
                <div className="w-full border-t border-dashed border-amber-300 relative mt-4">
                  <span className="absolute right-2 -top-4 text-[10px] font-mono text-amber-600 bg-white/90 px-1">Cap-Height</span>
                </div>
                {/* Meanline / x-height */}
                <div className="w-full border-t border-dashed border-sky-300 relative mt-6">
                  <span className="absolute right-2 -top-4 text-[10px] font-mono text-sky-600 bg-white/90 px-1">X-Height Meanline</span>
                </div>
                {/* Baseline */}
                <div className="w-full border-t-2 border-emerald-500 relative mt-8">
                  <span className="absolute right-2 -top-4 text-[10px] font-mono text-emerald-700 font-bold bg-white/90 px-1">Baseline (Garis Dasar)</span>
                </div>
                {/* Descender line */}
                <div className="w-full border-t border-dashed border-purple-300 relative mt-6">
                  <span className="absolute right-2 -top-4 text-[10px] font-mono text-purple-600 bg-white/90 px-1">Descender Line</span>
                </div>
              </div>
            )}

            {/* Displayed Text */}
            <div
              className={`relative z-10 text-stone-900 select-none text-center transition-all ${getFontFamilyClass()}`}
              style={{
                fontSize: `${fontSize}px`,
                letterSpacing: `${tracking}px`,
                lineHeight: leading,
                fontWeight: fontWeight,
              }}
            >
              {sampleWord || 'DKV KELAS 10'}
            </div>

            {/* Subtle graph coordinates */}
            <span className="absolute bottom-2 left-2 text-[10px] font-mono text-stone-400">
              Font: {selectedFont} · Size: {fontSize}px · Weight: {fontWeight} · Leading: {leading}
            </span>
          </div>

          {/* Interactive Pairwise Kerning Mini Sandbox */}
          <div className="mt-5 p-4 bg-white rounded-lg border border-stone-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
                <ArrowLeftRight className="w-3.5 h-3.5 text-stone-500" /> Eksplorasi Kerning Pasangan Huruf (Tangan Desainer)
              </span>
              <span className="text-xs text-stone-500">Pilih huruf lalu geser jaraknya</span>
            </div>
            
            <div className="flex items-center justify-center gap-2 py-4 bg-stone-50 rounded border border-stone-200 overflow-x-auto">
              {kerningLetters.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveLetterIdx(idx)}
                  className={`relative px-3 py-2 text-2xl font-bold font-heading rounded transition-all ${
                    activeLetterIdx === idx
                      ? 'bg-stone-900 text-white ring-2 ring-emerald-500 shadow-sm'
                      : 'bg-white text-stone-800 border border-stone-300 hover:bg-stone-100'
                  }`}
                  style={{ marginLeft: `${item.offset}px` }}
                >
                  {item.char}
                  {idx > 0 && item.offset !== 0 && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] font-mono text-stone-500 bg-white px-1 border border-stone-200 rounded">
                      {item.offset > 0 ? `+${item.offset}` : item.offset}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between mt-3">
              <div className="text-xs text-stone-600">
                Huruf aktif: <span className="font-bold text-stone-900">"{kerningLetters[activeLetterIdx]?.char}"</span> (Posisi {activeLetterIdx + 1})
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateLetterKerning(-2)}
                  className="px-2.5 py-1 text-xs font-medium bg-stone-100 border border-stone-300 rounded hover:bg-stone-200 text-stone-800"
                >
                  ← Rapatkan (-2px)
                </button>
                <button
                  onClick={() => updateLetterKerning(2)}
                  className="px-2.5 py-1 text-xs font-medium bg-stone-100 border border-stone-300 rounded hover:bg-stone-200 text-stone-800"
                >
                  Renggangkan (+2px) →
                </button>
                <button
                  onClick={() => setKerningLetters(prev => prev.map(l => ({ ...l, offset: 0 })))}
                  className="px-2.5 py-1 text-xs font-medium text-stone-500 hover:text-stone-800 underline"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sliders & Anatomy Explanations Deck */}
        <div className="lg:col-span-4 p-5 bg-white flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <span className="text-xs font-semibold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-stone-500" /> Kontrol Metrik Teks
              </span>
              <span className="text-xs text-stone-400">CSS & Vector Units</span>
            </div>

            {/* Font Size */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-stone-700 font-medium">Ukuran Huruf (Font Size)</span>
                <span className="font-mono text-stone-500">{fontSize} px</span>
              </div>
              <input
                type="range"
                min="24"
                max="96"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full accent-stone-900 h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Tracking (Letter Spacing) */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-stone-700 font-medium">Tracking (Rapatan Global)</span>
                <span className="font-mono text-stone-500">{tracking} px</span>
              </div>
              <input
                type="range"
                min="-4"
                max="20"
                value={tracking}
                onChange={(e) => setTracking(Number(e.target.value))}
                className="w-full accent-stone-900 h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Leading (Line Height) */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-stone-700 font-medium">Leading (Jarak Baris Kalimat)</span>
                <span className="font-mono text-stone-500">{leading}x</span>
              </div>
              <input
                type="range"
                min="0.9"
                max="2.2"
                step="0.05"
                value={leading}
                onChange={(e) => setLeading(Number(e.target.value))}
                className="w-full accent-stone-900 h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Weight */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-stone-700 font-medium">Ketebalan Bobot (Font Weight)</span>
                <span className="font-mono text-stone-500">{fontWeight}</span>
              </div>
              <input
                type="range"
                min="300"
                max="800"
                step="100"
                value={fontWeight}
                onChange={(e) => setFontWeight(Number(e.target.value))}
                className="w-full accent-stone-900 h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Anatomy Selector Pills */}
            <div className="pt-2">
              <span className="block text-xs font-semibold text-stone-700 mb-2">Pilih Glosarium Anatomi:</span>
              <div className="grid grid-cols-2 gap-1.5">
                {Object.keys(anatomyDefinitions).map((key) => (
                  <button
                    key={key}
                    onClick={() => setSelectedAnatomy(key)}
                    className={`px-2.5 py-1.5 text-xs text-left rounded border transition-all ${
                      selectedAnatomy === key
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-medium'
                        : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {anatomyDefinitions[key].title.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active Anatomy Card */}
          {selectedAnatomy && (
            <div className="mt-4 p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs space-y-1">
              <div className="font-semibold text-stone-900 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-emerald-600" />
                <span>{anatomyDefinitions[selectedAnatomy].title}</span>
              </div>
              <p className="text-stone-600 leading-relaxed">
                {anatomyDefinitions[selectedAnatomy].desc}
              </p>
              <div className="pt-1 text-[11px] text-stone-400 italic">
                Fungsi visual: {anatomyDefinitions[selectedAnatomy].sample}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
