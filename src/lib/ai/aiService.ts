import type { KAKData } from '../../types/kak';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

const AI_API_URL = 'https://ukisai.com/api/swift/v1/chat/completions';
const MODEL_NAME = 'swift';

export const SYSTEM_PROMPT = `Anda adalah Asisten Cerdas Digitalisasi KAK (Kerangka Acuan Kegiatan) resmi untuk Kementerian Koordinator Bidang Pembangunan Manusia dan Kebudayaan (Kemenko PMK) Republik Indonesia.

Tugas dan Peran Utama:
1. Membantu pejabat perencana dan pelaksana di lingkungan Kemenko PMK dalam menyusun narasi dokumen KAK 13 halaman secara komprehensif, presisi, dan sesuai kaidah tata kelola anggaran pemerintah.
2. Membantu perumusan:
   - Keterkaitan Tugas & Fungsi (Tusi) Kemenko PMK sesuai Perpres.
   - Keterkaitan Prioritas Nasional (PN), Program Prioritas (PP), dan target RPJMN 2025-2029 serta RKP tahunan.
   - Gap Analysis dan narasi data dukung isu strategis.
   - Indikator Reformasi Birokrasi (RB) tematik/general.
   - Gender Analysis Pathway (GAP) dan Anggaran Responsif Gender (ARG).
   - Profil Manajemen Risiko (9 kategori risiko: Kebijakan, Regulasi, Keuangan, Reputasi, Operasional/SDM, Stakeholder, Bencana, Teknologi, Tata Kelola).
   - 4 Tahapan Pelaksanaan Keluaran: 1) Identifikasi Masalah, 2) Sinkronisasi, Koordinasi & Pengendalian, 3) Monitoring & Evaluasi, 4) Penyusunan Rekomendasi Kebijakan.
3. Gaya Komunikasi:
   - Bahasa Indonesia formal kedinasan, santun, lugas, dan terstruktur.
   - Format jawaban menggunakan markdown (poin-poin, bold untuk istilah penting, dan paragraf rapi).
   - Siap memberikan contoh teks siap pakai yang dapat langsung disalin ke dalam formulir KAK.`;

/**
 * Mengirim pesan tanya-jawab ke AI Model Swift
 */
export async function sendChatMessage(
  history: ChatMessage[],
  newMessage: string,
  currentKAKData?: Partial<KAKData>
): Promise<string> {
  try {
    // Siapkan ringkasan konteks data KAK saat ini jika tersedia
    let contextNote = '';
    if (currentKAKData && (currentKAKData.asisten_deputi || currentKAKData.ro_nama)) {
      contextNote = `\n\n[Konteks Dokumen KAK yang Sedang Dikerjakan Pengguna]:
- Unit Asisten Deputi: ${currentKAKData.asisten_deputi || '-'}
- Deputi Bidang: ${currentKAKData.deputi_bidang || '-'}
- Tahun Anggaran: ${currentKAKData.tahun_anggaran || '2026'}
- Rincian Output (RO): ${currentKAKData.ro_nama || '-'} (${currentKAKData.ro_kode || '-'})
- Klasifikasi RO (KRO): ${currentKAKData.kro_nama || '-'} (${currentKAKData.kro_kode || '-'})
- Kegiatan: ${currentKAKData.kegiatan_nama || '-'}`;
    }

    const messagesPayload = [
      {
        role: 'system',
        content: SYSTEM_PROMPT + contextNote,
      },
      ...history.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      {
        role: 'user',
        content: newMessage,
      },
    ];

    const requestPayload = {
      model: MODEL_NAME,
      messages: messagesPayload,
      temperature: 0.7,
    };

    let response: Response;
    try {
      // 1. Prioritaskan endpoint proxy /api/chat (Bebas kendala CORS pada browser & Vercel)
      response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload),
      });

      if (!response.ok && response.status === 404) {
        throw new Error('Proxy 404');
      }
    } catch {
      // 2. Fallback jika /api/chat tidak aktif, panggil langsung ke direct URL
      response = await fetch(AI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer none',
        },
        body: JSON.stringify(requestPayload),
      });
    }

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`AI Gateway Error (${response.status}): ${errText || response.statusText}`);
    }

    const data = await response.json();
    const assistantReply = data?.choices?.[0]?.message?.content;

    if (!assistantReply) {
      throw new Error('Tidak ada respon yang diterima dari model AI.');
    }

    return assistantReply.trim();
  } catch (error: any) {
    console.error('Gagal berkomunikasi dengan AI:', error);
    throw new Error(
      error?.message || 'Terjadi gangguan saat menghubungkan ke asisten AI. Silakan coba lagi.'
    );
  }
}
