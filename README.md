# Sistem Digitalisasi & Pengisian Otomatis Template KAK (Kerangka Acuan Kegiatan)
### Kementerian Koordinator Bidang Pembangunan Manusia dan Kebudayaan (Kemenko PMK)

Aplikasi web modern berbasis *client-side* (SPA) untuk mempermudah perumusan, pengisian, dan pencetakan dokumen resmi **Kerangka Acuan Kegiatan (KAK)** Kemenko PMK sebanyak **13 Halaman Penuh** secara otomatis, akurat, dan mempertahankan 100% tata letak visual template asli.

---

## ✨ Fitur Unggulan

1. **Zero Login & 100% Client-Side**:
   - Berjalan sepenuhnya di peramban (browser) pengguna tanpa server backend ataupun database.
   - Keamanan data terjamin—seluruh data anggaran dan kebijakan tersimpan secara lokal.
   - Dapat di-deploy sebagai situs statis di **Vercel**, **Netlify**, atau **GitHub Pages**.

2. **Preservasi 13 Halaman Template Asli**:
   - Template resmi (`Copy of Format Digitalisasi KAK.docx.pdf`) dijadikan sebagai *Source of Truth*.
   - Dokumen keluaran dijamin **tetap tepat 13 halaman**, format A4 (596 × 842 pt).
   - Logo Garuda, kop surat resmi, garis tabel, nomor halaman, dan header/footer asli terjaga utuh.
   - Masking presisi menutupi placeholder titik-titik (`……`, `....`), penomoran petunjuk `(1)`–`(15)`, serta highlight kuning dari template Word.

3. **Alur Formulir 16 Langkah Terstruktur**:
   - Navigasi sidebar pintar dengan pelacak progres (*progress bar*) dan indikator centang otomatis untuk setiap langkah yang telah diisi.
   - Mengelompokkan 126 titik isian ke dalam 16 bagian tematik (Identitas, Program & Output, Sasaran & IKP, Dasar Hukum, Tusi Kemenko, RPJMN/RKP, Gap Analysis, RB & Gender, Penerima Manfaat, Tahapan 1–4, Matriks Jadwal, Lampiran GAP, Lampiran Risiko, serta Pengesahan).

4. **Matriks Jadwal 12 Bulan Interaktif (Halaman 10)**:
   - Tabel pemilihan bulan pelaksanaan interaktif untuk tiap subkomponen.
   - Sel yang dipilih otomatis diarsir dengan warna hijau resmi template KAK (`#93c47d`).

5. **Lampiran I: Gender Analysis Pathway (GAP) Terintegrasi**:
   - Formulir 4 kolom terstruktur untuk analisis kesenjangan gender: Isu/Kesenjangan Gender, Faktor Penyebab, Rencana Aksi Responsif Gender, dan Pemangku Kepentingan.

6. **Lampiran II: Manajemen Risiko & Kalkulasi Otomatis (Halaman 11)**:
   - Tabel manajemen risiko 3 tingkat sesuai format resmi Kemenko PMK.
   - Pilihan Kategori Risiko (OP, KB, RP, KP, KC).
   - Pemilihan Level Kemungkinan (LK 1–5) dan Level Dampak (LD 1–5).
   - Perhitungan otomatis **Besaran Risiko ($BR = LK \times LD$)** dan badge **Level Risiko (LR)**: *Rendah*, *Sedang*, *Tinggi*, atau *Sangat Tinggi*.

7. **Konversi Terbilang Rupiah Otomatis**:
   - Mengubah angka nominal anggaran (misal `450000000`) menjadi kalimat terbilang bahasa Indonesia (*"Empat Ratus Lima Puluh Juta Rupiah"*) secara instan.

8. **Autosave & Manajemen Draf**:
   - Penyimpanan otomatis ke `localStorage` browser saat pengguna mengetik.
   - Notifikasi pemulihan draf (*Restore Draft*) saat aplikasi dibuka kembali.
   - Fitur **Ekspor JSON** untuk mencadangkan data dan **Impor JSON** untuk melanjutkan pengisian di perangkat lain.
   - Pilihan *Reset ke Formulir Kosong* atau *Muat Contoh Data Kemenko PMK*.

9. **Pratinjau Langsung (Live Preview) & Pengunduhan PDF**:
   - Tab Pratinjau PDF interaktif untuk memeriksa tampilan dokumen 13 halaman sebelum diunduh.
   - Navigasi lompat halaman cepat (Hal 1 s.d. Hal 13).
   - Tombol satu klik untuk mengunduh file `.pdf` siap cetak.

---

