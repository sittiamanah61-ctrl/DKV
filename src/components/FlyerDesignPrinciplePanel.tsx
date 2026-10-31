import React, { useState, useMemo, useRef } from 'react';
import { 
  SlidersHorizontal, 
  Scale, 
  Type, 
  Eye, 
  Maximize2, 
  Shapes, 
  Grid3X3, 
  Sparkles, 
  Compass, 
  Download, 
  Check, 
  AlertTriangle,
  Calendar,
  MapPin,
  Ticket,
  UserCheck,
  RotateCw
} from 'lucide-react';
import confetti from 'canvas-confetti';

export type BalanceType = 'asimetris' | 'simetris' | 'radial';
export type HierarchyType = 'ideal' | 'rata' | 'alur_baca';
export type ContrastType = 'asli' | 'rendah' | 'tinggi';
export type WhiteSpaceType = 'padat' | 'seimbang' | 'lapang';
export type NirmanaShapeType = 'swiss' | 'khatam8' | 'gelombang' | 'kinetik';

export interface GridGuides {
  kisi12: boolean;
  sepertiga: boolean;
  batasAman: boolean;
}

interface FlyerDesignPrinciplePanelProps {
  palette: Array<{ hex: string; lightness: number }>;
  onSelectPresetColors?: (hexes: string[]) => void;
}

// Relative luminance & WCAG contrast calculation
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
}

