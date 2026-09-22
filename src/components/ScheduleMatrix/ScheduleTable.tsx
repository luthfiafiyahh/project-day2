import React from 'react';
import type { ScheduleSubcomponent } from '../../types/kak';
import { Check, Calendar } from 'lucide-react';

interface Props {
  subkomponenName: string;
  subkomponenCode: string;
  value: ScheduleSubcomponent;
  onChange: (val: ScheduleSubcomponent) => void;
}

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
];

type ActivityKey = 'identifikasi' | 'sinkronisasi' | 'monitoring' | 'rekomendasi';

const ACTIVITIES: { key: ActivityKey; no: string; label: string }[] = [
  { key: 'identifikasi', no: '1.', label: 'Melaksanakan Identifikasi Permasalahan' },
  { key: 'sinkronisasi', no: '2.', label: 'Melaksanakan Sinkronisasi, Koordinasi, dan Pengendalian' },
  { key: 'monitoring', no: '3.', label: 'Melaksanakan Monitoring dan Evaluasi' },
  { key: 'rekomendasi', no: '4.', label: 'Menyusun Rekomendasi Kebijakan' },
];

export const ScheduleTable: React.FC<Props> = ({
  subkomponenName,
  subkomponenCode,
  value,
  onChange,
}) => {
  const toggleMonth = (activity: ActivityKey, monthIndex: number) => {
    const current = [...(value[activity] || new Array(12).fill(0))];
    current[monthIndex] = current[monthIndex] ? 0 : 1;
    onChange({
      ...value,
      [activity]: current,
    });
  };

  const selectAll = (activity: ActivityKey) => {
    onChange({
      ...value,
      [activity]: new Array(12).fill(1),
    });
  };

  const clearAll = (activity: ActivityKey) => {
    onChange({
      ...value,
      [activity]: new Array(12).fill(0),
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden mb-6">
      <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-600" />
          <span className="font-semibold text-slate-800 text-sm">{subkomponenName}</span>
          <span className="text-xs text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded font-mono">{subkomponenCode}</span>
        </div>
        <span className="text-xs text-slate-500 italic">Klik tombol bulan untuk mengaktifkan / menonaktifkan jadwal</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-700">
              <th className="py-2.5 px-3 w-8 text-center font-semibold">No</th>
              <th className="py-2.5 px-4 font-semibold min-w-[240px]">Nama Kegiatan Tahapan</th>
              <th className="py-2.5 px-3 text-center font-semibold" colSpan={12}>
                Bulan Pelaksanaan (Tahun Anggaran Berjalan)
              </th>
              <th className="py-2.5 px-3 text-center font-semibold w-24">Aksi</th>
            </tr>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-[11px]">
              <th colSpan={2}></th>
              {MONTH_NAMES.map((m, idx) => (
                <th key={idx} className="py-1 px-1 text-center w-8 font-medium">
                  {m}
                </th>
              ))}
              <th></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {ACTIVITIES.map((act) => {
              const months = value[act.key] || new Array(12).fill(0);
              const activeCount = months.filter(Boolean).length;

              return (
                <tr key={act.key} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3 text-center font-mono text-slate-400">{act.no}</td>
                  <td className="py-3 px-4 text-slate-800 font-medium">
                    <div className="flex items-center justify-between pr-2">
                      <span>{act.label}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        ({activeCount} bln)
                      </span>
                    </div>
                  </td>
                  {MONTH_NAMES.map((_, mIdx) => {
                    const isActive = Boolean(months[mIdx]);
                    return (
                      <td key={mIdx} className="p-1 text-center">
                        <button
                          type="button"
                          onClick={() => toggleMonth(act.key, mIdx)}
                          title={`Bulan ${MONTH_NAMES[mIdx]}: ${isActive ? 'Aktif' : 'Non-aktif'}`}
                          className={`w-7 h-7 rounded-md text-[11px] font-semibold transition-all flex items-center justify-center mx-auto cursor-pointer border ${
                            isActive
                              ? 'bg-[#93c47d] text-slate-900 border-[#7bb562] shadow-xs hover:bg-[#85be6e]'
                              : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-100 hover:text-slate-700'
                          }`}
                        >
                          {isActive ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : mIdx + 1}
                        </button>
                      </td>
                    );
                  })}
                  <td className="py-2 px-2 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => selectAll(act.key)}
                        className="px-1.5 py-0.5 text-[10px] bg-emerald-50 text-emerald-700 rounded hover:bg-emerald-100 cursor-pointer font-medium"
                      >
                        Semua
                      </button>
                      <button
                        type="button"
                        onClick={() => clearAll(act.key)}
                        className="px-1.5 py-0.5 text-[10px] bg-slate-100 text-slate-600 rounded hover:bg-slate-200 cursor-pointer font-medium"
                      >
                        Reset
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
