import React from 'react';
import { ArrowLeft, ArrowRight, Eye } from 'lucide-react';
import { FORM_STEPS } from '../../data/steps';

interface Props {
  currentStep: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
  onOpenPreview: () => void;
}

export const FooterNav: React.FC<Props> = ({
  currentStep,
  totalSteps,
  onPrev,
  onNext,
  onOpenPreview,
}) => {
  const currentDef = FORM_STEPS.find((s) => s.id === currentStep);
  const isFirst = currentStep === 1;
  const isLast = currentStep === totalSteps;

  return (
    <footer className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Back Button */}
      <button
        onClick={onPrev}
        disabled={isFirst}
        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-200 transition disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Sebelumnya</span>
      </button>

      {/* Middle info */}
      <div className="text-center truncate hidden md:block">
        <span className="text-xs text-slate-400 font-medium">
          Langkah {currentStep} dari {totalSteps}:{' '}
        </span>
        <span className="text-xs font-bold text-slate-800">
          {currentDef?.title}
        </span>
      </div>

      {/* Right Buttons: Quick Preview + Next */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenPreview}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition"
        >
          <Eye className="w-4 h-4" />
          <span className="hidden sm:inline">Pratinjau PDF</span>
        </button>

        <button
          onClick={onNext}
          className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition active:scale-[0.98]"
        >
          <span>{isLast ? 'Selesai & Lihat PDF' : 'Selanjutnya'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </footer>
  );
};
