import React, { useState, useEffect } from 'react';
import type { KAKData } from '../../types/kak';
import { generatePdf, downloadKAKPdf } from '../../lib/pdf/generatePdf';
import {
  Download,
  RefreshCw,
  FileCheck,
  ExternalLink,
  Loader2,
  AlertCircle,
} from 'lucide-react';

interface Props {
  data: KAKData;
}

const PAGE_LABELS = [
  { page: 1, label: 'Hal 1: Sampul KAK' },
  { page: 2, label: 'Hal 2: 1. Identitas & 2. Tusi' },
  { page: 3, label: 'Hal 3: RPJMN & RKP' },
  { page: 4, label: 'Hal 4: Indikator Kinerja RPJMN' },
  { page: 5, label: 'Hal 5: 3. Gap Analysis / Rencana Aksi' },
  { page: 6, label: 'Hal 6: 4. Rincian Output & Indikator RB' },
  { page: 7, label: 'Hal 7: Penerima Manfaat & Strategi' },
  { page: 8, label: 'Hal 8: Rincian Tahap 1 & Tahap 2' },
  { page: 9, label: 'Hal 9: Rincian Tahap 3 & Tahap 4' },
  { page: 10, label: 'Hal 10: 5. Jadwal, Biaya & TTD' },
  { page: 11, label: 'Hal 11: Lampiran I (GAP) & II (Risiko)' },
  { page: 12, label: 'Hal 12: Lampiran Referensi (1/2)' },
  { page: 13, label: 'Hal 13: Lampiran Referensi (2/2)' },
];

export const PdfViewer: React.FC<Props> = ({ data }) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const renderPdf = async () => {
    try {
      setLoading(true);
      setError(null);
      const bytes = await generatePdf(data);
      setPdfBytes(bytes);

      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
      const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (err: any) {
      console.error('Gagal membuat PDF:', err);
      setError(err?.message || 'Terjadi kesalahan saat memproses dokumen PDF template.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    renderPdf();
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, []);

  const handleDownload = () => {
    if (pdfBytes) {
      downloadKAKPdf(pdfBytes, `KAK-${data.tahun_anggaran || '2026'}-${(data.asisten_deputi || 'KemenkoPMK').replace(/\s+/g, '_')}.pdf`);
    }
  };

  const handleJumpPage = (pageNum: number) => {
    setCurrentPage(pageNum);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-900 text-slate-100">
      {/* Viewer Toolbar */}
      <div className="bg-slate-800 border-b border-slate-700 px-4 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-bold tracking-tight">
              Pratinjau Dokumen KAK
            </span>
          </div>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
            Total 13 Halaman Resmi
          </span>
        </div>

        {/* Page selector */}
        <div className="flex items-center gap-2">
          <select
            value={currentPage}
            onChange={(e) => handleJumpPage(Number(e.target.value))}
            className="bg-slate-700 text-xs font-medium text-slate-200 border border-slate-600 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            {PAGE_LABELS.map((p) => (
              <option key={p.page} value={p.page}>
                {p.label}
              </option>
            ))}
          </select>

          <button
            onClick={renderPdf}
            disabled={loading}
            title="Perbarui Pratinjau Dokumen"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg border border-slate-600 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden md:inline">Perbarui</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {pdfUrl && (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 rounded-lg transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Buka Tab Baru</span>
            </a>
          )}

          <button
            onClick={handleDownload}
            disabled={loading || !pdfBytes}
            className="flex items-center gap-2 px-4 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-sm transition disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-amber-300" />
            <span>Unduh PDF</span>
          </button>
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="flex-1 bg-slate-950 p-2 sm:p-4 overflow-hidden relative flex items-center justify-center">
        {loading && (
          <div className="absolute inset-0 bg-slate-950/80 z-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
            <p className="text-xs text-slate-400 font-medium">
              Memproses & merender dokumen KAK 13 halaman...
            </p>
          </div>
        )}

        {error && (
          <div className="bg-rose-950/80 border border-rose-800 text-rose-200 rounded-2xl p-6 max-w-md text-center">
            <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
            <h4 className="font-bold text-sm text-white mb-1">Gagal Menampilkan Pratinjau</h4>
            <p className="text-xs text-rose-300 mb-4">{error}</p>
            <button
              onClick={renderPdf}
              className="px-4 py-2 bg-rose-700 hover:bg-rose-600 text-white font-semibold text-xs rounded-xl transition"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {pdfUrl && !error && (
          <iframe
            key={`${pdfUrl}#page=${currentPage}`}
            src={`${pdfUrl}#page=${currentPage}&toolbar=1&navpanes=1`}
            title="Pratinjau PDF Kerangka Acuan Kegiatan"
            className="w-full h-full rounded-lg border border-slate-800 bg-white shadow-2xl"
          />
        )}
      </div>
    </div>
  );
};
