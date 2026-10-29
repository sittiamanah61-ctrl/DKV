import React, { useState } from 'react';
import { Palette, Sparkles, RefreshCw, Layers } from 'lucide-react';

interface ColorHarmony {
  name: string;
  desc: string;
  formula: string;
}

export const InteractiveColorWheel: React.FC = () => {
  const [baseHue, setBaseHue] = useState<number>(145); // Emerald Green default matching prompt
  const [harmonyMode, setHarmonyMode] = useState<'complementary' | 'analogous' | 'triadic' | 'monochrome'>('complementary');
  const [saturation, setSaturation] = useState<number>(85);
  const [lightness, setLightness] = useState<number>(45);

  const harmonies: Record<string, ColorHarmony> = {
    complementary: {
      name: 'Komplementer (Berseberangan)',
      desc: 'Warna dengan jarak 180° pada roda warna. Menghasilkan kontras paling dinamis dan berenergi.',
      formula: 'Hue Dasar + 180°'
    },
    analogous: {
      name: 'Analogous (Bersebelahan)',
      desc: 'Tiga warna yang letaknya berdampingan (jarak ±30°). Menciptakan suasana tenang, serasi, dan alami.',
      formula: 'Hue Dasar - 30°, Hue Dasar, Hue Dasar + 30°'
    },
    triadic: {
      name: 'Triadik (Segitiga Sama Sisi)',
      desc: 'Tiga warna dengan interval jarak sama 120°. Memberikan kombinasi yang semarak namun tetap seimbang.',
      formula: 'Hue Dasar, +120°, +240°'
    },
    monochrome: {
      name: 'Monokromatik (Satu Warna Beda Nilai)',
      desc: 'Satu nilai Hue yang sama dengan variasi tingkat terang-gelap (Lightness) dan kemurnian (Saturation).',
      formula: 'Hue tetap, Lightness bervariasi'
    }
  };

  // Generate color palette based on baseHue and harmonyMode
  const getPalette = () => {
    const h = baseHue;
    const s = saturation;
    const l = lightness;

    if (harmonyMode === 'complementary') {
      const compHue = (h + 180) % 360;
      return [
        { name: 'Dominan 60%', hsl: `hsl(${h}, ${Math.max(10, s - 60)}%, 96%)`, hex: 'Kanvas Bersih', role: 'Latar Belakang' },
        { name: 'Struktur 30%', hsl: `hsl(${h}, ${s}%, ${l}%)`, hex: `H:${h}° S:${s}%`, role: 'Elemen Desain Utama' },
        { name: 'Aksen 10%', hsl: `hsl(${compHue}, ${s}%, ${Math.min(65, l + 10)}%)`, hex: `H:${compHue}° S:${s}%`, role: 'Pusat Perhatian (CTA)' }
      ];
    } else if (harmonyMode === 'analogous') {
      const h1 = (h - 30 + 360) % 360;
      const h2 = (h + 30) % 360;
      return [
        { name: 'Analog Kiri', hsl: `hsl(${h1}, ${s}%, ${l}%)`, hex: `H:${h1}°`, role: 'Warna Pendukung' },
        { name: 'Hue Utama', hsl: `hsl(${h}, ${s}%, ${l}%)`, hex: `H:${h}°`, role: 'Warna Primer' },
        { name: 'Analog Kanan', hsl: `hsl(${h2}, ${s}%, ${Math.min(70, l + 5)}%)`, hex: `H:${h2}°`, role: 'Aksen Halus' }
      ];
    } else if (harmonyMode === 'triadic') {
      const h1 = (h + 120) % 360;
      const h2 = (h + 240) % 360;
      return [
        { name: 'Triad 1', hsl: `hsl(${h}, ${s}%, ${l}%)`, hex: `H:${h}°`, role: 'Elemen Primer' },
        { name: 'Triad 2', hsl: `hsl(${h1}, ${s}%, ${l}%)`, hex: `H:${h1}°`, role: 'Elemen Sekunder' },
        { name: 'Triad 3', hsl: `hsl(${h2}, ${s}%, ${l}%)`, hex: `H:${h2}°`, role: 'Aksen Fokus' }
      ];
    } else {
      return [
        { name: 'Paling Terang', hsl: `hsl(${h}, ${s}%, 85%)`, hex: 'L: 85%', role: 'Highlight' },
        { name: 'Tengah (Base)', hsl: `hsl(${h}, ${s}%, ${l}%)`, hex: `L: ${l}%`, role: 'Inti Visual' },
        { name: 'Paling Gelap', hsl: `hsl(${h}, ${Math.min(100, s + 10)}%, 22%)`, hex: 'L: 22%', role: 'Bayangan & Teks' }
      ];
    }
  };

  const palette = getPalette();

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
      {/* Header */}
      <div className="p-4 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 bg-stone-50/70">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-stone-900 text-lg">Simulator Roda Warna & Kaidah 60-30-10</span>
            <span className="text-xs text-stone-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Interaktif</span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">Eksplorasi hubungan kromatik roda warna dan aplikasikan langsung ke mockup poster</p>
        </div>

        {/* Harmony Mode Toggles */}
        <div className="flex items-center gap-1 bg-stone-200/70 p-1 rounded-lg">
          {(['complementary', 'analogous', 'triadic', 'monochrome'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setHarmonyMode(mode)}
              className={`px-3 py-1 text-xs font-medium rounded transition-all capitalize ${
                harmonyMode === mode ? 'bg-white text-stone-900 shadow-xs font-semibold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Live Poster Mockup Preview */}
        <div className="lg:col-span-7 p-6 bg-stone-100/60 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-stone-200">
          <div className="text-xs font-medium text-stone-500 mb-2">Simulasi Poster Menggunakan Palet Terpilih</div>
          
          {/* Poster Card */}
          <div 
            className="w-full max-w-[340px] aspect-[3/4] rounded-lg border border-stone-300 shadow-sm p-6 flex flex-col justify-between transition-all duration-300 relative overflow-hidden"
            style={{ backgroundColor: palette[0]?.hsl || '#ffffff' }}
          >
            {/* Top Poster Header */}
            <div>
              <div className="flex items-center justify-between text-[10px] tracking-widest uppercase font-mono text-stone-600 border-b border-stone-300/60 pb-1 mb-4">
                <span>DKV EXHIBITION 2026</span>
                <span>VOL. 10</span>
              </div>
              <h4 
                className="text-3xl font-black font-heading leading-tight tracking-tight uppercase"
                style={{ color: palette[1]?.hsl || '#0f172a' }}
              >
                VISUAL RHYTHM & FORM
              </h4>
              <p className="text-xs text-stone-700 mt-2 font-medium">
                Pameran eksplorasi tipografi dan nirmana dwimatra siswa kelas 10 SMK Komunikasi Visual.
              </p>
            </div>

            {/* Geometric Motif in Poster */}
            <div className="relative py-4 flex items-center justify-center">
              <div 
                className="w-24 h-24 rounded-full transition-all duration-300 opacity-90"
                style={{ backgroundColor: palette[1]?.hsl }}
              />
              <div 
                className="w-16 h-16 rounded-lg -ml-8 -mt-6 transition-all duration-300 shadow-xs"
                style={{ backgroundColor: palette[2]?.hsl }}
              />
            </div>

            {/* Bottom CTA / Action Strip */}
            <div className="pt-3 border-t border-stone-300/60 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono uppercase text-stone-500">Lokasi & Tanggal</div>
                <div className="text-xs font-bold text-stone-900">Galeri Utama DKV · 02 Nov</div>
              </div>
              <button 
                className="px-3 py-1.5 text-xs font-bold text-white rounded transition-transform hover:scale-105 shadow-xs"
                style={{ backgroundColor: palette[2]?.hsl || '#0f172a' }}
              >
                Daftar Tiket
              </button>
            </div>
          </div>

          <div className="mt-3 text-[11px] text-stone-500 text-center">
            Penerapan proporsi: <span className="font-semibold text-stone-700">60% Kanvas</span> (Latar), <span className="font-semibold text-stone-700">30% Struktur</span> (Judul & Bentuk), <span className="font-semibold text-stone-700">10% Aksen</span> (Tombol & Shape)
          </div>
        </div>

        {/* Sliders & Color Wheel Controls */}
        <div className="lg:col-span-5 p-5 bg-white flex flex-col justify-between">
          <div className="space-y-5">
            <div>
              <div className="text-xs font-semibold text-stone-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-emerald-600" /> {harmonies[harmonyMode].name}
              </div>
              <p className="text-xs text-stone-500 leading-relaxed">
                {harmonies[harmonyMode].desc}
              </p>
            </div>

            {/* Hue Slider (Full Spectrum 0-360) */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-stone-700 font-medium">Sudut Roda Warna (Hue)</span>
                <span className="font-mono text-stone-600 font-bold">{baseHue}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="359"
                value={baseHue}
                onChange={(e) => setBaseHue(Number(e.target.value))}
                className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: 'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)'
                }}
              />
            </div>

            {/* Saturation */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-stone-700 font-medium">Kemurnian Warna (Saturation)</span>
                <span className="font-mono text-stone-600">{saturation}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={saturation}
                onChange={(e) => setSaturation(Number(e.target.value))}
                className="w-full accent-stone-900 h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Lightness */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-stone-700 font-medium">Terang-Gelap (Lightness)</span>
                <span className="font-mono text-stone-600">{lightness}%</span>
              </div>
              <input
                type="range"
                min="25"
                max="75"
                value={lightness}
                onChange={(e) => setLightness(Number(e.target.value))}
                className="w-full accent-stone-900 h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Swatch Breakdown */}
            <div className="pt-2">
              <span className="block text-xs font-semibold text-stone-700 mb-2">Sampel Palet Harmonis:</span>
              <div className="grid grid-cols-3 gap-2">
                {palette.map((swatch, idx) => (
                  <div key={idx} className="p-2 rounded-lg border border-stone-200 bg-stone-50 flex flex-col items-center">
                    <div 
                      className="w-full h-8 rounded mb-1.5 border border-stone-300 shadow-2xs"
                      style={{ backgroundColor: swatch.hsl }}
                    />
                    <span className="text-[11px] font-bold text-stone-800">{swatch.name}</span>
                    <span className="text-[10px] text-stone-500 font-mono text-center">{swatch.role}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick preset button */}
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
            <span className="text-stone-500 font-mono">Rumus: {harmonies[harmonyMode].formula}</span>
            <button
              onClick={() => {
                setBaseHue(Math.floor(Math.random() * 360));
              }}
              className="flex items-center gap-1 text-emerald-700 font-medium hover:underline"
            >
              <RefreshCw className="w-3 h-3" /> Acak Hue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
