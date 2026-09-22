import { useState, useEffect, useRef } from 'react';
import type { KAKData } from './types/kak';
import { defaultKAKData, emptyKAKData } from './data/initialData';
import { FORM_STEPS } from './data/steps';
import {
  loadSavedDraft,
  saveDraft,
  clearDraft,
  exportDataToJson,
  importDataFromJson,
} from './lib/storage';
import { generatePdf, downloadKAKPdf } from './lib/pdf/generatePdf';

// Components
import { Navbar } from './components/Layout/Navbar';
import { ProgressSidebar } from './components/Stepper/ProgressSidebar';
import { StepContainer } from './components/FormSteps/StepContainer';
import { FooterNav } from './components/Layout/FooterNav';
import { PdfViewer } from './components/Preview/PdfViewer';
import { ResetModal } from './components/Modals/ResetModal';
import { DraftPromptModal } from './components/Modals/DraftPromptModal';

export function App() {
  const [data, setData] = useState<KAKData>(defaultKAKData);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Modals state
  const [isResetModalOpen, setIsResetModalOpen] = useState<boolean>(false);
  const [isDraftPromptOpen, setIsDraftPromptOpen] = useState<boolean>(false);
  const [draftTimestamp, setDraftTimestamp] = useState<string | null>(null);
  const pendingDraftData = useRef<KAKData | null>(null);

  // Check for saved draft on initial load
  useEffect(() => {
    const saved = loadSavedDraft();
    if (saved.hasDraft) {
      pendingDraftData.current = saved.data;
      setDraftTimestamp(saved.timestamp);
      setIsDraftPromptOpen(true);
    }
  }, []);

  // Autosave whenever data changes (debounced 600ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      saveDraft(data);
      setLastSaved(new Date());
    }, 600);
    return () => clearTimeout(timer);
  }, [data]);

  // Field change handlers
  const handleChange = (field: keyof KAKData, value: any) => {
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleBulkChange = (patch: Partial<KAKData>) => {
    setData((prev) => ({
      ...prev,
      ...patch,
    }));
  };

  // Modal actions
  const handleRestoreDraft = () => {
    if (pendingDraftData.current) {
      setData(pendingDraftData.current);
    }
    setIsDraftPromptOpen(false);
  };

  const handleDiscardDraft = () => {
    clearDraft();
    setData(emptyKAKData);
    setIsDraftPromptOpen(false);
  };

  const handleConfirmResetEmpty = () => {
    clearDraft();
    setData(emptyKAKData);
    setCurrentStep(1);
  };

  const handleConfirmLoadSample = () => {
    setData(defaultKAKData);
    saveDraft(defaultKAKData);
    setIsDraftPromptOpen(false);
  };

  // Import / Export
  const handleExportJson = () => {
    exportDataToJson(data);
  };

  const handleImportJson = async (file: File) => {
    try {
      const imported = await importDataFromJson(file);
      setData(imported);
      saveDraft(imported);
      alert('Data KAK berhasil diimpor dari file JSON!');
    } catch (err: any) {
      alert(`Gagal mengimpor file: ${err.message || err}`);
    }
  };

  // Download PDF
  const handleDownloadPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      const pdfBytes = await generatePdf(data);
      const fileName = `KAK-${data.tahun_anggaran || '2026'}-${(data.asisten_deputi || 'KemenkoPMK').replace(/\s+/g, '_')}.pdf`;
      downloadKAKPdf(pdfBytes, fileName);
    } catch (err: any) {
      console.error('Download PDF error:', err);
      alert('Gagal membuat dokumen PDF: ' + (err?.message || 'Error tidak diketahui'));
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Navigation handlers
  const handleNext = () => {
    if (currentStep < FORM_STEPS.length) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setActiveTab('preview');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onReset={() => setIsResetModalOpen(true)}
        onLoadSample={handleConfirmLoadSample}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
        onDownloadPdf={handleDownloadPdf}
        isGeneratingPdf={isGeneratingPdf}
        lastSaved={lastSaved}
      />

      {/* Main Content Area */}
      {activeTab === 'form' ? (
        <div className="flex-1 flex flex-col lg:flex-row">
          {/* Progress & Steps Sidebar */}
          <ProgressSidebar
            currentStep={currentStep}
            onSelectStep={(stepId) => {
              setCurrentStep(stepId);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            data={data}
          />

          {/* Form Step Content + Footer */}
          <main className="flex-1 flex flex-col justify-between min-w-0">
            <StepContainer
              currentStep={currentStep}
              data={data}
              onChange={handleChange}
              onBulkChange={handleBulkChange}
            />

            <FooterNav
              currentStep={currentStep}
              totalSteps={FORM_STEPS.length}
              onPrev={handlePrev}
              onNext={handleNext}
              onOpenPreview={() => setActiveTab('preview')}
            />
          </main>
        </div>
      ) : (
        /* PDF Live Preview Tab */
        <main className="flex-1">
          <PdfViewer data={data} />
        </main>
      )}

      {/* Reset Confirmation Modal */}
      <ResetModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirmResetEmpty={handleConfirmResetEmpty}
        onConfirmLoadSample={handleConfirmLoadSample}
      />

      {/* Restore Draft Modal on Startup */}
      <DraftPromptModal
        isOpen={isDraftPromptOpen}
        draftTimestamp={draftTimestamp}
        onRestore={handleRestoreDraft}
        onDiscard={handleDiscardDraft}
        onLoadSample={handleConfirmLoadSample}
      />
    </div>
  );
}

export default App;
