import React from 'react';
import { FileText, RotateCcw, ArrowRight, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  draftTimestamp: string | null;
  onRestore: () => void;
  onDiscard: () => void;
  onLoadSample: () => void;
}

export const DraftPromptModal: React.FC<Props> = ({
  isOpen,
  draftTimestamp,
  onRestore,
  onDiscard,
  onLoadSample,
}) => {
  if (!isOpen) return null;

  const formattedTime = draftTimestamp
    ? new Date(draftTimestamp).toLocaleString('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : 'Sebelumnya';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 sm:p-7 relative">
        <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4">
          <FileText className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-1">
          Ditemukan Draf KAK Tersimpan
        </h3>
        <p className="text-xs text-slate-600 mb-6 leading-relaxed">
          Sistem mendeteksi ada draf isian Kerangka Acuan Kegiatan (KAK) yang tersimpan secara lokal dari sesi terakhir ({formattedTime}). Apakah Anda ingin melanjutkan draf tersebut?
        </p>

        <div className="space-y-2.5">
          <button
            onClick={onRestore}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition active:scale-[0.98]"
          >
            <span>Lanjutkan Draf Tersimpan</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onLoadSample}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 font-semibold text-xs transition"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Gunakan Contoh Data Kemenko PMK</span>
          </button>

          <button
            onClick={onDiscard}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-rose-600 hover:bg-rose-50 rounded-xl font-medium text-xs transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Mulai dari Formulir Kosong</span>
          </button>
        </div>
      </div>
    </div>
  );
};
