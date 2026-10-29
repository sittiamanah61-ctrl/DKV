import React, { useState } from 'react';
import { INITIAL_SCHEDULES } from '../data/dkvData';
import { PracticeSchedule } from '../types';
import { Calendar, Clock, MapPin, User, CheckCircle2, AlertTriangle, Monitor, Sparkles } from 'lucide-react';

export const ScheduleSection: React.FC = () => {
  const [schedules, setSchedules] = useState<PracticeSchedule[]>(INITIAL_SCHEDULES);
  const [bookedIds, setBookedIds] = useState<string[]>(['sch-1']);

  const toggleBooking = (id: string) => {
    if (bookedIds.includes(id)) {
      setBookedIds(prev => prev.filter(i => i !== id));
      setSchedules(prev => prev.map(s => s.id === id ? { ...s, currentBooked: Math.max(0, s.currentBooked - 1) } : s));
    } else {
      setBookedIds(prev => [...prev, id]);
      setSchedules(prev => prev.map(s => s.id === id ? { ...s, currentBooked: s.currentBooked + 1 } : s));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-heading font-bold text-stone-900 text-xl">Jadwal Praktik Studio & Lab DKV</h3>
            <span className="text-xs text-stone-600 bg-stone-100 px-2.5 py-0.5 rounded border border-stone-200">
              Semester Gasal 2026/2027
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Studio Gambar Manual Nirmana · Lab Komputer iMac Vektor · Studio Fotografi & Pencahayaan
          </p>
        </div>

        {/* Quick next practice countdown callout */}
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs text-emerald-900">
          <Clock className="w-4 h-4 text-emerald-600" />
          <span>Sesi Praktik Terdekat: <strong>Senin, 02 Nov (07.30 WIB)</strong></span>
        </div>
      </div>

      {/* Schedule Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {schedules.map(item => {
          const isUserBooked = bookedIds.includes(item.id);
          const isFull = item.currentBooked >= item.maxCapacity;

          return (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-stone-200 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Day & Date Tag */}
                <div className="flex items-center justify-between text-xs mb-3 pb-2 border-b border-stone-100">
                  <span className="font-bold text-stone-900 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-stone-500" />
                    {item.day}, {item.date}
                  </span>
                  <span className="font-mono text-stone-500">{item.time}</span>
                </div>

                <h4 className="font-heading font-bold text-stone-900 text-base leading-snug">
                  {item.subject}
                </h4>

                <div className="mt-3 space-y-1.5 text-xs text-stone-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{item.room}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>Instruktur: {item.instructor}</span>
                  </div>
                </div>

                {/* Equipment required */}
                <div className="mt-4 p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs">
                  <span className="font-semibold text-stone-800 block mb-1.5">Alat yang Wajib Dibawa Siswa:</span>
                  <div className="flex flex-wrap gap-1">
                    {item.toolsNeeded.map((tool, idx) => (
                      <span key={idx} className="bg-white border border-stone-200 px-2 py-0.5 rounded text-[11px] text-stone-700">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom booking & capacity strip */}
              <div className="mt-5 pt-3 border-t border-stone-100">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-stone-500">Kapasitas Kursi / Meja:</span>
                  <span className="font-mono font-bold text-stone-900">
                    {item.currentBooked} / {item.maxCapacity} Meja
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden mb-3">
                  <div
                    className={`h-full rounded-full ${isFull ? 'bg-amber-500' : 'bg-emerald-600'}`}
                    style={{ width: `${(item.currentBooked / item.maxCapacity) * 100}%` }}
                  />
                </div>

                <button
                  onClick={() => toggleBooking(item.id)}
                  disabled={isFull && !isUserBooked}
                  className={`w-full py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    isUserBooked
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                      : isFull
                      ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                      : 'bg-stone-900 text-white hover:bg-stone-800 shadow-2xs'
                  }`}
                >
                  {isUserBooked ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Kehadiran Anda Terkonfirmasi</span>
                    </>
                  ) : (
                    <span>Konfirmasi Hadir Praktik</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
