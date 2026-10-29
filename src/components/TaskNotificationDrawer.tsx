import React from 'react';
import { TaskNotification } from '../types';
import { X, CheckCircle2, AlertCircle, Clock, Check, BellRing } from 'lucide-react';

interface TaskNotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: TaskNotification[];
  onToggleTaskStatus: (taskId: string) => void;
}

export const TaskNotificationDrawer: React.FC<TaskNotificationDrawerProps> = ({
  isOpen,
  onClose,
  tasks,
  onToggleTaskStatus
}) => {
  if (!isOpen) return null;

  const pendingCount = tasks.filter(t => t.status !== 'Selesai').length;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-stone-200 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-stone-900 text-white flex items-center justify-center">
              <BellRing className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-stone-900 text-base">Notifikasi Tugas Harian</h3>
              <p className="text-[11px] text-stone-500">Sistem Pengingat Otomatis Siswa DKV</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Task List */}
        <div className="p-4 space-y-3 overflow-y-auto flex-1">
          {pendingCount > 0 ? (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Ada <strong>{pendingCount} tugas</strong> yang membutuhkan perhatian Anda agar portofolio tetap terorganisir!
              </span>
            </div>
          ) : (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Luar biasa! Seluruh tugas DKV minggu ini telah tuntas diselesaikan.</span>
            </div>
          )}

          <div className="space-y-3 pt-2">
            {tasks.map(task => {
              const isDone = task.status === 'Selesai';
              return (
                <div
                  key={task.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isDone
                      ? 'border-stone-200 bg-stone-50/60 opacity-70'
                      : 'border-stone-200 bg-white shadow-2xs hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onToggleTaskStatus(task.id)}
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                          isDone
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-stone-300 hover:border-stone-500 bg-white'
                        }`}
                      >
                        {isDone && <Check className="w-3.5 h-3.5" />}
                      </button>
                      <span className={`text-xs font-bold ${isDone ? 'line-through text-stone-400' : 'text-stone-900'}`}>
                        {task.title}
                      </span>
                    </div>

                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded uppercase font-semibold ${
                      task.priority === 'Tinggi'
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'bg-stone-100 text-stone-600'
                    }`}>
                      {task.priority}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 pl-7 leading-relaxed mb-2.5">
                    {task.description}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-stone-400 pl-7 pt-1 border-t border-stone-100">
                    <div className="flex items-center gap-1.5 text-amber-700 font-medium">
                      <Clock className="w-3 h-3" />
                      <span>{task.dueDate}</span>
                    </div>
                    <span className="font-mono text-stone-500">{task.points} Poin XP</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50/70 flex items-center justify-between">
          <div className="text-xs text-stone-500">
            {pendingCount} Tugas Belum Selesai
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-white bg-stone-900 rounded-lg hover:bg-stone-800"
          >
            Tutup Panel
          </button>
        </div>
      </div>
    </div>
  );
};
