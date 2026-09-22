import React from 'react';
import type { RiskItem } from '../../types/kak';
import { ShieldAlert } from 'lucide-react';

interface Props {
  riskRows: RiskItem[];
  onChange: (rows: RiskItem[]) => void;
}

const KATEGORI_OPTIONS = [
  { label: 'Operasional', code: 'OP' },
  { label: 'Kebijakan', code: 'KB' },
  { label: 'Reputasi', code: 'RP' },
  { label: 'Kepatuhan', code: 'KP' },
  { label: 'Kecurangan', code: 'KC' },
];

export function getRiskLevel(lk: number, ld: number): { br: number; lr: string; badgeClass: string } {
  const br = (lk || 1) * (ld || 1);
  let lr = 'Rendah';
  let badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';

  if (br >= 16) {
    lr = 'Sangat Tinggi';
    badgeClass = 'bg-rose-50 text-rose-700 border-rose-200';
  } else if (br >= 10) {
    lr = 'Tinggi';
    badgeClass = 'bg-amber-50 text-amber-700 border-amber-200';
  } else if (br >= 5) {
    lr = 'Sedang';
    badgeClass = 'bg-sky-50 text-sky-700 border-sky-200';
  }

  return { br, lr, badgeClass };
}

export const RiskTableForm: React.FC<Props> = ({ riskRows, onChange }) => {
  const updateRow = (index: number, field: keyof RiskItem, value: any) => {
    const updated = [...riskRows];
    const currentRow = { ...updated[index], [field]: value };

    if (field === 'lk' || field === 'ld') {
      const lk = field === 'lk' ? Number(value) : currentRow.lk;
      const ld = field === 'ld' ? Number(value) : currentRow.ld;
      const { br, lr } = getRiskLevel(lk, ld);
      currentRow.br = br;
      currentRow.lr = lr;
    }

    if (field === 'kategori') {
      const matched = KATEGORI_OPTIONS.find((k) => k.label === value);
      if (matched) {
        currentRow.kodeKategori = matched.code;
      }
    }

    updated[index] = currentRow;
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      {/* Informative Guidance */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-sm text-amber-950 mb-1">
            Panduan Lampiran II: Manajemen Risiko (3 Tingkat Risiko)
          </h4>
          <p className="leading-relaxed">
            Sesuai standar template Kemenko PMK (Halaman 11), terdapat 3 baris profil risiko yang wajib diisi:
            lingkup tugas, deskripsi peristiwa risiko, kategori risiko, penyebab, dampak, nilai kemungkinan (LK 1-5),
            nilai dampak (LD 1-5), opsi perlakuan risiko, serta pemilik dan mitra penanganan risiko. Besaran Risiko (BR)
            dan Level Risiko (LR) dihitung otomatis berdasarkan perkalian LK × LD.
          </p>
        </div>
      </div>

      {/* 3 Risk Rows Accordion / Cards */}
      <div className="space-y-5">
        {riskRows.map((row, idx) => {
          const { br, lr, badgeClass } = getRiskLevel(row.lk, row.ld);

          return (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs transition hover:border-slate-300"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">
                      Risiko #{idx + 1}: {row.peristiwa ? row.peristiwa.slice(0, 45) + (row.peristiwa.length > 45 ? '...' : '') : 'Belum diisi'}
                    </h4>
                    <span className="text-[11px] text-slate-500">
                      Lingkup: {row.lingkup || 'Umum'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600">
                    Skor: <strong>{row.lk} × {row.ld} = {br}</strong>
                  </span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${badgeClass}`}>
                    {lr}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Lingkup Tugas / Tahapan *
                  </label>
                  <input
                    type="text"
                    value={row.lingkup}
                    onChange={(e) => updateRow(idx, 'lingkup', e.target.value)}
                    placeholder="Contoh: Identifikasi Kebijakan"
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Peristiwa Risiko *
                  </label>
                  <input
                    type="text"
                    value={row.peristiwa}
                    onChange={(e) => updateRow(idx, 'peristiwa', e.target.value)}
                    placeholder="Contoh: Data dukung dari K/L terlambat dikirimkan..."
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kategori Risiko
                  </label>
                  <select
                    value={row.kategori}
                    onChange={(e) => updateRow(idx, 'kategori', e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
                  >
                    {KATEGORI_OPTIONS.map((opt) => (
                      <option key={opt.code} value={opt.label}>
                        {opt.label} ({opt.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kode Kategori
                  </label>
                  <input
                    type="text"
                    value={row.kodeKategori}
                    readOnly
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kemungkinan (LK 1-5) *
                  </label>
                  <select
                    value={row.lk}
                    onChange={(e) => updateRow(idx, 'lk', Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white font-medium"
                  >
                    <option value={1}>1 - Sangat Rendah</option>
                    <option value={2}>2 - Rendah</option>
                    <option value={3}>3 - Sedang</option>
                    <option value={4}>4 - Tinggi</option>
                    <option value={5}>5 - Sangat Tinggi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Dampak (LD 1-5) *
                  </label>
                  <select
                    value={row.ld}
                    onChange={(e) => updateRow(idx, 'ld', Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white font-medium"
                  >
                    <option value={1}>1 - Tidak Signifikan</option>
                    <option value={2}>2 - Minor</option>
                    <option value={3}>3 - Moderat</option>
                    <option value={4}>4 - Signifikan</option>
                    <option value={5}>5 - Sangat Signifikan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Penyebab Risiko *
                  </label>
                  <textarea
                    rows={2}
                    value={row.penyebab}
                    onChange={(e) => updateRow(idx, 'penyebab', e.target.value)}
                    placeholder="Penyebab mendasar terjadinya risiko..."
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none leading-relaxed resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Dampak yang Ditimbulkan *
                  </label>
                  <textarea
                    rows={2}
                    value={row.dampak}
                    onChange={(e) => updateRow(idx, 'dampak', e.target.value)}
                    placeholder="Konsekuensi terhadap capaian target..."
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none leading-relaxed resize-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Rencana Perlakuan / Mitigasi *
                  </label>
                  <input
                    type="text"
                    value={row.perlakuan}
                    onChange={(e) => updateRow(idx, 'perlakuan', e.target.value)}
                    placeholder="Contoh: Mengirimkan surat penegasan lebih awal"
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pemilik Risiko
                  </label>
                  <input
                    type="text"
                    value={row.pemilik}
                    onChange={(e) => updateRow(idx, 'pemilik', e.target.value)}
                    placeholder="Contoh: Asisten Deputi"
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mitra Penanganan
                  </label>
                  <input
                    type="text"
                    value={row.mitra}
                    onChange={(e) => updateRow(idx, 'mitra', e.target.value)}
                    placeholder="Contoh: K/L Teknis, Bappenas"
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