## 🛠️ Arsitektur & Teknologi

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) dengan tipografi modern (*Inter* & *Outfit*)
- **PDF Engine**: [pdf-lib](https://pdf-lib.js.org/) + [@pdf-lib/fontkit](https://github.com/Hopding/fontkit)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Visual Regression Testing**: Python 3 ([PyMuPDF / fitz](https://pymupdf.readthedocs.io/)) + Node.js ([tsx](https://github.com/privatenumber/tsx))

---

## 🚀 Cara Menjalankan Secara Lokal

### Prasyarat
- Node.js versi 18 atau lebih baru
- npm / yarn / pnpm

### 1. Instalasi Dependensi
```bash
npm install
```

### 2. Menjalankan Server Pengembangan
```bash
npm run dev
```
Buka peramban di `http://localhost:5173` (atau port yang ditampilkan di terminal).

### 3. Membangun untuk Produksi (Build)
```bash
npm run build
```
Hasil build siap *deploy* akan berada di folder `dist/`.

---

## 🌐 Panduan Deployment

Karena aplikasi ini 100% statis (*client-side*), proses deployment sangat mudah dan cepat:

### Deploy ke Vercel
1. Hubungkan repositori Git ke akun [Vercel](https://vercel.com/).
2. Konfigurasi build otomatis terdeteksi:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Klik **Deploy**.

### Deploy ke Netlify
1. Hubungkan repositori ke [Netlify](https://www.netlify.com/).
2. Pengaturan build:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. Klik **Deploy site**.

---

## 🧪 Pengujian Regresi Visual (Visual Regression Test)

Proyek ini dilengkapi dengan skrip otomatis untuk memastikan bahwa file PDF keluaran selalu tepat 13 halaman dan posisinya presisi terhadap template asli:

1. **Membuat Sampel PDF dari Data Contoh Kemenko PMK**:
   ```bash
   npx tsx scripts/generate_sample_pdf.ts
   ```
   *Output tersimpan di `analysis/sample_output.pdf`.*

2. **Menjalankan Perbandingan Visual Per-Halaman (PyMuPDF)**:
   ```bash
   python3 scripts/visual_regression_test.py
   ```
   *Skrip akan memverifikasi:*
   - Dimensi kertas tetap A4 (596 × 842 pt).
   - Halaman 12 dan 13 identik 100% (0.00% diff).
   - Halaman 1–11 tertimpa bersih di posisi placeholder tanpa pergeseran tata letak.
   - Hasil gambar perbandingan disimpan di folder `visual-diff/page-*.png`.

---

## 📂 Struktur Repositori

```text
├── public/
│   └── template.pdf            # PDF template resmi Kemenko PMK (13 halaman)
├── src/
│   ├── components/
│   │   ├── FormSteps/          # Formulir 16 langkah KAK
│   │   ├── GAPManager/         # Form 4 langkah Gender Analysis Pathway
│   │   ├── Layout/             # Navbar, FooterNav
│   │   ├── Modals/             # Modal Reset dan Restore Draf
│   │   ├── Preview/            # Pratinjau PDF interaktif
│   │   ├── RiskManager/        # Tabel Manajemen Risiko LK x LD
│   │   └── ScheduleMatrix/     # Matriks jadwal 12 bulan
│   ├── data/
│   │   ├── initialData.ts      # Contoh data realistis Kemenko PMK & state kosong
│   │   └── steps.ts            # Definisi 16 tahapan form
│   ├── lib/
│   │   ├── pdf/
│   │   │   ├── generatePdf.ts  # Mesin overlay PDF 13 halaman (pdf-lib)
│   │   │   └── terbilang.ts    # Konversi angka ke terbilang rupiah
│   │   └── storage.ts          # Autosave localStorage & ekspor/impor JSON
│   ├── types/
│   │   └── kak.ts              # Antarmuka TypeScript KAKData & RiskItem
│   ├── App.tsx                 # Komponen utama aplikasi
│   ├── index.css               # Desain sistem Tailwind v4
│   └── main.tsx                # Titik masuk React
├── scripts/
│   ├── generate_sample_pdf.ts  # Generator sampel PDF CLI
│   └── visual_regression_test.py # Verifikasi regresi visual PyMuPDF
├── FIELD-INVENTORY.md          # Inventaris lengkap 126 placeholder
├── FIELD-MAPPING.md            # Pemetaan form ke halaman PDF
├── AMBIGUOUS-FIELDS.md         # Dokumentasi penanganan nomor petunjuk (1)-(15)
└── README.md                   # Dokumentasi proyek
```

---

## 📝 Catatan Penggunaan

- **Penyimpanan Draft**: Data Anda tersimpan di browser secara lokal. Jangan membersihkan cookies/cache browser jika ingin mempertahankan draf tanpa diekspor.
- **Pencadangan**: Sangat disarankan untuk menekan tombol **Ekspor JSON** secara berkala untuk menyimpan salinan cadangan naskah KAK ke komputer Anda.
- **Kesesuaian Regulasi**: Formula risiko dan matriks mengacu pada tata cara perumusan Kerangka Acuan Kegiatan dan Manajemen Risiko di lingkungan Kemenko PMK.
