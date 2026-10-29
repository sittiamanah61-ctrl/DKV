import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Shuffle, Sparkles, Sliders, Download, Eye } from 'lucide-react';

export const InteractiveNirmana: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [patternType, setPatternType] = useState<'waves' | 'moire' | 'geometric' | 'dots'>('waves');
  const [lineDensity, setLineDensity] = useState<number>(24);
  const [frequency, setFrequency] = useState<number>(3);
  const [amplitude, setAmplitude] = useState<number>(35);
  const [speed, setSpeed] = useState<number>(1.5);
  const [strokeWidth, setStrokeWidth] = useState<number>(2);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [colorMode, setColorMode] = useState<'mono' | 'emerald' | 'amber' | 'invert'>('mono');
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: 250, y: 200 });

  const animFrameId = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Background styling
      if (colorMode === 'invert') {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, width, height);
      } else {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);

        // Subtle sketch grid on canvas
        ctx.strokeStyle = 'rgba(226, 232, 240, 0.6)';
        ctx.lineWidth = 1;
        const step = 20;
        for (let x = 0; x < width; x += step) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y < height; y += step) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      }

      // Stroke Color
      let strokeColor = '#0f172a';
      if (colorMode === 'invert') strokeColor = '#f8fafc';
      if (colorMode === 'emerald') strokeColor = '#059669';
      if (colorMode === 'amber') strokeColor = '#ea580c';

      ctx.strokeStyle = strokeColor;
      ctx.fillStyle = strokeColor;
      ctx.lineWidth = strokeWidth;

      const t = timeRef.current;
      const mx = cursorPos.x;
      const my = cursorPos.y;

      if (patternType === 'waves') {
        // Kinetic wave lines
        const count = lineDensity;
        const spacing = height / (count + 1);

        for (let i = 1; i <= count; i++) {
          const baseY = i * spacing;
          ctx.beginPath();
          for (let x = 0; x <= width; x += 4) {
            // Distance from mouse creates organic ripple disturbance
            const dist = Math.hypot(x - mx, baseY - my);
            const mouseInfluence = Math.max(0, (180 - dist) / 180) * 25;
            const y = baseY + 
              Math.sin((x * frequency * 0.015) + (t * speed) + (i * 0.25)) * amplitude +
              Math.sin((x * 0.03) - (t * 0.8)) * mouseInfluence;
            
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      } else if (patternType === 'moire') {
        // Concentric rings & Moire optical pattern
        const cx = mx;
        const cy = my;
        const rings = lineDensity;
        const maxRadius = Math.max(width, height) * 0.8;

        for (let r = 8; r < maxRadius; r += (maxRadius / rings)) {
          const wobble = Math.sin((r * 0.05) + t * speed) * (amplitude * 0.2);
          ctx.beginPath();
          ctx.arc(cx, cy, Math.max(2, r + wobble), 0, Math.PI * 2);
          ctx.stroke();
        }

        // Secondary static center for optical interference moire
        const fixedCx = width * 0.5;
        const fixedCy = height * 0.5;
        ctx.save();
        ctx.strokeStyle = colorMode === 'invert' ? 'rgba(255,255,255,0.35)' : 'rgba(15,23,42,0.35)';
        for (let r = 12; r < maxRadius; r += (maxRadius / rings) * 1.08) {
          ctx.beginPath();
          ctx.arc(fixedCx, fixedCy, r, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      } else if (patternType === 'geometric') {
        // Rotational geometric shapes & rhythm
        const cx = width / 2;
        const cy = height / 2;
        const count = lineDensity;
        const step = Math.min(width, height) / (count * 2);

        for (let i = 1; i <= count; i++) {
          const size = i * step * 1.8;
          const angle = (t * speed * 0.2) + (i * (frequency * 0.08));
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(angle);
          ctx.beginPath();
          ctx.strokeRect(-size / 2, -size / 2, size, size);
          ctx.restore();
        }
      } else if (patternType === 'dots') {
        // Dot matrix stippling density & optical gradient
        const cols = lineDensity;
        const rows = Math.round(lineDensity * (height / width));
        const cellW = width / cols;
        const cellH = height / rows;

        for (let c = 0; c < cols; c++) {
          for (let r = 0; r < rows; r++) {
            const x = c * cellW + cellW / 2;
            const y = r * cellH + cellH / 2;
            const dist = Math.hypot(x - mx, y - my);
            const factor = Math.max(0.1, 1 - (dist / (width * 0.6)));
            const radius = Math.max(1, factor * (strokeWidth * 3) + Math.sin(t * speed + c * 0.2) * 1.5);

            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      if (isPlaying) {
        timeRef.current += 0.03;
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [patternType, lineDensity, frequency, amplitude, speed, strokeWidth, isPlaying, colorMode, cursorPos]);

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = 540 / rect.width;
    const scaleY = 400 / rect.height;
    setCursorPos({
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    });
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `nirmana_dwimatra_${patternType}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const handleRandomize = () => {
    setLineDensity(Math.floor(Math.random() * 20) + 16);
    setFrequency(Math.floor(Math.random() * 5) + 2);
    setAmplitude(Math.floor(Math.random() * 40) + 15);
    setStrokeWidth(Math.floor(Math.random() * 3) + 1.5);
  };

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
      {/* Top Bar */}
      <div className="p-4 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 bg-stone-50/70">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-stone-900 text-lg">Nirmana Dwimatra Kinetic Generator</span>
            <span className="text-xs text-stone-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Interaktif</span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">Gerakkan kursor/sentuh kanvas untuk merasakan dinamika irama garis & ilusi optik</p>
        </div>

        {/* Pattern Mode Buttons */}
        <div className="flex items-center gap-1 bg-stone-200/70 p-1 rounded-lg">
          <button
            onClick={() => setPatternType('waves')}
            className={`px-3 py-1 text-xs font-medium rounded transition-all ${
              patternType === 'waves' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Irama Gelombang
          </button>
          <button
            onClick={() => setPatternType('moire')}
            className={`px-3 py-1 text-xs font-medium rounded transition-all ${
              patternType === 'moire' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Konsentris Moire
          </button>
          <button
            onClick={() => setPatternType('geometric')}
            className={`px-3 py-1 text-xs font-medium rounded transition-all ${
              patternType === 'geometric' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Rotasi Geometris
          </button>
          <button
            onClick={() => setPatternType('dots')}
            className={`px-3 py-1 text-xs font-medium rounded transition-all ${
              patternType === 'dots' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Titik Stippling
          </button>
        </div>
      </div>

      {/* Main Two-Zone Sandbox Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Canvas Stage */}
        <div className="lg:col-span-8 p-4 bg-stone-100/50 flex flex-col items-center justify-center relative min-h-[380px]">
          <div className="relative rounded-lg shadow-sm overflow-hidden border border-stone-300">
            <canvas
              ref={canvasRef}
              width={540}
              height={380}
              onPointerMove={handlePointerMove}
              className="w-full max-w-[540px] h-[360px] cursor-crosshair touch-none block"
            />
            {/* Visual Vector Handles on Border */}
            <div className="vector-handle -top-1 -left-1" />
            <div className="vector-handle -top-1 -right-1" />
            <div className="vector-handle -bottom-1 -left-1" />
            <div className="vector-handle -bottom-1 -right-1" />
          </div>

          {/* Quick Floating Playback Bar */}
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Jeda Animasi' : 'Putar Animasi'}</span>
            </button>
            <button
              onClick={handleRandomize}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white text-stone-700 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Acak Pola</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white text-stone-700 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Simpan Karya PNG</span>
            </button>
          </div>
        </div>

        {/* Controls Deck */}
        <div className="lg:col-span-4 p-5 border-t lg:border-t-0 lg:border-l border-stone-200 bg-white flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <span className="text-xs font-semibold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-stone-500" /> Parameter Modul
              </span>
              <span className="text-xs text-stone-400">KD 3.2 Kurikulum Merdeka</span>
            </div>

            {/* Density Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-stone-700 font-medium">Kerapatan Modul / Garis</span>
                <span className="font-mono text-stone-500">{lineDensity} unit</span>
              </div>
              <input
                type="range"
                min="8"
                max="48"
                value={lineDensity}
                onChange={(e) => setLineDensity(Number(e.target.value))}
                className="w-full accent-emerald-600 h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Frequency Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-stone-700 font-medium">Frekuensi Irama Gelombang</span>
                <span className="font-mono text-stone-500">{frequency}x</span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                value={frequency}
                onChange={(e) => setFrequency(Number(e.target.value))}
                className="w-full accent-emerald-600 h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Amplitude Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-stone-700 font-medium">Amplitudo Kedalaman (Lengkung)</span>
                <span className="font-mono text-stone-500">{amplitude} px</span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                value={amplitude}
                onChange={(e) => setAmplitude(Number(e.target.value))}
                className="w-full accent-emerald-600 h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Stroke Width Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-stone-700 font-medium">Ketebalan Goresan (Drawing Pen)</span>
                <span className="font-mono text-stone-500">{strokeWidth} px</span>
              </div>
              <input
                type="range"
                min="1"
                max="6"
                step="0.5"
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(Number(e.target.value))}
                className="w-full accent-emerald-600 h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Color Palette Choice */}
            <div>
              <span className="block text-xs font-medium text-stone-700 mb-2">Pilihan Tinta Visual</span>
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => setColorMode('mono')}
                  className={`p-1.5 text-xs text-center rounded border transition-all ${
                    colorMode === 'mono' ? 'border-stone-900 bg-stone-900 text-white font-medium' : 'border-stone-200 bg-stone-50 text-stone-700'
                  }`}
                >
                  Hitam Tinta
                </button>
                <button
                  onClick={() => setColorMode('emerald')}
                  className={`p-1.5 text-xs text-center rounded border transition-all ${
                    colorMode === 'emerald' ? 'border-emerald-600 bg-emerald-600 text-white font-medium' : 'border-stone-200 bg-stone-50 text-stone-700'
                  }`}
                >
                  Zamrud
                </button>
                <button
                  onClick={() => setColorMode('amber')}
                  className={`p-1.5 text-xs text-center rounded border transition-all ${
                    colorMode === 'amber' ? 'border-amber-600 bg-amber-600 text-white font-medium' : 'border-stone-200 bg-stone-50 text-stone-700'
                  }`}
                >
                  Oranye
                </button>
                <button
                  onClick={() => setColorMode('invert')}
                  className={`p-1.5 text-xs text-center rounded border transition-all ${
                    colorMode === 'invert' ? 'border-slate-800 bg-slate-900 text-white font-medium' : 'border-stone-200 bg-stone-50 text-stone-700'
                  }`}
                >
                  Invert Gelap
                </button>
              </div>
            </div>
          </div>

          {/* Educational Concept Callout */}
          <div className="mt-4 p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs text-stone-600 space-y-1">
            <div className="font-semibold text-stone-800 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-emerald-600" />
              <span>Prinsip Nirmana: Irama & Kedalaman</span>
            </div>
            <p className="leading-relaxed">
              Perubahan jarak antar garis dari rapat menuju renggang menciptakan persepsi ruang 3 dimensi semu (optical depth) dan ilusi gerak ritmis pada retina mata pemirsa.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
