import React from 'react';
import { FORM_STEPS, type StepDefinition } from '../../data/steps';
import type { KAKData } from '../../types/kak';
import { Check, ChevronRight } from 'lucide-react';

interface Props {
  currentStep: number;
  onSelectStep: (stepId: number) => void;
  data: KAKData;
}

export const ProgressSidebar: React.FC<Props> = ({
  currentStep,
  onSelectStep,
  data,
}) => {
  // Check if a step has all its required fields filled
  const isStepComplete = (step: StepDefinition): boolean => {
    if (step.requiredFields.length === 0) return true;
    return step.requiredFields.every((fieldKey) => {
      const val = (data as any)[fieldKey];
      return typeof val === 'string' && val.trim().length > 0;
    });
  };

  const completedCount = FORM_STEPS.filter(isStepComplete).length;
  const progressPercent = Math.round((completedCount / FORM_STEPS.length) * 100);

  return (
    <aside className="w-full lg:w-80 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 p-4 lg:p-5 flex flex-col shrink-0 lg:h-[calc(100vh-4rem)] lg:overflow-y-auto custom-scrollbar">
      {/* Overall Progress Indicator */}
      <div className="mb-5 pb-4 border-b border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-700">Progres Dokumen</span>
          <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
            {completedCount} / {FORM_STEPS.length} Langkah ({progressPercent}%)
          </span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-600 to-emerald-500 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Steps List */}
      <nav className="space-y-1">
        {FORM_STEPS.map((step) => {
          const isActive = currentStep === step.id;
          const complete = isStepComplete(step);

          return (
            <button
              key={step.id}
              onClick={() => onSelectStep(step.id)}
              className={`w-full text-left p-2.5 rounded-xl text-xs font-medium flex items-center gap-3 transition-all ${
                isActive
                  ? 'bg-indigo-50 text-indigo-900 font-semibold border border-indigo-200/80 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {/* Step indicator circle */}
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0 transition-colors ${
                  complete
                    ? 'bg-emerald-100 text-emerald-700'
                    : isActive
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {complete ? (
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                ) : (
                  <span>{step.id}</span>
                )}
              </div>

              {/* Title and Category */}
              <div className="flex-1 min-w-0">
                <div className="truncate leading-tight">
                  {step.shortTitle}
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">
                  {step.category}
                </div>
              </div>

              {/* Active arrow */}
              {isActive && (
                <ChevronRight className="w-4 h-4 text-indigo-600 shrink-0" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick notice at bottom */}
      <div className="mt-auto pt-4 border-t border-slate-100 text-[11px] text-slate-400">
        Template Kemenko PMK (13 Halaman) • Sesuai format resmi
      </div>
    </aside>
  );
};
