import React from 'react';
import { Sparkles } from 'lucide-react';

interface Props {
  langkah1: string;
  langkah2: string;
  langkah3: string;
  langkah4: string;
  onChange: (field: 'gap_langkah1' | 'gap_langkah2' | 'gap_langkah3' | 'gap_langkah4', val: string) => void;
}

export const GAPForm: React.FC<Props> = ({
  langkah1,
  langkah2,
  langkah3,
  langkah4,
  onChange,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-4 text-xs text-sky-900 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-sm text-sky-950 mb-1">Panduan Lampiran I: Gender Analysis Pathway (GAP)</h4>
          <p className="leading-relaxed">
            Format GAP disusun dalam 4 langkah terstruktur untuk memastikan intervensi kebijakan KAK responsif terhadap isu gender dan kelompok rentan (disabilitas, lanjut usia, perempuan, anak). Isi keempat kolom di bawah ini sesuai substansi rincian output Anda.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* LANGKAH 1 */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col">
          <div className="mb-3">
            <span className="inline-block px-2 py-0.5 text-[11px] font-bold text-sky-700 bg-sky-100 rounded-md mb-1">
              Langkah 1
            </span>
            <h4 className="text-sm font-semibold text-slate-800">
              Identifikasi Isu & Masalah Gender *
            </h4>
            <p className="text-[11px] text-slate-500 mt-1">
              Gunakan data terpilah (laki-laki / perempuan / disabilitas) dan jelaskan kesenjangan yang menjadi dasar intervensi.
            </p>
          </div>
          <textarea
            rows={14}
            value={langkah1}
            onChange={(e) => onChange('gap_langkah1', e.target.value)}
            placeholder="Contoh: Kesenjangan partisipasi kerja, akses layanan publik yang belum ramah..."
            className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none leading-relaxed resize-none flex-1 font-sans"
          />
        </div>

        {/* LANGKAH 2 */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col">
          <div className="mb-3">
            <span className="inline-block px-2 py-0.5 text-[11px] font-bold text-sky-700 bg-sky-100 rounded-md mb-1">
              Langkah 2
            </span>
            <h4 className="text-sm font-semibold text-slate-800">
              Identifikasi Faktor Penyebab *
            </h4>
            <p className="text-[11px] text-slate-500 mt-1">
              Kelompokkan penyebab isu pada Langkah 1 menjadi ranah Pemerintah, Masyarakat, Keluarga, atau Dunia Usaha.
            </p>
          </div>
          <textarea
            rows={14}
            value={langkah2}
            onChange={(e) => onChange('gap_langkah2', e.target.value)}
            placeholder="Contoh: Ranah Pemerintah: Standar fasilitas belum merata. Ranah Masyarakat: Norma sosial..."
            className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none leading-relaxed resize-none flex-1 font-sans"
          />
        </div>

        {/* LANGKAH 3 */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col">
          <div className="mb-3">
            <span className="inline-block px-2 py-0.5 text-[11px] font-bold text-sky-700 bg-sky-100 rounded-md mb-1">
              Langkah 3
            </span>
            <h4 className="text-sm font-semibold text-slate-800">
              Rencana Aksi Responsif Gender *
            </h4>
            <p className="text-[11px] text-slate-500 mt-1">
              Rumuskan aksi nyata tusi Kemenko PMK (sinkronisasi, koordinasi, pengendalian, fasilitasi, rekomendasi kebijakan).
            </p>
          </div>
          <textarea
            rows={14}
            value={langkah3}
            onChange={(e) => onChange('gap_langkah3', e.target.value)}
            placeholder="Contoh: SKP lintas K/L dalam penyusunan modul inklusif, rekomendasi penganggaran responsif gender..."
            className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none leading-relaxed resize-none flex-1 font-sans"
          />
        </div>

        {/* LANGKAH 4 */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col">
          <div className="mb-3">
            <span className="inline-block px-2 py-0.5 text-[11px] font-bold text-sky-700 bg-sky-100 rounded-md mb-1">
              Langkah 4
            </span>
            <h4 className="text-sm font-semibold text-slate-800">
              Pemangku Kepentingan (K/L/PD) *
            </h4>
            <p className="text-[11px] text-slate-500 mt-1">
              Tentukan pihak Internal (unit Kemenko PMK) dan Eksternal (Kementerian/Lembaga, Pemda, Mitra) pelaksana renaksi.
            </p>
          </div>
          <textarea
            rows={14}
            value={langkah4}
            onChange={(e) => onChange('gap_langkah4', e.target.value)}
            placeholder="Contoh: Internal: Asdep terkait. Eksternal: Kemensos, Kemnaker, Bappenas, Pemda..."
            className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none leading-relaxed resize-none flex-1 font-sans"
          />
        </div>
      </div>
    </div>
  );
};
