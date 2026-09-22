import React from 'react';
import { AlertTriangle, X, RotateCcw, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirmResetEmpty: () => void;
  onConfirmLoadSample: () => void;
}

export const ResetModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onConfirmResetEmpty,
  onConfirmLoadSample,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 className="text-base font-bold text-slate-900 mb-2">
          Reset Formulir KAK?
        </h3>
        <p className="text-xs text-slate-600 mb-6 leading-relaxed">
          Tindakan ini akan menghapus data yang sedang Anda isi. Anda dapat memilih untuk mengosongkan seluruh form atau memuat ulang data contoh resmi Kemenko PMK.
        </p>

        <div className="space-y-2">
          <button
            onClick={() => {
              onConfirmResetEmpty();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 text-rose-700 bg-rose-50/50 hover:bg-rose-100 font-semibold text-xs transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Kosongkan Seluruh Formulir</span>
          </button>

          <button
            onClick={() => {
              onConfirmLoadSample();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-indigo-200 text-indigo-700 bg-indigo-50/50 hover:bg-indigo-100 font-semibold text-xs transition"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Muat Ulang Contoh Data Kemenko PMK</span>
          </button>

          <button
            onClick={onClose}
            className="w-full px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium text-xs transition"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
};
