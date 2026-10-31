import React, { useState, useEffect, useRef } from 'react';
import { 
  Pipette, 
  Image as ImageIcon, 
  Disc, 
  Share2, 
  Download, 
  Copy, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Sliders, 
  Eye, 
  Lock, 
  Unlock,
  Upload,
  RefreshCw,
  Sparkles,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FlyerDesignPrinciplePanel } from './FlyerDesignPrinciplePanel.tsx';

interface ColorNode {
  id: number;
  hue: number;        // 0 - 360
  saturation: number; // 0 - 100%
  lightness: number;  // 0 - 100%
  hex: string;
  isBase?: boolean;
  isLocked?: boolean;
}

export type HarmonyMode = 
  | 'custom'
  | 'analogous'
  | 'monochromatic'
  | 'triad'
  | 'complementary'
  | 'split'
  | 'square'
  | 'compound'
  | 'shades';

// Utility functions for robust color conversion
function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
}

function getContrastColor(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  // Perceived luminance formula (ITU-R BT.709)
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 140 ? '#0f172a' : '#ffffff';
}

export const InteractiveColorWheel: React.FC = () => {
  const [topTab, setTopTab] = useState<'wheel' | 'image' | 'base'>('wheel');
  const [paletteName, setPaletteName] = useState<string>('My Color Theme');
  const [harmonyMode, setHarmonyMode] = useState<HarmonyMode>('custom');
  const [activeNodeIdx, setActiveNodeIdx] = useState<number>(2); // Swatch 3 is default Base color
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [showPosterPreview, setShowPosterPreview] = useState<boolean>(false);
  const [isCopiedAll, setIsCopiedAll] = useState<boolean>(false);

  // Default 5 swatches matching user's uploaded image exactly!
  // #B72818 (Red), #FFEBE8 (Pale Blush), #E6AF00 (Gold/Base), #D7F7E8 (Mint), #1A4FD8 (Blue)
  const [colors, setColors] = useState<ColorNode[]>([
    { id: 0, hue: 6, saturation: 77, lightness: 41, hex: '#B72818', isBase: false },
    { id: 1, hue: 7, saturation: 100, lightness: 95, hex: '#FFEBE8', isBase: false },
    { id: 2, hue: 45, saturation: 100, lightness: 45, hex: '#E6AF00', isBase: true },
    { id: 3, hue: 151, saturation: 63, lightness: 91, hex: '#D7F7E8', isBase: false },
    { id: 4, hue: 224, saturation: 84, lightness: 48, hex: '#1A4FD8', isBase: false }
  ]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDraggingRef = useRef<number | null>(null);
  const imageUploadRef = useRef<HTMLInputElement | null>(null);

  // Wheel Geometry constants
  const CANVAS_SIZE = 300;
  const CENTER = CANVAS_SIZE / 2;
  const RADIUS = 125;

  // Render the circular chromatic color wheel
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw chromatic circular spectrum
    // 360 radial pie slices from center with white gradient in middle
    for (let angle = 0; angle < 360; angle += 1) {
      const startRad = ((angle - 0.7) * Math.PI) / 180;
      const endRad = ((angle + 0.7) * Math.PI) / 180;

      const grad = ctx.createRadialGradient(CENTER, CENTER, 0, CENTER, CENTER, RADIUS);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.35, `hsl(${angle}, 60%, 75%)`);
      grad.addColorStop(1, `hsl(${angle}, 100%, 50%)`);

      ctx.beginPath();
      ctx.moveTo(CENTER, CENTER);
      ctx.arc(CENTER, CENTER, RADIUS, startRad, endRad);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();
    }

    // Outer subtle boundary ring
    ctx.beginPath();
    ctx.arc(CENTER, CENTER, RADIUS, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0,0,0,0.06)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Draw connecting geometry lines between nodes (like in screenshot)
    if (colors.length > 1) {
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);

      ctx.beginPath();
      colors.forEach((c, idx) => {
        const rad = (c.hue * Math.PI) / 180;
        const dist = (c.saturation / 100) * RADIUS;
        const x = CENTER + dist * Math.cos(rad);
        const y = CENTER + dist * Math.sin(rad);

        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.restore();
    }
  }, [colors]);

  // Recalculate harmonies when harmony mode or base color changes
  const applyHarmonyRule = (baseHue: number, mode: HarmonyMode) => {
    if (mode === 'custom') return;

    setColors(prev => {
      const baseNode = prev.find(n => n.isBase) || prev[2];
      const baseSat = baseNode.saturation;
      const baseLight = baseNode.lightness;

      let newColors = [...prev];

      if (mode === 'analogous') {
        const offsets = [-40, -20, 0, 20, 40];
        newColors = prev.map((node, i) => {
          const h = (baseHue + offsets[i] + 360) % 360;
          return {
            ...node,
            hue: h,
            saturation: baseSat,
            lightness: i === 2 ? baseLight : i % 2 === 0 ? Math.min(85, baseLight + 20) : Math.max(25, baseLight - 15),
            hex: hslToHex(h, baseSat, i === 2 ? baseLight : i % 2 === 0 ? Math.min(85, baseLight + 20) : Math.max(25, baseLight - 15))
          };
        });
      } else if (mode === 'monochromatic') {
        const lights = [25, 45, baseLight, 70, 90];
        newColors = prev.map((node, i) => ({
          ...node,
          hue: baseHue,
          saturation: Math.max(20, baseSat - i * 8),
          lightness: lights[i],
          hex: hslToHex(baseHue, Math.max(20, baseSat - i * 8), lights[i])
        }));
      } else if (mode === 'triad') {
        const hues = [baseHue, (baseHue + 120) % 360, (baseHue + 240) % 360, (baseHue + 120) % 360, (baseHue + 240) % 360];
        const lights = [35, baseLight, 45, 88, 92];
        newColors = prev.map((node, i) => ({
          ...node,
          hue: hues[i],
          saturation: baseSat,
          lightness: lights[i],
          hex: hslToHex(hues[i], baseSat, lights[i])
        }));
      } else if (mode === 'complementary') {
        const compHue = (baseHue + 180) % 360;
        const hues = [baseHue, baseHue, baseHue, compHue, compHue];
        const lights = [30, 85, baseLight, 45, 90];
        newColors = prev.map((node, i) => ({
          ...node,
          hue: hues[i],
          saturation: baseSat,
          lightness: lights[i],
          hex: hslToHex(hues[i], baseSat, lights[i])
        }));
      } else if (mode === 'split') {
        const h1 = (baseHue + 150) % 360;
        const h2 = (baseHue + 210) % 360;
        const hues = [baseHue, baseHue, baseHue, h1, h2];
        const lights = [35, 88, baseLight, 48, 55];
        newColors = prev.map((node, i) => ({
          ...node,
          hue: hues[i],
          saturation: baseSat,
          lightness: lights[i],
          hex: hslToHex(hues[i], baseSat, lights[i])
        }));
      } else if (mode === 'square') {
        const hues = [baseHue, (baseHue + 90) % 360, baseHue, (baseHue + 180) % 360, (baseHue + 270) % 360];
        newColors = prev.map((node, i) => ({
          ...node,
          hue: hues[i],
          saturation: baseSat,
          lightness: i === 2 ? baseLight : 45 + (i * 8),
          hex: hslToHex(hues[i], baseSat, i === 2 ? baseLight : 45 + (i * 8))
        }));
      } else if (mode === 'compound') {
        const hues = [baseHue, (baseHue + 30) % 360, baseHue, (baseHue + 180) % 360, (baseHue + 210) % 360];
        newColors = prev.map((node, i) => ({
          ...node,
          hue: hues[i],
          saturation: baseSat,
          lightness: i === 2 ? baseLight : 50,
          hex: hslToHex(hues[i], baseSat, i === 2 ? baseLight : 50)
        }));
      } else if (mode === 'shades') {
        const sats = [baseSat, baseSat, baseSat, Math.max(15, baseSat - 30), Math.max(10, baseSat - 50)];
        const lights = [20, 35, baseLight, 65, 85];
        newColors = prev.map((node, i) => ({
          ...node,
          hue: baseHue,
          saturation: sats[i],
          lightness: lights[i],
          hex: hslToHex(baseHue, sats[i], lights[i])
        }));
      }

      return newColors;
    });
  };

  // Dragging interaction on Color Wheel
  const handlePointerDown = (nodeIdx: number, e: React.PointerEvent) => {
    e.stopPropagation();
    isDraggingRef.current = nodeIdx;
    setActiveNodeIdx(nodeIdx);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleWheelPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDraggingRef.current === null) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - CENTER;
    const y = e.clientY - rect.top - CENTER;

    // Convert cartesian (x, y) to polar (angle, dist)
    let rad = Math.atan2(y, x);
    let deg = Math.round((rad * 180) / Math.PI);
    if (deg < 0) deg += 360;

    const dist = Math.min(RADIUS, Math.hypot(x, y));
    const sat = Math.round((dist / RADIUS) * 100);

    const targetIdx = isDraggingRef.current;

    setColors(prev => {
      const updated = [...prev];
      const currentNode = updated[targetIdx];
      const newHex = hslToHex(deg, sat, currentNode.lightness);

      updated[targetIdx] = {
        ...currentNode,
        hue: deg,
        saturation: sat,
        hex: newHex
      };

      // If moving the base color and in a harmony rule, adapt others
      if (currentNode.isBase && harmonyMode !== 'custom') {
        setTimeout(() => applyHarmonyRule(deg, harmonyMode), 0);
      }

      return updated;
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = null;
  };

  // Set a specific swatch as the Base Color
  const setAsBaseColor = (index: number) => {
    setColors(prev => prev.map((node, i) => ({
      ...node,
      isBase: i === index
    })));
    setActiveNodeIdx(index);
    if (harmonyMode !== 'custom') {
      applyHarmonyRule(colors[index].hue, harmonyMode);
    }
  };

  // Copy single hex code
  const handleCopyHex = (hex: string, idx: number) => {
    navigator.clipboard.writeText(hex);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  // Copy all hex codes
  const handleCopyAll = () => {
    const list = colors.map(c => c.hex).join(', ');
    navigator.clipboard.writeText(list);
    setIsCopiedAll(true);
    setTimeout(() => setIsCopiedAll(false), 2000);
  };

  // Export palette as CSS variables or PNG
  const handleExportPalette = () => {
    const cssVars = `:root {\n  /* ${paletteName} */\n${colors.map((c, i) => `  --color-${i + 1}: ${c.hex};`).join('\n')}\n}`;
    navigator.clipboard.writeText(cssVars);
    confetti({ particleCount: 30, spread: 60 });
    alert(`Palet "${paletteName}" berhasil disalin dalam format CSS Variables!\n\n${cssVars}`);
  };

  // Image Palette Extraction
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        extractColorsFromImage(img);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const extractColorsFromImage = (img: HTMLImageElement) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 60;
    canvas.height = 60;
    ctx.drawImage(img, 0, 0, 60, 60);
    const data = ctx.getImageData(0, 0, 60, 60).data;

    // Sample 5 distinct points across the image
    const sampleCoords = [
      [10, 10], [50, 10], [30, 30], [15, 45], [45, 50]
    ];

    const extractedHexes: string[] = sampleCoords.map(([x, y]) => {
      const idx = (y * 60 + x) * 4;
      const r = data[idx].toString(16).padStart(2, '0');
      const g = data[idx + 1].toString(16).padStart(2, '0');
      const b = data[idx + 2].toString(16).padStart(2, '0');
      return `#${r}${g}${b}`.toUpperCase();
    });

    setColors(prev => prev.map((node, i) => {
      const rgb = hexToRgb(extractedHexes[i]);
      // Calculate approximate hue from RGB
      const max = Math.max(rgb.r, rgb.g, rgb.b);
      const min = Math.min(rgb.r, rgb.g, rgb.b);
      let h = 0;
      if (max !== min) {
        const d = max - min;
        if (max === rgb.r) h = (rgb.g - rgb.b) / d + (rgb.g < rgb.b ? 6 : 0);
        else if (max === rgb.g) h = (rgb.b - rgb.r) / d + 2;
        else h = (rgb.r - rgb.g) / d + 4;
        h *= 60;
      }
      return {
        ...node,
        hex: extractedHexes[i],
        hue: Math.round(h),
        saturation: 75,
        lightness: 50
      };
    }));
    setHarmonyMode('custom');
    setPaletteName('Palette dari Gambar Siswa');
    confetti({ particleCount: 25, spread: 50 });
  };

  const handleSelectPresetColors = (hexes: string[]) => {
    setColors(prev => prev.map((node, i) => {
      if (!hexes[i]) return node;
      const rgb = hexToRgb(hexes[i]);
      const max = Math.max(rgb.r, rgb.g, rgb.b);
      const min = Math.min(rgb.r, rgb.g, rgb.b);
      let h = 0;
      if (max !== min) {
        const d = max - min;
        if (max === rgb.r) h = (rgb.g - rgb.b) / d + (rgb.g < rgb.b ? 6 : 0);
        else if (max === rgb.g) h = (rgb.b - rgb.r) / d + 2;
        else h = (rgb.r - rgb.g) / d + 4;
        h *= 60;
      }
      return {
        ...node,
        hex: hexes[i],
        hue: Math.round((h + 360) % 360)
      };
    }));
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
      {/* Top Header Mode Tabs matching screenshot */}
      <div className="px-6 py-3 border-b border-stone-200 flex items-center justify-between bg-white">
        <div className="flex items-center gap-8 text-sm font-medium">
          <button
            onClick={() => setTopTab('base')}
            className={`flex items-center gap-2 pb-2 -mb-3 transition-colors ${
              topTab === 'base' ? 'text-stone-900 border-b-2 border-stone-900 font-bold' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Pipette className="w-4 h-4" />
            <span>Base color</span>
          </button>

          <button
            onClick={() => setTopTab('image')}
            className={`flex items-center gap-2 pb-2 -mb-3 transition-colors ${
              topTab === 'image' ? 'text-stone-900 border-b-2 border-stone-900 font-bold' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Image</span>
          </button>

          <button
            onClick={() => setTopTab('wheel')}
            className={`flex items-center gap-2 pb-2 -mb-3 transition-colors ${
              topTab === 'wheel' ? 'text-stone-900 border-b-2 border-stone-900 font-bold' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Disc className="w-4 h-4" />
            <span>Color wheel</span>
          </button>
        </div>

        {/* Quick Toggle for Live Poster Preview */}
        <button
          onClick={() => setShowPosterPreview(!showPosterPreview)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
            showPosterPreview ? 'bg-stone-900 text-white border-stone-900' : 'bg-stone-100 text-stone-700 border-stone-200'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Pratinjau Mockup Poster</span>
        </button>
      </div>

      {/* Main Adobe Color Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
        {/* Left Side: Color Wheel & Harmony Buttons (Col 5) */}
        <div className="lg:col-span-5 p-6 flex flex-col justify-between items-center border-b lg:border-b-0 lg:border-r border-stone-200 bg-white">
          {/* Wheel Stage */}
          {topTab === 'wheel' && (
            <div 
              className="relative w-[300px] h-[300px] flex items-center justify-center select-none cursor-crosshair touch-none"
              onPointerMove={handleWheelPointerMove}
              onPointerUp={handlePointerUp}
            >
              <canvas
                ref={canvasRef}
                width={CANVAS_SIZE}
                height={CANVAS_SIZE}
                className="w-full h-full rounded-full shadow-inner pointer-events-none"
              />

              {/* 5 Draggable Color Nodes / Rings */}
              {colors.map((c, idx) => {
                const rad = (c.hue * Math.PI) / 180;
                const dist = (c.saturation / 100) * RADIUS;
                const x = CENTER + dist * Math.cos(rad);
                const y = CENTER + dist * Math.sin(rad);

                const isBase = c.isBase;
                const isActive = activeNodeIdx === idx;

                return (
                  <div
                    key={c.id}
                    onPointerDown={(e) => handlePointerDown(idx, e)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing transition-transform hover:scale-110"
                    style={{ left: `${x}px`, top: `${y}px` }}
                  >
                    {/* Ring Handle */}
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                        isBase
                          ? 'ring-3 ring-amber-400 shadow-md border-2 border-white'
                          : 'border-2 border-white shadow-sm ring-1 ring-black/20'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    >
                      {isBase && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Mode: Image Extraction */}
          {topTab === 'image' && (
            <div className="w-full max-w-sm py-8 px-4 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center mx-auto border border-stone-200">
                <Upload className="w-6 h-6" />
              </div>
              <h4 className="font-heading font-bold text-stone-900 text-base">Ekstrak Palet dari Gambar</h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                Unggah karya nirmana atau poster Anda untuk menganalisis dan mengekstrak 5 warna dominan secara otomatis ke dalam roda warna.
              </p>
              <input
                ref={imageUploadRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                onClick={() => imageUploadRef.current?.click()}
                className="px-4 py-2 text-xs font-bold text-white bg-stone-900 rounded-lg hover:bg-stone-800 transition-colors shadow-xs"
              >
                Pilih File Gambar
              </button>
            </div>
          )}

          {/* Mode: Base Color Picker */}
          {topTab === 'base' && (
            <div className="w-full max-w-sm py-8 px-4 space-y-4">
              <h4 className="font-heading font-bold text-stone-900 text-base">Atur Warna Dasar (Base Color)</h4>
              <p className="text-xs text-stone-500">
                Pilih swatch yang menjadi jangkar utama palet, lalu pilih rumus harmoni untuk menghasilkan warna pendukung secara otomatis.
              </p>
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-stone-900">{colors[activeNodeIdx]?.hex}</div>
                  <div className="text-[11px] text-stone-500">Hue: {colors[activeNodeIdx]?.hue}° · Sat: {colors[activeNodeIdx]?.saturation}%</div>
                </div>
                <input
                  type="color"
                  value={colors[activeNodeIdx]?.hex}
                  onChange={(e) => {
                    const newHex = e.target.value.toUpperCase();
                    setColors(prev => prev.map((node, i) => i === activeNodeIdx ? { ...node, hex: newHex } : node));
                  }}
                  className="w-10 h-10 rounded cursor-pointer border border-stone-300"
                />
              </div>
            </div>
          )}

          {/* Color Harmonies Selector Bar matching screenshot */}
          <div className="w-full mt-4 pt-3 border-t border-stone-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-stone-800">
                Color harmonies: <span className="font-normal capitalize text-stone-600">{harmonyMode}</span>
              </span>
            </div>

            {/* Harmony Icon Buttons Grid */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {[
                { id: 'custom', label: 'Custom', icon: '•••' },
                { id: 'analogous', label: 'Analogous', icon: '◷' },
                { id: 'monochromatic', label: 'Monochrome', icon: '◐' },
                { id: 'triad', label: 'Triad', icon: '△' },
                { id: 'complementary', label: 'Complementary', icon: '⧉' },
                { id: 'split', label: 'Split Comp', icon: '◬' },
                { id: 'square', label: 'Square', icon: '□' },
                { id: 'shades', label: 'Shades', icon: '▤' }
              ].map(h => (
                <button
                  key={h.id}
                  onClick={() => {
                    setHarmonyMode(h.id as HarmonyMode);
                    applyHarmonyRule(colors[activeNodeIdx]?.hue || 45, h.id as HarmonyMode);
                  }}
                  className={`w-9 h-9 rounded-lg border flex flex-col items-center justify-center transition-all shrink-0 text-xs ${
                    harmonyMode === h.id
                      ? 'border-stone-900 bg-stone-900 text-white shadow-xs font-bold'
                      : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                  }`}
                  title={h.label}
                >
                  <span className="text-sm leading-none">{h.icon}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: 5 Full Vertical Color Swatch Columns (Col 7) */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          {/* Swatches Horizontal Split (5 equal columns) */}
          <div className="grid grid-cols-5 flex-1 min-h-[360px]">
            {colors.map((c, idx) => {
              const contrastText = getContrastColor(c.hex);
              const isBase = c.isBase;
              const isCopied = copiedIdx === idx;

              return (
                <div
                  key={c.id}
                  className="relative p-3 flex flex-col justify-between transition-colors duration-200 group"
                  style={{ backgroundColor: c.hex }}
                >
                  {/* Top Pin/Base indicator */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setAsBaseColor(idx)}
                      className={`p-1 rounded-md transition-opacity ${
                        isBase ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}
                      style={{ color: contrastText }}
                      title={isBase ? 'Warna Dasar (Base Color)' : 'Jadikan Warna Dasar'}
                    >
                      <Pipette className="w-3.5 h-3.5" />
                    </button>
                    {isBase && (
                      <span 
                        className="text-[9px] font-mono uppercase tracking-wider font-bold px-1 rounded bg-black/20"
                        style={{ color: contrastText }}
                      >
                        Base
                      </span>
                    )}
                  </div>

                  {/* Bottom Hex Code & Copy Affordance */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span 
                        className="font-mono text-xs font-bold tracking-wider select-all"
                        style={{ color: contrastText }}
                      >
                        {c.hex}
                      </span>
                      <button
                        onClick={() => handleCopyHex(c.hex, idx)}
                        className="p-1 rounded hover:bg-black/10 transition-colors"
                        style={{ color: contrastText }}
                        title="Salin Kode HEX"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {/* Subtle Brightness slider in swatch on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <input
                        type="range"
                        min="15"
                        max="95"
                        value={c.lightness}
                        onChange={(e) => {
                          const l = Number(e.target.value);
                          setColors(prev => prev.map((node, i) => i === idx ? {
                            ...node,
                            lightness: l,
                            hex: hslToHex(node.hue, node.saturation, l)
                          } : node));
                        }}
                        className="w-full h-1 bg-black/20 rounded appearance-none cursor-pointer"
                        title="Sesuaikan Terang/Gelap (Lightness)"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Action Strip matching Adobe Color screenshot */}
          <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4">
            {/* Left: Mini Swatch Preview */}
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-28 rounded-md overflow-hidden border border-stone-300 shadow-2xs">
                {colors.map((c, i) => (
                  <div key={i} className="flex-1 h-full" style={{ backgroundColor: c.hex }} />
                ))}
              </div>
              <span className="text-xs text-stone-500 font-mono">5 Swatch</span>
            </div>

            {/* Right: Actions & Palette Name Input */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-stone-600">
                <button
                  onClick={handleCopyAll}
                  className="p-2 hover:bg-stone-200 rounded-lg transition-colors text-stone-700"
                  title="Salin Semua Kode HEX"
                >
                  {isCopiedAll ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleExportPalette}
                  className="p-2 hover:bg-stone-200 rounded-lg transition-colors text-stone-700"
                  title="Ekspor sebagai CSS Variables"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>

              {/* Palette Name Box */}
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-stone-300 text-xs">
                <span className="text-[11px] text-stone-400 font-medium">Palette name</span>
                <input
                  type="text"
                  value={paletteName}
                  onChange={(e) => setPaletteName(e.target.value)}
                  className="font-bold text-stone-900 bg-transparent border-none focus:outline-none w-32"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* OPTIONAL LIVE POSTER & DKV MOCKUP PREVIEW */}
      {showPosterPreview && (
        <div className="p-6 bg-stone-100 border-t border-stone-200">
          <div className="max-w-4xl mx-auto">
            <div className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-4 flex items-center justify-between">
              <span>Penerapan Otomatis Palet Pada Mockup Desain Komunikasi Visual</span>
              <span className="font-mono text-stone-500">{paletteName}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Poster 1: Swiss Typography Exhibition */}
              <div
                className="aspect-[3/4] rounded-xl p-8 flex flex-col justify-between shadow-md border border-black/10 transition-colors"
                style={{ backgroundColor: colors[1].hex }}
              >
                <div>
                  <div 
                    className="text-[11px] font-mono tracking-widest uppercase border-b pb-1 mb-4"
                    style={{ color: colors[0].hex, borderColor: `${colors[0].hex}33` }}
                  >
                    DKV EXHIBITION 2026 · SWISS GRID
                  </div>
                  <h3 
                    className="text-4xl font-heading font-black tracking-tight uppercase leading-none"
                    style={{ color: colors[0].hex }}
                  >
                    RHYTHM & CHROMATICS
                  </h3>
                  <p 
                    className="text-xs mt-3 max-w-xs font-medium"
                    style={{ color: colors[4].hex }}
                  >
                    Studi harmoni warna komplementer dan gubahan nirmana dwimatra siswa kelas 10 SMK DKV.
                  </p>
                </div>

                <div className="flex items-center justify-center py-6">
                  <div 
                    className="w-24 h-24 rounded-full shadow-lg"
                    style={{ backgroundColor: colors[2].hex }}
                  />
                  <div 
                    className="w-16 h-16 rounded-lg -ml-8 -mt-6 shadow-md"
                    style={{ backgroundColor: colors[3].hex }}
                  />
                </div>

                <div className="pt-4 border-t flex items-center justify-between" style={{ borderColor: `${colors[0].hex}33` }}>
                  <div>
                    <div className="text-[10px] font-mono uppercase" style={{ color: colors[0].hex }}>Studio DKV</div>
                    <div className="text-xs font-bold" style={{ color: colors[4].hex }}>Galeri Seni Visual</div>
                  </div>
                  <button 
                    className="px-4 py-2 text-xs font-bold rounded-lg shadow-xs"
                    style={{ 
                      backgroundColor: colors[2].hex, 
                      color: getContrastColor(colors[2].hex) 
                    }}
                  >
                    Tiket Pameran
                  </button>
                </div>
              </div>

              {/* Poster 2: Visual Brand Identity Mockup */}
              <div 
                className="aspect-[3/4] rounded-xl p-8 flex flex-col justify-between shadow-md border border-black/10 transition-colors"
                style={{ backgroundColor: colors[0].hex }}
              >
                <div>
                  <div 
                    className="text-[11px] font-mono tracking-widest uppercase mb-4"
                    style={{ color: colors[3].hex }}
                  >
                    BRAND IDENTITY SYSTEM
                  </div>
                  <h3 
                    className="text-3xl font-heading font-black tracking-tight"
                    style={{ color: colors[1].hex }}
                  >
                    QUEENTHINGS MEDIA CREATIVE
                  </h3>
                  <div className="mt-4 flex gap-2">
                    {colors.map((c, i) => (
                      <div key={i} className="w-6 h-6 rounded-md shadow-xs border border-white/20" style={{ backgroundColor: c.hex }} />
                    ))}
                  </div>
                </div>

                <div className="p-5 rounded-xl border border-white/10" style={{ backgroundColor: `${colors[4].hex}22` }}>
                  <div className="text-xs font-bold" style={{ color: colors[1].hex }}>
                    Kaidah Distribusi 60-30-10:
                  </div>
                  <p className="text-[11px] mt-1" style={{ color: colors[3].hex }}>
                    Warna primer ({colors[0].hex}) membentuk 60% kanvas dasar, warna pendukung ({colors[2].hex}) memberikan 30% struktur, dan aksen ({colors[4].hex}) memandu 10% fokus mata pemirsa.
                  </p>
                </div>

                <div className="text-[11px] font-mono" style={{ color: colors[3].hex }}>
                  SMK Negeri Kompetensi Keahlian DKV · 2026/2027
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>

      {/* PANEL INTERAKTIF PRINSIP DESAIN GRAFIS FLYER (Requested by user) */}
      <FlyerDesignPrinciplePanel 
        palette={colors}
        onSelectPresetColors={handleSelectPresetColors}
      />
    </div>
  );
};