function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    const val = c / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(hex1: string, hex2: string): number {
  const c1 = hexToRgb(hex1);
  const c2 = hexToRgb(hex2);
  const l1 = getLuminance(c1.r, c1.g, c1.b);
  const l2 = getLuminance(c2.r, c2.g, c2.b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return Number(((lighter + 0.05) / (darker + 0.05)).toFixed(1));
}

export const FlyerDesignPrinciplePanel: React.FC<FlyerDesignPrinciplePanelProps> = ({
  palette,
  onSelectPresetColors
}) => {
  // Principle States matching user screenshot
  const [balance, setBalance] = useState<BalanceType>('asimetris');
  const [hierarchy, setHierarchy] = useState<HierarchyType>('ideal');
  const [contrastMode, setContrastMode] = useState<ContrastType>('asli');
  const [whiteSpace, setWhiteSpace] = useState<WhiteSpaceType>('seimbang');
  const [nirmanaShape, setNirmanaShape] = useState<NirmanaShapeType>('swiss');
  const [gridGuides, setGridGuides] = useState<GridGuides>({
    kisi12: false,
    sepertiga: false,
    batasAman: false
  });

  const [activePreset, setActivePreset] = useState<'muslimah' | 'swiss' | 'anti_pola' | null>(null);
  const flyerArtboardRef = useRef<HTMLDivElement | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Derive dynamic color roles from active 5-swatch palette
  // Default indices: [0]: Primary/Dark, [1]: Light/Background, [2]: Base/Amber, [3]: Soft accent, [4]: Deep accent
  const baseColors = useMemo(() => {
    const c0 = palette[0]?.hex || '#B72818';
    const c1 = palette[1]?.hex || '#FFEBE8';
    const c2 = palette[2]?.hex || '#E6AF00';
    const c3 = palette[3]?.hex || '#D7F7E8';
    const c4 = palette[4]?.hex || '#1A4FD8';

    if (contrastMode === 'rendah') {
      return {
        bg: '#F8F9FA',
        card: '#FFFFFF',
        title: '#C4C9D0',       // Intentionally faded text for anti-pattern demonstration
        body: '#D0D5DD',
        accent: '#E5E7EB',
        nirmana1: '#E2E8F0',
        nirmana2: '#F1F5F9'
      };
    }

    if (contrastMode === 'tinggi') {
      return {
        bg: '#0F172A',
        card: '#1E293B',
        title: '#FFFFFF',        // High contrast crisp white
        body: '#E2E8F0',
        accent: '#F59E0B',
        nirmana1: '#F59E0B',
        nirmana2: '#38BDF8'
      };
    }

    // Default 'asli' palette mode
    return {
      bg: c1,
      card: '#FFFFFF',
      title: c0,
      body: c4,
      accent: c2,
      nirmana1: c2,
      nirmana2: c3
    };
  }, [palette, contrastMode]);

  // Calculate live WCAG contrast ratio between artboard background and headline text
  const contrastRatio = useMemo(() => {
    return getContrastRatio(baseColors.bg, baseColors.title);
  }, [baseColors]);

  const wcagPassed = contrastRatio >= 4.5;

  // Preset Handlers
  const handlePresetMuslimah = () => {
    setActivePreset('muslimah');
    setBalance('simetris');
    setHierarchy('ideal');
    setContrastMode('tinggi');
    setWhiteSpace('seimbang');
    setNirmanaShape('khatam8');
    setGridGuides({ kisi12: false, sepertiga: false, batasAman: true });

    if (onSelectPresetColors) {
      // Islamic aesthetic palette: Emerald, Pale Mint, Golden Ochre, Cream, Deep Forest
      onSelectPresetColors(['#064E3B', '#F0FDF4', '#E6AF00', '#A7F3D0', '#047857']);
    }
    confetti({ particleCount: 20, spread: 45 });
  };

  const handlePresetSwissGrid = () => {
    setActivePreset('swiss');
    setBalance('asimetris');
    setHierarchy('alur_baca');
    setContrastMode('asli');
    setWhiteSpace('seimbang');
    setNirmanaShape('swiss');
    setGridGuides({ kisi12: true, sepertiga: true, batasAman: true });

    if (onSelectPresetColors) {
      // Classic Swiss typography palette: Deep Crimson, Warm Milk, Bright Amber, Soft Sky, Cobalt Blue
      onSelectPresetColors(['#B72818', '#FFEBE8', '#E6AF00', '#D7F7E8', '#1A4FD8']);
    }
    confetti({ particleCount: 20, spread: 45 });
  };

  const handlePresetAntiPola = () => {
    setActivePreset('anti_pola');
    setBalance('asimetris');
    setHierarchy('rata');
    setContrastMode('rendah');
    setWhiteSpace('padat');
    setNirmanaShape('kinetik');
    setGridGuides({ kisi12: false, sepertiga: false, batasAman: false });
  };

  // Diagnostic principle narrative based on current selection
  const diagnosticSummary = useMemo(() => {
    const balanceName = balance === 'asimetris' ? 'ASIMETRIS DINAMIS' : balance === 'simetris' ? 'SIMETRIS SEIMBANG' : 'RADIAL KUBAH';
    const hierarchyName = hierarchy === 'ideal' ? 'HIERARKI SKALA 2.8X' : hierarchy === 'rata' ? 'MONOTONIC RATA (ANTI-POLA)' : 'ALUR BACA 1–2–3–4';
    const contrastName = contrastMode === 'asli' ? 'KONTRAS ASLI' : contrastMode === 'rendah' ? '⚠️ GAGAL KONTRAS (<3:1)' : 'WCAG AAA TINGGI (>7:1)';

    let description = '';
    if (balance === 'asimetris' && hierarchy === 'ideal') {
      description = 'Prinsip Keseimbangan Asimetris memberikan kesan kontemporer dan dinamis, dipadukan dengan Swiss Grid untuk menjaga kerapian alur baca.';
    } else if (balance === 'simetris') {
      description = 'Keseimbangan Simetris formal memberikan wibawa stabil dan sakral, ideal untuk poster seremoni, ornamen kubah, dan tipografi sentral.';
    } else if (hierarchy === 'rata') {
      description = 'PERINGATAN PEDAGOGIS: Desain tanpa hierarki visual membuat audiens bingung membaca pesan pertama. Skala judul harus menonjol!';
    } else if (hierarchy === 'alur_baca') {
      description = 'Alur baca mata Z-Pattern terpandu jelas dari Judul (1) ke Visual Kunci (2), lalu Detail Jadwal (3), hingga Call-to-Action (4).';
    } else if (balance === 'radial') {
      description = 'Prinsip Radial memusatkan gravitasi visual ke pusat ornamen bintang geomteris, menyebarkan informasi melingkar secara elegan.';
    } else {
      description = 'Harmoni prinsip tata letak visual DKV Kurikulum Merdeka terintegrasi secara proporsional.';
    }

    return {
      titleTags: `${balanceName} • ${hierarchyName} • ${contrastName}`,
      description
    };
  }, [balance, hierarchy, contrastMode]);

  // Export Flyer Screenshot / Spec
  const handleExportFlyerSpec = () => {
    setIsExporting(true);
    const spec = `=== DRAFT SPESIFIKASI DESAIN FLYER DKV ===\nPrinsip Keseimbangan: ${balance}\nHierarki Tipografi: ${hierarchy}\nUji Kontras: ${contrastMode} (Rasio: ${contrastRatio}:1)\nWhite Space: ${whiteSpace}\nBentuk Nirmana: ${nirmanaShape}\nPalet Warna: ${palette.map(p => p.hex).join(', ')}\nGuru Pengampu: Ibu Sitti Saadah Al amanah, S.Kom\nTanggal: ${new Date().toLocaleDateString('id-ID')}`;
    
    navigator.clipboard.writeText(spec);
    confetti({ particleCount: 30, spread: 60 });
    alert(`Spesifikasi prinsip desain flyer berhasil disalin ke clipboard!\n\n${spec}`);
    setIsExporting(false);
  };

  return (
    <div className="space-y-6 mt-8">
      {/* 1. DARK INTERACTIVE PANEL (EXACTLY MATCHING USER SCREENSHOT) */}
      <div className="bg-[#0B132B] rounded-2xl border border-slate-800 p-5 md:p-6 text-white shadow-xl overflow-hidden relative">
        {/* Subtle background glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Panel Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <SlidersHorizontal className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm md:text-base font-black tracking-wide text-amber-400 uppercase font-mono">
              PANEL INTERAKTIF PRINSIP DESAIN GRAFIS FLYER
            </h3>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-medium mr-1">Preset Cepat:</span>
            
            {/* Preset 1: Muslimah Harmonis */}
            <button
              onClick={handlePresetMuslimah}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                activePreset === 'muslimah'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md font-bold'
                  : 'bg-emerald-950/60 text-emerald-300 border-emerald-600/40 hover:bg-emerald-900/80'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Muslimah Harmonis</span>
            </button>

            {/* Preset 2: Swiss Grid + Alur Baca */}
            <button
              onClick={handlePresetSwissGrid}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                activePreset === 'swiss'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-bold'
                  : 'bg-amber-950/60 text-amber-300 border-amber-600/40 hover:bg-amber-900/80'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Swiss Grid + Alur Baca</span>
            </button>

            {/* Preset 3: Uji Anti-Pola (Desain Buruk) */}
            <button
              onClick={handlePresetAntiPola}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                activePreset === 'anti_pola'
                  ? 'bg-rose-500 text-white border-rose-400 shadow-md font-bold'
                  : 'bg-rose-950/60 text-rose-300 border-rose-600/40 hover:bg-rose-900/80'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Uji Anti–Pola (Desain Buruk)</span>
            </button>
          </div>
        </div>

        {/* 6 Control Columns Grid matching the screenshot */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 my-5">
          {/* Column 1: Keseimbangan */}
          <div className="bg-[#131E3A] border border-slate-700/60 rounded-xl p-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200 mb-2.5">
                <Scale className="w-3.5 h-3.5 text-amber-400" />
                <span>Keseimbangan</span>
              </div>
              <div className="space-y-1.5">
                {[
                  { id: 'asimetris', label: 'Asimetris Dinamis' },
                  { id: 'simetris', label: 'Simetris Seimbang' },
                  { id: 'radial', label: 'Radial Kubah' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => { setBalance(opt.id as BalanceType); setActivePreset(null); }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                      balance === opt.id
                        ? 'bg-[#E6AF00] text-slate-950 font-bold shadow-xs'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Hierarki Teks */}
          <div className="bg-[#131E3A] border border-slate-700/60 rounded-xl p-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200 mb-2.5">
                <Type className="w-3.5 h-3.5 text-amber-400" />
                <span>Hierarki Teks</span>
              </div>
              <div className="space-y-1.5">
                {[
                  { id: 'ideal', label: 'Hierarki Ideal' },
                  { id: 'rata', label: 'Tanpa Hierarki (Rata)' },
                  { id: 'alur_baca', label: 'Alur Baca 1–2–3–4' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => { setHierarchy(opt.id as HierarchyType); setActivePreset(null); }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                      hierarchy === opt.id
                        ? 'bg-[#E6AF00] text-slate-950 font-bold shadow-xs'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Column 3: Uji Kontras */}
          <div className="bg-[#131E3A] border border-slate-700/60 rounded-xl p-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200 mb-2.5">
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                <span>Uji Kontras</span>
              </div>
              <div className="space-y-1.5">
                {[
                  { id: 'asli', label: 'Kontras Asli' },
                  { id: 'rendah', label: '⚠️ Rendah / Faded' },
                  { id: 'tinggi', label: 'Tinggi (WCAG AAA)' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => { setContrastMode(opt.id as ContrastType); setActivePreset(null); }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                      contrastMode === opt.id
                        ? 'bg-[#E6AF00] text-slate-950 font-bold shadow-xs'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Column 4: White Space */}
          <div className="bg-[#131E3A] border border-slate-700/60 rounded-xl p-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200 mb-2.5">
                <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                <span>White Space</span>
              </div>
              <div className="space-y-1.5">
                {[
                  { id: 'padat', label: 'Padat / Sesak' },
                  { id: 'seimbang', label: 'Seimbang (28px)' },
                  { id: 'lapang', label: 'Lapang / Lega' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => { setWhiteSpace(opt.id as WhiteSpaceType); setActivePreset(null); }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                      whiteSpace === opt.id
                        ? 'bg-[#E6AF00] text-slate-950 font-bold shadow-xs'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Column 5: Bentuk Nirmana */}
          <div className="bg-[#131E3A] border border-slate-700/60 rounded-xl p-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200 mb-2.5">
                <Shapes className="w-3.5 h-3.5 text-amber-400" />
                <span>Bentuk Nirmana</span>
              </div>
              <div className="space-y-1.5">
                {[
                  { id: 'swiss', label: 'Swiss Lingkaran–Kotak' },
                  { id: 'khatam8', label: 'Bintang Khatam 8' },
                  { id: 'gelombang', label: 'Irama Gelombang' },
                  { id: 'kinetik', label: 'Kinetik Berputar' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => { setNirmanaShape(opt.id as NirmanaShapeType); setActivePreset(null); }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                      nirmanaShape === opt.id
                        ? 'bg-[#E6AF00] text-slate-950 font-bold shadow-xs'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Column 6: Panduan Grid */}
          <div className="bg-[#131E3A] border border-slate-700/60 rounded-xl p-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200 mb-2.5">
                <Grid3X3 className="w-3.5 h-3.5 text-amber-400" />
                <span>Panduan Grid</span>
              </div>
              <div className="space-y-1.5">
                {[
                  { key: 'kisi12', label: 'Kisi 12–Kolom' },
                  { key: 'sepertiga', label: 'Aturan Sepertiga' },
                  { key: 'batasAman', label: 'Batas Aman 24px' }
                ].map(item => {
                  const isOn = gridGuides[item.key as keyof GridGuides];
                  return (
                    <button
                      key={item.key}
                      onClick={() => setGridGuides(prev => ({ ...prev, [item.key]: !isOn }))}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all group"
                    >
                      <span className="truncate pr-1">{item.label}</span>
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        isOn ? 'bg-amber-400 text-slate-950 shadow-2xs' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {isOn ? 'ON' : 'OFF'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Diagnostic & WCAG Ratio Bar */}
        <div className="bg-[#0B1120] border border-slate-800/90 rounded-xl p-3.5 px-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <Compass className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-amber-400 font-bold text-xs uppercase tracking-wider font-mono">
                  Diagnostik Prinsip Aktif:
                </span>
                <span className="text-slate-200 text-xs font-mono font-semibold">
                  {diagnosticSummary.titleTags}
                </span>
              </div>
              <p className="text-slate-400 text-[11px] mt-0.5 max-w-2xl leading-relaxed">
                {diagnosticSummary.description}
              </p>
            </div>
          </div>

          {/* Right: Calculated Contrast Ratio Badge */}
          <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
            <span className="text-slate-400 text-xs font-medium">
              Rasio Kontras Terhitung:
            </span>
            <div className={`px-3 py-1 rounded-lg border font-mono text-xs md:text-sm font-bold flex items-center gap-1.5 shadow-2xs ${
              wcagPassed
                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/50'
                : 'bg-rose-950/40 text-rose-400 border-rose-500/50'
            }`}>
              <span>{contrastRatio} : 1</span>
              <span>{wcagPassed ? '(LULUS WCAG)' : '(GAGAL WCAG)'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. LIVE INTERACTIVE FLYER / POSTER ARTBOARD */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <h4 className="text-base font-bold text-stone-900 font-heading">
                Pratinjau Nyata Desain Grafis Flyer Interaktif
              </h4>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Kanvas merespons langsung opsi Keseimbangan, Hierarki, Kontras, Ruang Negatif, dan Geometri Nirmana di atas.
            </p>
          </div>

          <button
            onClick={handleExportFlyerSpec}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-stone-900 text-white hover:bg-stone-800 rounded-lg transition-colors shadow-2xs self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Salin Spesifikasi Layout</span>
          </button>
        </div>

        {/* ARTBOARD CONTAINER */}
        <div className="flex justify-center bg-stone-100/70 p-4 md:p-8 rounded-xl border border-stone-200/80 overflow-x-auto">
          <div
            ref={flyerArtboardRef}
            className={`w-full max-w-[560px] aspect-[4/5] rounded-2xl shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
              whiteSpace === 'padat' ? 'p-4' : whiteSpace === 'lapang' ? 'p-10 md:p-12' : 'p-7 md:p-8'
            }`}
            style={{ 
              backgroundColor: baseColors.bg,
              color: baseColors.body
            }}
          >
            {/* GRID OVERLAYS */}
            {/* 1. 12-Column Grid Overlay */}
            {gridGuides.kisi12 && (
              <div className="absolute inset-0 pointer-events-none z-30 grid grid-cols-12 gap-2 px-6 py-6 opacity-30">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="h-full bg-rose-500/20 border-x border-rose-500/30 text-[8px] font-mono text-rose-700 flex items-start justify-center pt-1 font-bold">
                    {i + 1}
                  </div>
                ))}
              </div>
            )}

            {/* 2. Rule of Thirds Overlay */}
            {gridGuides.sepertiga && (
              <div className="absolute inset-0 pointer-events-none z-30 grid grid-cols-3 grid-rows-3 opacity-40">
                <div className="border-r border-b border-cyan-500 relative"><span className="absolute bottom-0 right-0 w-3 h-3 -mr-1.5 -mb-1.5 rounded-full border-2 border-cyan-600 bg-white" /></div>
                <div className="border-r border-b border-cyan-500 relative"><span className="absolute bottom-0 right-0 w-3 h-3 -mr-1.5 -mb-1.5 rounded-full border-2 border-cyan-600 bg-white" /></div>
                <div className="border-b border-cyan-500"></div>
                <div className="border-r border-b border-cyan-500 relative"><span className="absolute bottom-0 right-0 w-3 h-3 -mr-1.5 -mb-1.5 rounded-full border-2 border-cyan-600 bg-white" /></div>
                <div className="border-r border-b border-cyan-500 relative"><span className="absolute bottom-0 right-0 w-3 h-3 -mr-1.5 -mb-1.5 rounded-full border-2 border-cyan-600 bg-white" /></div>
                <div className="border-b border-cyan-500"></div>
                <div className="border-r border-cyan-500"></div>
                <div className="border-r border-cyan-500"></div>
                <div></div>
              </div>
            )}

            {/* 3. Safe Margin 24px Overlay */}
            {gridGuides.batasAman && (
              <div className="absolute inset-6 pointer-events-none z-30 border-2 border-dashed border-amber-500/60 rounded-xl">
                <span className="absolute top-1 left-2 text-[9px] font-mono text-amber-600 bg-amber-100/80 px-1 rounded font-bold">
                  Batas Aman Cetak (Safe Margin 24px)
                </span>
              </div>
            )}

            {/* FLYER TOP SECTION */}
            <div className={`relative z-10 transition-all ${
              balance === 'simetris' ? 'text-center items-center' : balance === 'radial' ? 'text-center' : 'text-left'
            }`}>
              {/* Category / Sub-header */}
              <div className={`flex items-center gap-2 mb-2 ${
                balance === 'simetris' || balance === 'radial' ? 'justify-center' : 'justify-start'
              }`}>
                {hierarchy === 'alur_baca' && (
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-mono font-bold flex items-center justify-center shadow-xs">
                    1
                  </span>
                )}
                <span 
                  className="text-[10px] md:text-xs font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded-md"
                  style={{ 
                    backgroundColor: `${baseColors.accent}25`,
                    color: baseColors.title
                  }}
                >
                  {activePreset === 'muslimah' ? 'SEMINAR KREATIF DKV MUSLIMAH' : 'SWISS GRAPHIC WORKSHOP · KELAS 10'}
                </span>
              </div>

              {/* Main Headline with Typography Hierarchy simulation */}
              <h1 
                className={`font-heading font-black tracking-tight leading-none transition-all duration-200 ${
                  hierarchy === 'ideal' 
                    ? 'text-3xl sm:text-4xl md:text-5xl uppercase' 
                    : hierarchy === 'rata' 
                      ? 'text-base font-medium normal-case' // Bad anti-pattern
                      : 'text-3xl md:text-4xl uppercase'
                }`}
                style={{ color: baseColors.title }}
              >
                {activePreset === 'muslimah' 
                  ? 'HARMONI ESTETIKA VISUAL & DESAIN' 
                  : 'RHYTHM, GRID & NIRMANA'}
              </h1>

              {/* Subheadline Body */}
              <p 
                className={`mt-2.5 max-w-md transition-all ${
                  balance === 'simetris' || balance === 'radial' ? 'mx-auto' : ''
                } ${
                  hierarchy === 'rata' ? 'text-base font-medium' : 'text-xs md:text-sm font-medium leading-relaxed opacity-90'
                }`}
                style={{ color: baseColors.body }}
              >
                {activePreset === 'muslimah'
                  ? 'Eksplorasi perpaduan ornamen geometris Islam (Khatam 8) dengan kaidah nirmana modern dan psikologi warna ramah mata.'
                  : 'Studi komprehensif prinsip desain grafis: hierarki visual, kontras warna WCAG, dan keseimbangan asimetris modern.'}
              </p>
            </div>

            {/* FLYER MIDDLE: NIRMANA SHAPE GEOMETRY */}
            <div className="relative z-10 my-auto py-4 flex items-center justify-center">
              {hierarchy === 'alur_baca' && (
                <div className="absolute top-2 left-4 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-mono font-bold flex items-center justify-center shadow-xs">
                    2
                  </span>
                  <span className="text-[10px] font-mono font-semibold" style={{ color: baseColors.title }}>
                    Focal Artboard
                  </span>
                </div>
              )}

              {/* Nirmana Shape 1: Swiss Lingkaran-Kotak */}
              {nirmanaShape === 'swiss' && (
                <div className="relative w-44 h-44 flex items-center justify-center">
                  <div 
                    className="w-32 h-32 rounded-3xl shadow-lg transition-transform hover:rotate-6"
                    style={{ backgroundColor: baseColors.nirmana1 }}
                  />
                  <div 
                    className="w-24 h-24 rounded-full shadow-md -ml-12 -mt-10 mix-blend-multiply opacity-90 transition-transform hover:scale-105"
                    style={{ backgroundColor: baseColors.nirmana2 }}
                  />
                  <div 
                    className="absolute w-12 h-12 rounded-lg border-2 border-white/80 shadow-xs"
                    style={{ backgroundColor: baseColors.accent }}
                  />
                </div>
              )}

              {/* Nirmana Shape 2: Bintang Khatam 8 (Rub el Hizb) */}
              {nirmanaShape === 'khatam8' && (
                <div className="relative w-44 h-44 flex items-center justify-center">
                  <div 
                    className="w-28 h-28 rounded-md shadow-md absolute transition-transform duration-700"
                    style={{ backgroundColor: baseColors.nirmana1 }}
                  />
                  <div 
                    className="w-28 h-28 rounded-md shadow-md absolute rotate-45 transition-transform duration-700"
                    style={{ backgroundColor: baseColors.nirmana2, opacity: 0.85 }}
                  />
                  <div 
                    className="w-14 h-14 rounded-full shadow-inner absolute border-2 border-white flex items-center justify-center"
                    style={{ backgroundColor: baseColors.accent }}
                  >
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                </div>
              )}

              {/* Nirmana Shape 3: Irama Gelombang */}
              {nirmanaShape === 'gelombang' && (
                <div className="w-52 h-36 flex items-center justify-center">
                  <svg viewBox="0 0 200 120" className="w-full h-full drop-shadow-md">
                    <path
                      d="M 10,60 C 40,10 70,110 100,60 C 130,10 160,110 190,60"
                      fill="none"
                      stroke={baseColors.nirmana1}
                      strokeWidth="12"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 10,80 C 40,30 70,130 100,80 C 130,30 160,130 190,80"
                      fill="none"
                      stroke={baseColors.nirmana2}
                      strokeWidth="6"
                      strokeLinecap="round"
                      opacity="0.8"
                    />
                  </svg>
                </div>
              )}

              {/* Nirmana Shape 4: Kinetik Berputar */}
              {nirmanaShape === 'kinetik' && (
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <div 
                    className="w-32 h-32 border-4 border-dashed rounded-full animate-[spin_12s_linear_infinite]"
                    style={{ borderColor: baseColors.nirmana1 }}
                  />
                  <div 
                    className="w-20 h-20 rounded-xl shadow-md rotate-12 transition-transform"
                    style={{ backgroundColor: baseColors.nirmana2 }}
                  />
                  <div 
                    className="w-10 h-10 rounded-full shadow-sm"
                    style={{ backgroundColor: baseColors.accent }}
                  />
                </div>
              )}
            </div>

            {/* FLYER BOTTOM: DETAILS & CALL TO ACTION */}
            <div className={`relative z-10 pt-4 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
              balance === 'simetris' || balance === 'radial' ? 'text-center sm:text-left' : ''
            }`}
            style={{ borderColor: `${baseColors.title}20` }}
            >
              {/* Event Metadata */}
              <div className="space-y-1">
                {hierarchy === 'alur_baca' && (
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-mono font-bold inline-flex items-center justify-center mr-1 shadow-xs">
                    3
                  </span>
                )}
                <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: baseColors.title }}>
                  <UserCheck className="w-3.5 h-3.5 text-amber-500" />
                  <span>Pengampu: Ibu Sitti Saadah Al amanah, S.Kom</span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono" style={{ color: baseColors.body }}>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Lab Komputer iMac 01
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> DKV SMK Negeri
                  </span>
                </div>
              </div>

              {/* Call to action button */}
              <div className="flex items-center gap-2">
                {hierarchy === 'alur_baca' && (
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-mono font-bold flex items-center justify-center shadow-xs">
                    4
                  </span>
                )}
                <button
                  className={`px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-transform hover:scale-105 flex items-center gap-1.5 ${
                    hierarchy === 'rata' ? 'text-xs py-1 px-2 font-normal' : ''
                  }`}
                  style={{ 
                    backgroundColor: baseColors.accent,
                    color: '#0F172A'
                  }}
                >
                  <Ticket className="w-3.5 h-3.5" />
                  <span>Registrasi Presensi</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
