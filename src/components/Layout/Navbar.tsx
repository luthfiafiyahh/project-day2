import React, { useRef } from 'react';
import {
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  FileCheck,
  Eye,
  Edit3,
  Loader2,
  Sparkles,
  FileText,
} from 'lucide-react';

interface Props {
  activeTab: 'form' | 'preview';
  setActiveTab: (tab: 'form' | 'preview') => void;
  onReset: () => void;
  onLoadSample: () => void;
  onExportJson: () => void;
  onImportJson: (file: File) => void;
  onDownloadPdf: () => void;
  isGeneratingPdf: boolean;
  onDownloadDocx: () => void;
  isGeneratingDocx: boolean;
  lastSaved: Date | null;
}

export const Navbar: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  onReset,
  onLoadSample,
  onExportJson,
  onImportJson,
  onDownloadPdf,
  isGeneratingPdf,
  onDownloadDocx,
  isGeneratingDocx,
  lastSaved,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportJson(file);
      e.target.value = '';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-900 to-indigo-700 flex items-center justify-center text-white shadow-xs shrink-0">
              <FileCheck className="w-5 h-5 text-amber-300" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900 tracking-tight leading-tight truncate">
                  Sistem Digitalisasi KAK
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 uppercase tracking-wide">
                  13 Halaman Resmi
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium truncate hidden md:block">
                Kementerian Koordinator Bidang Pembangunan Manusia dan Kebudayaan
              </p>
            </div>
          </div>

          {/* Center Tabs: Form vs Preview */}
          <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200 shrink-0">
            <button
              onClick={() => setActiveTab('form')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'form'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Formulir KAK</span>
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'preview'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Pratinjau PDF</span>
            </button>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Autosave badge */}
            <div className="hidden xl:flex items-center gap-1.5 text-[11px] text-slate-500 mr-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>
                {lastSaved
                  ? `Tersimpan ${lastSaved.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`
                  : 'Tersimpan otomatis'}
              </span>
            </div>

            {/* Quick Actions Dropdown / Group */}
            <div className="hidden sm:flex items-center gap-1">
              <button
                onClick={onLoadSample}
                title="Muat Data Contoh Kemenko PMK"
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden lg:inline">Contoh Data</span>
              </button>

              <button
                onClick={onExportJson}
                title="Cadangkan data ke file JSON"
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 transition"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden lg:inline">Ekspor</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                title="Pulihkan data dari file JSON"
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 transition"
              >
                <Upload className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden lg:inline">Impor</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                className="hidden"
                onChange={handleFileChange}
              />

              <button
                onClick={onReset}
                title="Reset seluruh isian form"
                className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Download Word (DOCX) Button */}
            <button
              onClick={onDownloadDocx}
              disabled={isGeneratingDocx}
              title="Unduh dokumen KAK dalam format Microsoft Word (.docx)"
              className="flex items-center gap-2 px-3.5 py-2 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs font-bold rounded-xl shadow-xs transition active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isGeneratingDocx ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-sky-600" />
                  <span className="hidden sm:inline">Menyiapkan Word...</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 text-sky-600" />
                  <span className="hidden sm:inline">Unduh Word</span>
                </>
              )}
            </button>

            {/* Download PDF Primary Button */}
            <button
              onClick={onDownloadPdf}
              disabled={isGeneratingPdf}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-700 to-indigo-800 hover:from-indigo-800 hover:to-indigo-900 text-white text-xs font-bold rounded-xl shadow-sm transition active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyiapkan PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-amber-300" />
                  <span>Unduh PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
