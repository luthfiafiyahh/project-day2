import json

def generate_docs():
    with open('analysis/pdf_detailed_analysis.json') as f:
        pages = json.load(f)

    inventory_items = [
        # PAGE 1 (Cover)
        {
            "no": 1, "page": 1, "placeholder": "ASISTEN DEPUTI ……", "field_id": "cover_asisten_deputi",
            "type": "text", "required": True, "topleft": [333.67, 300.94, 355.66, 313.58], "pdf": [239.62, 528.42, 119.1, 14],
            "note": "Nama unit Asisten Deputi pada judul sampul KAK"
        },
        {
            "no": 2, "page": 1, "placeholder": "TAHUN ……", "field_id": "cover_tahun",
            "type": "year", "required": True, "topleft": [307.0, 314.59, 328.98, 327.23], "pdf": [266.29, 514.77, 65.75, 14],
            "note": "Tahun anggaran pada judul sampul"
        },
        {
            "no": 3, "page": 1, "placeholder": "REKOMENDASI ALTERNATIF KEBIJAKAN ……", "field_id": "cover_ro_nama",
            "type": "text", "required": True, "topleft": [398.2, 355.54, 420.18, 368.19], "pdf": [175.1, 473.81, 248.14, 14],
            "note": "Nama Rincian Output (RO)"
        },
        {
            "no": 4, "page": 1, "placeholder": "(……)", "field_id": "cover_ro_kode",
            "type": "text", "required": True, "topleft": [286.65, 369.19, 308.63, 381.84], "pdf": [282.99, 460.16, 32.36, 14],
            "note": "Kode RO (dalam tanda kurung)"
        },
        {
            "no": 5, "page": 1, "placeholder": "Kebijakan Bidang ……", "field_id": "cover_kro_nama",
            "type": "text", "required": True, "topleft": [330.95, 410.14, 352.94, 422.79], "pdf": [242.34, 419.21, 110.6, 14],
            "note": "Nama Klasifikasi Rincian Output (KRO)"
        },
        {
            "no": 6, "page": 1, "placeholder": "(……)", "field_id": "cover_kro_kode",
            "type": "text", "required": True, "topleft": [286.65, 423.79, 308.63, 436.44], "pdf": [282.99, 405.56, 32.36, 14],
            "note": "Kode KRO (dalam tanda kurung)"
        },
        {
            "no": 7, "page": 1, "placeholder": "Kebijakan ……", "field_id": "cover_kegiatan_nama",
            "type": "text", "required": True, "topleft": [312.31, 480.74, 334.3, 493.39], "pdf": [260.98, 348.61, 73.32, 14],
            "note": "Nama Kegiatan"
        },
        {
            "no": 8, "page": 1, "placeholder": "(……)", "field_id": "cover_kegiatan_kode",
            "type": "text", "required": True, "topleft": [286.65, 494.39, 308.63, 507.04], "pdf": [282.99, 334.96, 32.36, 14],
            "note": "Kode Kegiatan"
        },
        {
            "no": 9, "page": 1, "placeholder": "DEPUTI BIDANG ……", "field_id": "cover_deputi_bidang",
            "type": "text", "required": True, "topleft": [331.53, 609.0, 353.52, 621.65], "pdf": [241.76, 220.35, 114.81, 14],
            "note": "Nama Deputi Bidang di bagian bawah sampul"
        },
        {
            "no": 10, "page": 1, "placeholder": "TAHUN ……", "field_id": "cover_tahun_bawah",
            "type": "year", "required": True, "topleft": [307.0, 654.53, 328.98, 667.18], "pdf": [266.29, 174.82, 65.75, 14],
            "note": "Tahun anggaran pada bagian bawah sampul"
        },

        # PAGE 2 (Identitas & Latar Belakang)
        {
            "no": 11, "page": 2, "placeholder": "Unit Eselon II : Asisten Deputi ……", "field_id": "p2_unit_eselon_ii",
            "type": "text", "required": True, "topleft": [319.18, 145.04, 341.16, 157.69], "pdf": [319.18, 684.31, 150.0, 14],
            "note": "Nama Asisten Deputi pada tabel identitas KAK"
        },
        {
            "no": 12, "page": 2, "placeholder": "Sasaran Program : ... kebijakan Bidang ……", "field_id": "p2_sasaran_program_bidang",
            "type": "text", "required": True, "topleft": [403.51, 220.93, 425.49, 233.58], "pdf": [403.51, 608.42, 130.0, 14],
            "note": "Bidang kebijakan pada Sasaran Program"
        },
        {
            "no": 13, "page": 2, "placeholder": "IKP : ... di Bidang …… yang dihasilkan", "field_id": "p2_ikp_bidang",
            "type": "text", "required": True, "topleft": [484.23, 239.91, 506.21, 252.56], "pdf": [484.23, 589.44, 130.0, 14],
            "note": "Bidang kebijakan pada Indikator Kinerja Program"
        },
        {
            "no": 14, "page": 2, "placeholder": "Kegiatan : Kebijakan ……", "field_id": "p2_kegiatan_nama",
            "type": "text", "required": True, "topleft": [296.58, 277.85, 321.62, 290.5], "pdf": [296.58, 551.5, 120.0, 14],
            "note": "Nama Kegiatan pada identitas KAK"
        },
        {
            "no": 15, "page": 2, "placeholder": "Kegiatan : (……)", "field_id": "p2_kegiatan_kode",
            "type": "text", "required": True, "topleft": [325.28, 277.85, 347.27, 290.5], "pdf": [325.28, 551.5, 50.0, 14],
            "note": "Kode Kegiatan pada identitas KAK"
        },
        {
            "no": 16, "page": 2, "placeholder": "Sasaran Kegiatan : Tersusunnya Kebijakan Bidang ……", "field_id": "p2_sasaran_kegiatan_bidang",
            "type": "text", "required": True, "topleft": [399.24, 296.83, 421.23, 309.48], "pdf": [399.24, 532.52, 100.0, 14],
            "note": "Bidang Sasaran Kegiatan"
        },
        {
            "no": 17, "page": 2, "placeholder": "Sasaran Kegiatan : (……)", "field_id": "p2_sasaran_kegiatan_kode",
            "type": "text", "required": True, "topleft": [427.94, 296.83, 449.92, 309.48], "pdf": [427.94, 532.52, 50.0, 14],
            "note": "Kode Sasaran Kegiatan"
        },
        {
            "no": 18, "page": 2, "placeholder": "KRO : Kebijakan Bidang ……", "field_id": "p2_kro_nama",
            "type": "text", "required": True, "topleft": [333.86, 315.8, 358.9, 328.45], "pdf": [333.86, 513.55, 120.0, 14],
            "note": "Nama Klasifikasi Rincian Output pada tabel identitas"
        },
        {
            "no": 19, "page": 2, "placeholder": "KRO : (……)", "field_id": "p2_kro_kode",
            "type": "text", "required": True, "topleft": [362.56, 315.8, 384.55, 328.45], "pdf": [362.56, 513.55, 50.0, 14],
            "note": "Kode KRO pada tabel identitas"
        },
        {
            "no": 20, "page": 2, "placeholder": "RO : Rekomendasi Alternatif Kebijakan ……", "field_id": "p2_ro_nama",
            "type": "text", "required": True, "topleft": [413.28, 334.77, 435.26, 347.42], "pdf": [413.28, 494.58, 120.0, 14],
            "note": "Nama RO pada tabel identitas"
        },
        {
            "no": 21, "page": 2, "placeholder": "RO : (……)", "field_id": "p2_ro_kode",
            "type": "text", "required": True, "topleft": [441.98, 334.77, 463.96, 347.42], "pdf": [441.98, 494.58, 50.0, 14],
            "note": "Kode RO pada tabel identitas"
        },
        {
            "no": 22, "page": 2, "placeholder": "Indikator RO : ... Alternatif Kebijakan ……", "field_id": "p2_indikator_ro",
            "type": "text", "required": True, "topleft": [451.77, 353.75, 473.75, 366.4], "pdf": [451.77, 475.6, 120.0, 14],
            "note": "Nama/fokus pada Indikator Rincian Output"
        },
        {
            "no": 23, "page": 2, "placeholder": "Volume : …… Rekomendasi", "field_id": "p2_volume_ro",
            "type": "number", "required": True, "topleft": [245.25, 372.72, 267.23, 385.37], "pdf": [245.25, 456.63, 30.0, 14],
            "note": "Jumlah angka volume keluaran (contoh: 1)"
        },
        {
            "no": 24, "page": 2, "placeholder": "RO …… diantaranya yaitu:", "field_id": "p2_dasar_hukum_ro",
            "type": "text", "required": True, "topleft": [93.0, 481.24, 114.98, 493.89], "pdf": [93.0, 348.11, 100.0, 14],
            "note": "Nama RO pada pembuka kalimat Dasar Hukum"
        },
        {
            "no": 25, "page": 2, "placeholder": "1) …… (Dasar Hukum 1)", "field_id": "p2_dasar_hukum_1",
            "type": "text", "required": True, "topleft": [129.0, 500.21, 150.98, 512.86], "pdf": [129.0, 329.14, 390.0, 14],
            "note": "Butir dasar hukum ke-1"
        },
        {
            "no": 26, "page": 2, "placeholder": "2) …… (Dasar Hukum 2)", "field_id": "p2_dasar_hukum_2",
            "type": "text", "required": False, "topleft": [129.0, 519.18, 150.98, 531.83], "pdf": [129.0, 310.17, 390.0, 14],
            "note": "Butir dasar hukum ke-2"
        },
        {
            "no": 27, "page": 2, "placeholder": "3) …… dst (Dasar Hukum 3)", "field_id": "p2_dasar_hukum_3",
            "type": "text", "required": False, "topleft": [107.25, 538.16, 168.7, 550.81], "pdf": [107.25, 291.19, 410.0, 14],
            "note": "Butir dasar hukum ke-3 dan seterusnya"
        },
        {
            "no": 28, "page": 2, "placeholder": "Peraturan Presiden Nomor …… (1)", "field_id": "p2_perpres_nomor",
            "type": "text", "required": True, "topleft": [324.43, 620.38, 346.41, 633.02], "pdf": [324.43, 208.98, 80.0, 14],
            "note": "Nomor Perpres tusi Kemenko PMK (marker 1 dihapus di output)"
        },
        {
            "no": 29, "page": 2, "placeholder": "tentang …… (2)", "field_id": "p2_perpres_tentang",
            "type": "text", "required": True, "topleft": [418.43, 620.38, 440.42, 633.02], "pdf": [418.43, 208.98, 110.0, 14],
            "note": "Judul Perpres tusi Kemenko PMK (marker 2 dihapus di output)"
        },
        {
            "no": 30, "page": 2, "placeholder": "urusan pemerintahan di bidang …… (3)", "field_id": "p2_urusan_bidang",
            "type": "text", "required": True, "topleft": [215.45, 677.3, 237.43, 689.94], "pdf": [215.45, 152.06, 90.0, 14],
            "note": "Bidang urusan pemerintahan (marker 3 dihapus di output)"
        },
        {
            "no": 31, "page": 2, "placeholder": "Deputi Bidang …… (4)", "field_id": "p2_deputi_bidang_tusi",
            "type": "text", "required": True, "topleft": [481.69, 696.27, 523.16, 708.92], "pdf": [481.69, 133.08, 90.0, 14],
            "note": "Deputi Bidang pelaksana tugas (marker 4 dihapus di output)"
        },
        {
            "no": 32, "page": 2, "placeholder": "menyelenggarakan fungsi …… (5)", "field_id": "p2_fungsi_deputi",
            "type": "text", "required": True, "topleft": [229.44, 715.24, 278.46, 727.89], "pdf": [229.44, 114.11, 70.0, 14],
            "note": "Fungsi deputi (marker 5 dihapus di output)"
        },
        {
            "no": 33, "page": 2, "placeholder": "kebijakan di bidang ….. (6)", "field_id": "p2_fungsi_deputi_bidang",
            "type": "text", "required": True, "topleft": [378.58, 715.24, 424.28, 727.89], "pdf": [378.58, 114.11, 80.0, 14],
            "note": "Bidang kebijakan fungsi deputi (marker 6 dihapus di output)"
        },
        {
            "no": 34, "page": 2, "placeholder": "Asisten Deputi …… (7)", "field_id": "p2_asdep_tusi",
            "type": "text", "required": True, "topleft": [318.04, 734.22, 358.01, 746.86], "pdf": [318.04, 95.14, 80.0, 14],
            "note": "Nama Asisten Deputi pelaksana (marker 7 dihapus di output)"
        },
        {
            "no": 35, "page": 2, "placeholder": "menjalankan fungsi ……(8)", "field_id": "p2_asdep_fungsi",
            "type": "text", "required": True, "topleft": [487.17, 734.22, 522.59, 746.86], "pdf": [487.17, 95.14, 60.0, 14],
            "note": "Fungsi Asdep (marker 8 dihapus di output)"
        },
        {
            "no": 36, "page": 2, "placeholder": "koordinasi Asisten Deputi ……(9)", "field_id": "p2_asdep_koordinasi",
            "type": "text", "required": True, "topleft": [487.2, 753.19, 522.62, 765.84], "pdf": [487.2, 76.16, 60.0, 14],
            "note": "Nama Asisten Deputi koordinasi K/L (marker 9 dihapus di output)"
        },

        # PAGE 3 (RPJMN, Renstra, Gap Analysis, Rencana RO)
        {
            "no": 37, "page": 3, "placeholder": "antara lain …… (10)", "field_id": "p3_kl_koordinasi",
            "type": "text", "required": True, "topleft": [147.39, 72.0, 169.37, 84.65], "pdf": [147.39, 757.35, 370.0, 14],
            "note": "Daftar K/L yang dikoordinasikan (marker 10 dihapus di output)"
        },
        {
            "no": 38, "page": 3, "placeholder": "Program kerja Asisten Deputi …… (11)", "field_id": "p3_asdep_program_kerja",
            "type": "text", "required": True, "topleft": [254.76, 90.97, 298.74, 103.62], "pdf": [254.76, 738.38, 120.0, 14],
            "note": "Nama Asdep dalam konteks RPJMN (marker 11 dihapus)"
        },
        {
            "no": 39, "page": 3, "placeholder": "Prioritas Nasional (PN) ……(12)", "field_id": "p3_pn_nomor",
            "type": "text", "required": True, "topleft": [93.0, 128.92, 163.8, 141.57], "pdf": [93.0, 700.43, 60.0, 14],
            "note": "Nomor/kode Prioritas Nasional (marker 12 dihapus)"
        },
        {
            "no": 40, "page": 3, "placeholder": "yaitu ……(13)", "field_id": "p3_pn_nama",
            "type": "text", "required": True, "topleft": [169.86, 128.92, 211.39, 141.57], "pdf": [169.86, 700.43, 140.0, 14],
            "note": "Nama Prioritas Nasional (marker 13 dihapus)"
        },
        {
            "no": 41, "page": 3, "placeholder": "Sasaran utama PN ……(14)", "field_id": "p3_sasaran_pn_nomor",
            "type": "text", "required": True, "topleft": [322.42, 128.92, 363.95, 141.57], "pdf": [322.42, 700.43, 60.0, 14],
            "note": "Nomor/kode sasaran PN (marker 14 dihapus)"
        },
        {
            "no": 42, "page": 3, "placeholder": "yaitu ……(15)", "field_id": "p3_sasaran_pn_nama",
            "type": "text", "required": True, "topleft": [397.78, 128.92, 439.31, 141.57], "pdf": [397.78, 700.43, 120.0, 14],
            "note": "Nama Sasaran PN (marker 15 dihapus)"
        },
        {
            "no": 43, "page": 3, "placeholder": "Rencana Kerja Pemerintah (RKP) ……", "field_id": "p3_rkp_tahun",
            "type": "year", "required": True, "topleft": [188.24, 147.89, 210.23, 160.54], "pdf": [188.24, 681.46, 50.0, 14],
            "note": "Tahun RKP (misal: 2026)"
        },
        {
            "no": 44, "page": 3, "placeholder": "Program Prioritas (PP) ……", "field_id": "p3_pp_nomor",
            "type": "text", "required": True, "topleft": [444.8, 166.87, 466.79, 179.52], "pdf": [444.8, 662.48, 50.0, 14],
            "note": "Nomor/nama Program Prioritas RKP"
        },
        {
            "no": 45, "page": 3, "placeholder": "yaitu …… .", "field_id": "p3_pp_nama",
            "type": "text", "required": True, "topleft": [497.61, 166.87, 519.6, 179.52], "pdf": [497.61, 662.48, 100.0, 14],
            "note": "Uraian Program Prioritas"
        },
        {
            "no": 46, "page": 3, "placeholder": "Intervensi kebijakan bidang ……", "field_id": "p3_intervensi_bidang",
            "type": "text", "required": True, "topleft": [229.27, 185.84, 251.25, 198.49], "pdf": [229.27, 643.51, 120.0, 14],
            "note": "Bidang intervensi kebijakan yang menjadi fokus"
        },
        {
            "no": 47, "page": 3, "placeholder": "yang menjadi fokus yaitu …… .", "field_id": "p3_intervensi_fokus",
            "type": "text", "required": True, "topleft": [378.35, 185.84, 400.33, 198.49], "pdf": [378.35, 643.51, 140.0, 14],
            "note": "Uraian fokus intervensi"
        },
        {
            "no": 48, "page": 3, "placeholder": "Program dan indikator ... dikawal di tahun ……", "field_id": "p3_indikator_tahun",
            "type": "year", "required": True, "topleft": [444.04, 204.81, 466.02, 217.46], "pdf": [444.04, 624.54, 50.0, 14],
            "note": "Tahun pengawalan indikator RPJMN"
        },
        {
            "no": 49, "page": 3, "placeholder": "diantaranya yaitu …… 1)..... 2).... 3) dst.", "field_id": "p3_indikator_rpjmn_list",
            "type": "textarea", "required": True, "topleft": [409.13, 223.79, 519.68, 236.44], "pdf": [93.0, 580.0, 430.0, 40],
            "note": "Daftar indikator Lampiran III RPJMN 2025-2029"
        },
        {
            "no": 50, "page": 3, "placeholder": "Renstra Kemenko PMK …… menyatakan bahwa", "field_id": "p3_renstra_periode",
            "type": "text", "required": False, "topleft": [254.38, 318.65, 280.92, 331.3], "pdf": [254.38, 510.7, 70.0, 14],
            "note": "Periode Renstra Kemenko PMK (misal: 2025-2029)"
        },
        {
            "no": 51, "page": 3, "placeholder": "Data terbaru & Gap Analysis (narasi naratif)", "field_id": "p3_gap_analysis_narasi",
            "type": "textarea", "required": True, "topleft": [93.0, 337.63, 523.03, 464.12], "pdf": [93.0, 377.88, 430.0, 130],
            "note": "Narasi isu strategis, kondisi terkini, data indikator, gap analysis, infografis & kewilayahan"
        },
        {
            "no": 52, "page": 3, "placeholder": "Kemenko PMK / Deputi Bidang …… memiliki program prioritas lainnya", "field_id": "p3_program_prioritas_deputi",
            "type": "text", "required": False, "topleft": [185.68, 470.44, 207.66, 483.09], "pdf": [185.68, 358.91, 100.0, 14],
            "note": "Nama Deputi bidang program prioritas lainnya"
        },
        {
            "no": 53, "page": 3, "placeholder": "program prioritas lainnya yaitu …… (merujuk regulasi/PKPN)", "field_id": "p3_program_prioritas_uraian",
            "type": "textarea", "required": False, "topleft": [120.77, 489.41, 522.91, 521.04], "pdf": [93.0, 320.0, 430.0, 35],
            "note": "Uraian program prioritas lainnya (opsional)"
        },
        {
            "no": 54, "page": 3, "placeholder": "rencana kerja Asisten Deputi …… tahun anggaran ….", "field_id": "p3_asdep_ro_rencana",
            "type": "text", "required": True, "topleft": [93.0, 546.33, 114.98, 558.98], "pdf": [93.0, 283.02, 100.0, 14],
            "note": "Nama Asisten Deputi pada rincian output rencana kerja"
        },
        {
            "no": 55, "page": 3, "placeholder": "1) Rekomendasi Alternatif Kebijakan …… (fokus, tujuan, harapan)", "field_id": "p3_ro_1_fokus_tujuan",
            "type": "textarea", "required": True, "topleft": [93.0, 565.31, 523.0, 615.9], "pdf": [93.0, 226.1, 430.0, 55],
            "note": "Rekomendasi Alternatif Kebijakan ke-1 (nama, tujuan, fokus, dan harapan)"
        },
        {
            "no": 56, "page": 3, "placeholder": "2) Rekomendasi Alternatif Kebijakan …… (fokus, tujuan, harapan)", "field_id": "p3_ro_2_fokus_tujuan",
            "type": "textarea", "required": False, "topleft": [93.0, 622.23, 523.0, 672.82], "pdf": [93.0, 169.18, 430.0, 55],
            "note": "Rekomendasi Alternatif Kebijakan ke-2 (jika ada)"
        },
        {
            "no": 57, "page": 3, "placeholder": "3) Rekomendasi Alternatif Kebijakan ……", "field_id": "p3_ro_3_fokus_tujuan",
            "type": "text", "required": False, "topleft": [302.31, 679.15, 324.3, 691.8], "pdf": [93.0, 150.2, 430.0, 15],
            "note": "Rekomendasi Alternatif Kebijakan ke-3 (opsional)"
        },

        # PAGE 4 (RB, PUG, MR, Penerima Manfaat)
        {
            "no": 58, "page": 4, "placeholder": "Asisten Deputi …… mandat pengawalan indikator RB", "field_id": "p4_rb_asdep",
            "type": "text", "required": True, "topleft": [430.61, 96.97, 452.6, 109.62], "pdf": [430.61, 732.38, 80.0, 14],
            "note": "Nama Asisten Deputi pada bagian Reformasi Birokrasi"
        },
        {
            "no": 59, "page": 4, "placeholder": "mandat pengawalan indikator RB yaitu …… 1)..... 2).... 3) dst.", "field_id": "p4_rb_indikator_list",
            "type": "textarea", "required": True, "topleft": [284.26, 115.95, 394.81, 128.6], "pdf": [108.0, 543.29, 415.0, 170],
            "note": "Narasi indikator RB & catatan pelaksanaan tugas fungsi UKE"
        },
        {
            "no": 60, "page": 4, "placeholder": "PUG : Asisten Deputi …… telah mengintegrasikan perspektif gender", "field_id": "p4_pug_asdep_1",
            "type": "text", "required": True, "topleft": [191.68, 327.36, 213.66, 340.01], "pdf": [191.68, 501.99, 100.0, 14],
            "note": "Nama Asdep pada pembuka narasi Pengarusutamaan Gender"
        },
        {
            "no": 61, "page": 4, "placeholder": "PUG : kesenjangan kebijakan bidang ……", "field_id": "p4_pug_bidang",
            "type": "text", "required": True, "topleft": [390.23, 384.28, 412.22, 396.93], "pdf": [390.23, 445.07, 100.0, 14],
            "note": "Bidang kebijakan pada narasi kesenjangan gender"
        },
        {
            "no": 62, "page": 4, "placeholder": "PUG : antara lain …… yang dipengaruhi", "field_id": "p4_pug_kesenjangan",
            "type": "text", "required": True, "topleft": [474.21, 384.28, 496.19, 396.93], "pdf": [474.21, 445.07, 100.0, 14],
            "note": "Bentuk kesenjangan gender yang teridentifikasi"
        },
        {
            "no": 63, "page": 4, "placeholder": "PUG : dipengaruhi oleh faktor ……. .", "field_id": "p4_pug_faktor",
            "type": "text", "required": True, "topleft": [212.39, 403.25, 237.42, 415.9], "pdf": [212.39, 426.1, 150.0, 14],
            "note": "Faktor penyebab kesenjangan gender"
        },
        {
            "no": 64, "page": 4, "placeholder": "PUG : melalui Asisten Deputi …… melakukan intervensi", "field_id": "p4_pug_asdep_2",
            "type": "text", "required": True, "topleft": [207.06, 422.22, 229.04, 434.87], "pdf": [207.06, 407.13, 100.0, 14],
            "note": "Nama Asdep pelaksana intervensi PUG"
        },
        {
            "no": 65, "page": 4, "placeholder": "PUG : melakukan intervensi melalui …..", "field_id": "p4_pug_intervensi",
            "type": "text", "required": True, "topleft": [379.28, 422.22, 396.38, 434.87], "pdf": [379.28, 407.13, 140.0, 14],
            "note": "Bentuk intervensi responsif gender"
        },
        {
            "no": 66, "page": 4, "placeholder": "MR : Asisten Deputi …… risiko potensial", "field_id": "p4_mr_asdep",
            "type": "text", "required": True, "topleft": [434.59, 583.69, 456.58, 596.33], "pdf": [434.59, 245.67, 80.0, 14],
            "note": "Nama Asisten Deputi pada narasi Manajemen Risiko"
        },
        {
            "no": 67, "page": 4, "placeholder": "Penerima Manfaat 1. Internal: ……", "field_id": "p4_manfaat_internal",
            "type": "text", "required": True, "topleft": [110.25, 722.5, 132.23, 735.15], "pdf": [110.25, 106.85, 410.0, 14],
            "note": "Penerima manfaat internal Kemenko PMK"
        },
        {
            "no": 68, "page": 4, "placeholder": "Penerima Manfaat 2. Eksternal: ……", "field_id": "p4_manfaat_eksternal",
            "type": "text", "required": True, "topleft": [110.25, 747.47, 132.23, 760.12], "pdf": [110.25, 81.88, 410.0, 14],
            "note": "Penerima manfaat eksternal (K/L, Pemda, masyarakat)"
        },

        # PAGE 5 (Lanjutan Manfaat, RAK, Tahap 1 Identifikasi)
        {
            "no": 69, "page": 5, "placeholder": "Penerima Manfaat 3. …… dst", "field_id": "p5_manfaat_lainnya",
            "type": "text", "required": False, "topleft": [110.25, 72.0, 149.95, 84.65], "pdf": [110.25, 757.35, 410.0, 14],
            "note": "Penerima manfaat poin 3 dan seterusnya"
        },
        {
            "no": 70, "page": 5, "placeholder": "Metode Pelaksanaan dalam menghasilkan …… output", "field_id": "p5_metode_volume",
            "type": "number", "required": True, "topleft": [393.91, 229.17, 415.9, 241.82], "pdf": [393.91, 600.18, 30.0, 14],
            "note": "Volume output pada metode pelaksanaan"
        },
        {
            "no": 71, "page": 5, "placeholder": "RAK 1: …… (Swakelola/Kontraktual)", "field_id": "p5_metode_rak1",
            "type": "text", "required": True, "topleft": [114.75, 273.12, 174.61, 285.77], "pdf": [114.75, 556.23, 400.0, 14],
            "note": "Metode pelaksanaan RAK 1 (swakelola/kontraktual)"
        },
        {
            "no": 72, "page": 5, "placeholder": "RAK 2: ……", "field_id": "p5_metode_rak2",
            "type": "text", "required": False, "topleft": [93.0, 292.09, 174.61, 304.74], "pdf": [93.0, 537.26, 400.0, 14],
            "note": "Metode pelaksanaan RAK 2"
        },
        {
            "no": 73, "page": 5, "placeholder": "RAK 3: …… dst", "field_id": "p5_metode_rak3",
            "type": "text", "required": False, "topleft": [93.0, 311.06, 192.33, 323.71], "pdf": [93.0, 518.29, 400.0, 14],
            "note": "Metode pelaksanaan RAK 3"
        },
        {
            "no": 74, "page": 5, "placeholder": "Rekomendasi Alternatif Kebijakan …… tahun ……", "field_id": "p5_tahapan_tahun",
            "type": "year", "required": True, "topleft": [434.33, 367.99, 456.32, 380.63], "pdf": [434.33, 461.37, 50.0, 14],
            "note": "Tahun pelaksanaan tahapan kegiatan"
        },
        {
            "no": 75, "page": 5, "placeholder": "Pendahuluan Tahap 1: Identifikasi Permasalahan", "field_id": "p5_t1_pendahuluan",
            "type": "textarea", "required": True, "topleft": [114.75, 473.26, 523.23, 689.56], "pdf": [114.75, 152.44, 408.0, 216],
            "note": "Kalimat narasi pendahuluan Tahap 1 (Identifikasi Permasalahan)"
        },
        {
            "no": 76, "page": 5, "placeholder": "1. Rapat Koordinasi Identifikasi Permasalahan ….", "field_id": "p5_t1_kegiatan_judul",
            "type": "text", "required": True, "topleft": [342.25, 753.1, 359.35, 765.74], "pdf": [111.0, 76.26, 410.0, 14],
            "note": "Nama/tema kegiatan Rapat Koordinasi Identifikasi"
        },

        # PAGE 6 (Tahap 1 Detail & Tahap 2 Sinkronisasi)
        {
            "no": 77, "page": 6, "placeholder": "T1 Lokasi : Prov … Kab/Kota …", "field_id": "p6_t1_lokasi",
            "type": "text", "required": True, "topleft": [216.59, 72.0, 289.91, 84.65], "pdf": [150.0, 757.35, 370.0, 14],
            "note": "Lokasi pelaksanaan rapat Identifikasi Permasalahan"
        },
        {
            "no": 78, "page": 6, "placeholder": "T1 Waktu : Bulan … Tahun …", "field_id": "p6_t1_waktu",
            "type": "text", "required": True, "topleft": [221.07, 86.55, 279.11, 99.2], "pdf": [150.0, 742.8, 370.0, 14],
            "note": "Waktu pelaksanaan rapat Identifikasi Permasalahan"
        },
        {
            "no": 79, "page": 6, "placeholder": "T1 Peserta : …. (K/L terkait / peserta rapat)", "field_id": "p6_t1_peserta",
            "type": "text", "required": True, "topleft": [220.86, 101.09, 442.07, 113.74], "pdf": [150.0, 728.26, 370.0, 14],
            "note": "Instansi peserta rapat Identifikasi Permasalahan"
        },
        {
            "no": 80, "page": 6, "placeholder": "T1 Jumlah Peserta : … orang", "field_id": "p6_t1_jumlah_peserta",
            "type": "number", "required": True, "topleft": [245.25, 115.64, 267.23, 128.29], "pdf": [245.25, 713.71, 40.0, 14],
            "note": "Jumlah peserta rapat Identifikasi Permasalahan"
        },
        {
            "no": 81, "page": 6, "placeholder": "T1 Narasumber : … (ada/tidak ada)", "field_id": "p6_t1_narasumber",
            "type": "text", "required": True, "topleft": [233.69, 130.19, 307.01, 142.83], "pdf": [150.0, 699.17, 370.0, 14],
            "note": "Narasumber rapat Identifikasi Permasalahan"
        },
        {
            "no": 82, "page": 6, "placeholder": "T1 Output yang akan dicapai : ……", "field_id": "p6_t1_output",
            "type": "textarea", "required": True, "topleft": [150.0, 174.2, 523.15, 230.1], "pdf": [150.0, 611.9, 373.0, 58],
            "note": "Output yang dicapai dari kegiatan Identifikasi Permasalahan"
        },
        {
            "no": 83, "page": 6, "placeholder": "T1 Alasan pemilihan lokasi : ……", "field_id": "p6_t1_alasan_lokasi",
            "type": "text", "required": False, "topleft": [274.03, 232.4, 478.1, 244.7], "pdf": [274.03, 597.3, 250.0, 14],
            "note": "Alasan pemilihan lokasi jika di luar DKI Jakarta"
        },
        {
            "no": 84, "page": 6, "placeholder": "Pendahuluan Tahap 2: Sinkronisasi, Koordinasi dan Pengendalian", "field_id": "p6_t2_pendahuluan",
            "type": "textarea", "required": True, "topleft": [114.75, 364.2, 523.26, 521.94], "pdf": [114.75, 320.06, 408.0, 158],
            "note": "Kalimat narasi pendahuluan Tahap 2 (Sinkronisasi & Koordinasi)"
        },
        {
            "no": 85, "page": 6, "placeholder": "T2 Lokasi : Prov … Kab/Kota …", "field_id": "p6_t2_lokasi",
            "type": "text", "required": True, "topleft": [216.59, 600.03, 289.91, 612.68], "pdf": [150.0, 229.32, 370.0, 14],
            "note": "Lokasi kegiatan Sinkronisasi & Koordinasi"
        },
        {
            "no": 86, "page": 6, "placeholder": "T2 Waktu : Bulan … Tahun …", "field_id": "p6_t2_waktu",
            "type": "text", "required": True, "topleft": [221.07, 614.57, 279.11, 627.22], "pdf": [150.0, 214.78, 370.0, 14],
            "note": "Waktu kegiatan Sinkronisasi & Koordinasi"
        },
        {
            "no": 87, "page": 6, "placeholder": "T2 Peserta : …. (K/L terkait / peserta rapat)", "field_id": "p6_t2_peserta",
            "type": "text", "required": True, "topleft": [220.86, 629.12, 442.07, 641.77], "pdf": [150.0, 200.23, 370.0, 14],
            "note": "Peserta kegiatan Sinkronisasi & Koordinasi"
        },
        {
            "no": 88, "page": 6, "placeholder": "T2 Jumlah Peserta : … orang", "field_id": "p6_t2_jumlah_peserta",
            "type": "number", "required": True, "topleft": [245.25, 644.0, 267.23, 656.65], "pdf": [245.25, 185.35, 40.0, 14],
            "note": "Jumlah peserta kegiatan Sinkronisasi & Koordinasi"
        },
        {
            "no": 89, "page": 6, "placeholder": "T2 Narasumber : … (ada/tidak ada)", "field_id": "p6_t2_narasumber",
            "type": "text", "required": True, "topleft": [233.69, 658.21, 307.01, 670.86], "pdf": [150.0, 171.14, 370.0, 14],
            "note": "Narasumber kegiatan Sinkronisasi & Koordinasi"
        },
        {
            "no": 90, "page": 6, "placeholder": "T2 Output yang akan dicapai : ……", "field_id": "p6_t2_output",
            "type": "textarea", "required": True, "topleft": [150.0, 672.76, 523.15, 729.05], "pdf": [150.0, 112.95, 373.0, 58],
            "note": "Output kegiatan Sinkronisasi & Koordinasi"
        },
        {
            "no": 91, "page": 6, "placeholder": "T2 Alasan pemilihan lokasi : ……", "field_id": "p6_t2_alasan_lokasi",
            "type": "text", "required": False, "topleft": [274.03, 730.94, 478.1, 743.59], "pdf": [274.03, 98.41, 250.0, 14],
            "note": "Alasan pemilihan lokasi jika di luar DKI"
        },

        # PAGE 7 (Tahap 3 Monev & Tahap 4 Rekomendasi)
        {
            "no": 92, "page": 7, "placeholder": "Pendahuluan Tahap 3: Monitoring dan Evaluasi", "field_id": "p7_t3_pendahuluan",
            "type": "textarea", "required": True, "topleft": [114.75, 203.82, 523.25, 332.84], "pdf": [114.75, 509.16, 408.0, 130],
            "note": "Kalimat narasi pendahuluan Tahap 3 (Monitoring dan Evaluasi)"
        },
        {
            "no": 93, "page": 7, "placeholder": "T3 Lokasi : Prov … Kab/Kota …", "field_id": "p7_t3_lokasi",
            "type": "text", "required": True, "topleft": [216.59, 454.56, 289.91, 467.21], "pdf": [150.0, 374.79, 370.0, 14],
            "note": "Lokasi kegiatan Monitoring dan Evaluasi"
        },
        {
            "no": 94, "page": 7, "placeholder": "T3 Waktu : Bulan … Tahun …", "field_id": "p7_t3_waktu",
            "type": "text", "required": True, "topleft": [221.07, 469.11, 279.11, 481.76], "pdf": [150.0, 360.24, 370.0, 14],
            "note": "Waktu kegiatan Monitoring dan Evaluasi"
        },
        {
            "no": 95, "page": 7, "placeholder": "T3 Peserta : …. (K/L terkait / peserta)", "field_id": "p7_t3_peserta",
            "type": "text", "required": True, "topleft": [220.86, 483.66, 442.07, 496.31], "pdf": [150.0, 345.69, 370.0, 14],
            "note": "Peserta kegiatan Monitoring dan Evaluasi"
        },
        {
            "no": 96, "page": 7, "placeholder": "T3 Jumlah Peserta : … orang", "field_id": "p7_t3_jumlah_peserta",
            "type": "number", "required": True, "topleft": [245.25, 498.6, 267.23, 511.25], "pdf": [245.25, 330.75, 40.0, 14],
            "note": "Jumlah peserta kegiatan Monitoring dan Evaluasi"
        },
        {
            "no": 97, "page": 7, "placeholder": "T3 Narasumber : … (ada/tidak ada)", "field_id": "p7_t3_narasumber",
            "type": "text", "required": True, "topleft": [233.69, 512.75, 307.01, 525.4], "pdf": [150.0, 316.6, 370.0, 14],
            "note": "Narasumber kegiatan Monitoring dan Evaluasi"
        },
        {
            "no": 98, "page": 7, "placeholder": "T3 Output yang akan dicapai : ……", "field_id": "p7_t3_output",
            "type": "textarea", "required": True, "topleft": [150.0, 527.3, 522.89, 569.04], "pdf": [150.0, 272.96, 373.0, 42],
            "note": "Output kegiatan Monitoring dan Evaluasi"
        },
        {
            "no": 99, "page": 7, "placeholder": "T3 Alasan pemilihan lokasi : ……", "field_id": "p7_t3_alasan_lokasi",
            "type": "text", "required": False, "topleft": [274.03, 570.93, 478.1, 583.58], "pdf": [274.03, 258.42, 250.0, 14],
            "note": "Alasan pemilihan lokasi jika di luar DKI"
        },
        {
            "no": 100, "page": 7, "placeholder": "Pendahuluan Tahap 4: Penyusunan Rekomendasi (Bagian Hal 7)", "field_id": "p7_t4_pendahuluan_p1",
            "type": "textarea", "required": True, "topleft": [114.75, 717.3, 523.22, 759.05], "pdf": [114.75, 82.95, 408.0, 42],
            "note": "Paragraf awal pendahuluan Tahap 4 di halaman 7"
        },

        # PAGE 8 (Tahap 4 Detail & Anggaran Output & Jadwal Header)
        {
            "no": 101, "page": 8, "placeholder": "Pendahuluan Tahap 4 (Lanjutan Hal 8)", "field_id": "p8_t4_pendahuluan_p2",
            "type": "textarea", "required": True, "topleft": [114.75, 72.0, 523.26, 157.38], "pdf": [114.75, 684.62, 408.0, 85],
            "note": "Lanjutan narasi pendahuluan Tahap 4 di halaman 8"
        },
        {
            "no": 102, "page": 8, "placeholder": "T4 Lokasi : Prov … Kab/Kota …", "field_id": "p8_t4_lokasi",
            "type": "text", "required": True, "topleft": [216.59, 279.1, 289.91, 291.75], "pdf": [150.0, 550.25, 370.0, 14],
            "note": "Lokasi kegiatan Penyusunan Rekomendasi Kebijakan"
        },
        {
            "no": 103, "page": 8, "placeholder": "T4 Waktu : Bulan … Tahun …", "field_id": "p8_t4_waktu",
            "type": "text", "required": True, "topleft": [221.07, 293.65, 279.11, 306.3], "pdf": [150.0, 535.7, 370.0, 14],
            "note": "Waktu kegiatan Penyusunan Rekomendasi Kebijakan"
        },
        {
            "no": 104, "page": 8, "placeholder": "T4 Peserta : …. (K/L terkait / peserta)", "field_id": "p8_t4_peserta",
            "type": "text", "required": True, "topleft": [220.86, 308.19, 442.07, 320.84], "pdf": [150.0, 521.16, 370.0, 14],
            "note": "Peserta kegiatan Penyusunan Rekomendasi Kebijakan"
        },
        {
            "no": 105, "page": 8, "placeholder": "T4 Jumlah Peserta : … orang", "field_id": "p8_t4_jumlah_peserta",
            "type": "number", "required": True, "topleft": [245.25, 323.1, 267.23, 335.75], "pdf": [245.25, 506.25, 40.0, 14],
            "note": "Jumlah peserta kegiatan Penyusunan Rekomendasi Kebijakan"
        },
        {
            "no": 106, "page": 8, "placeholder": "T4 Narasumber : … (ada/tidak ada)", "field_id": "p8_t4_narasumber",
            "type": "text", "required": True, "topleft": [233.69, 337.29, 307.01, 349.94], "pdf": [150.0, 492.06, 370.0, 14],
            "note": "Narasumber kegiatan Penyusunan Rekomendasi Kebijakan"
        },
        {
            "no": 107, "page": 8, "placeholder": "T4 Output yang akan dicapai : ……", "field_id": "p8_t4_output",
            "type": "textarea", "required": True, "topleft": [150.0, 351.83, 523.15, 408.12], "pdf": [150.0, 433.88, 373.0, 58],
            "note": "Output kegiatan Penyusunan Rekomendasi Kebijakan"
        },
        {
            "no": 108, "page": 8, "placeholder": "T4 Alasan pemilihan lokasi : ……", "field_id": "p8_t4_alasan_lokasi",
            "type": "text", "required": False, "topleft": [274.03, 410.02, 478.1, 422.67], "pdf": [274.03, 419.33, 250.0, 14],
            "note": "Alasan pemilihan lokasi jika di luar DKI"
        },
        {
            "no": 109, "page": 8, "placeholder": "Anggaran yang dibutuhkan ... adalah sebesar Rp.xxxxx", "field_id": "p8_anggaran_output",
            "type": "currency", "required": True, "topleft": [454.17, 494.75, 502.44, 507.4], "pdf": [454.17, 334.6, 120.0, 14],
            "note": "Besaran nominal anggaran untuk menghasilkan output (format Rp)"
        },
        {
            "no": 110, "page": 8, "placeholder": "Tabel Jadwal RAK (Header & Row)", "field_id": "p8_jadwal_rak",
            "type": "schedule-row", "required": True, "topleft": [248.25, 683.97, 522.75, 707.22], "pdf": [248.25, 134.78, 274.5, 23.25],
            "note": "Baris bulan RAK 1 pada tabel jadwal halaman 8"
        },

        # PAGE 9 (Jadwal Lanjutan & Biaya & Pengesahan)
        {
            "no": 111, "page": 9, "placeholder": "Tabel Jadwal Kegiatan 12 Bulan (Subkomponen 1 & 2)", "field_id": "p9_jadwal_matrix",
            "type": "schedule-matrix", "required": True, "topleft": [248.25, 154.5, 522.75, 558.0], "pdf": [248.25, 284.0, 274.5, 403.5],
            "note": "Matriks 12 bulan untuk 4 subkomponen (Identifikasi, Sinkronisasi, Monev, Rekomendasi)"
        },
        {
            "no": 112, "page": 9, "placeholder": "D. Biaya: Asisten Deputi ……", "field_id": "p9_biaya_asdep",
            "type": "text", "required": True, "topleft": [157.93, 605.32, 179.91, 617.96], "pdf": [157.93, 224.04, 120.0, 14],
            "note": "Nama Asdep pada narasi biaya"
        },
        {
            "no": 113, "page": 9, "placeholder": "Tahun Anggaran ……", "field_id": "p9_biaya_tahun",
            "type": "year", "required": True, "topleft": [318.2, 605.32, 340.19, 617.96], "pdf": [318.2, 224.04, 50.0, 14],
            "note": "Tahun anggaran pada narasi biaya"
        },
        {
            "no": 114, "page": 9, "placeholder": "untuk menghasilkan …… output", "field_id": "p9_biaya_volume",
            "type": "number", "required": True, "topleft": [462.07, 605.32, 492.35, 617.96], "pdf": [462.07, 224.04, 30.0, 14],
            "note": "Volume output pada narasi biaya"
        },
        {
            "no": 115, "page": 9, "placeholder": "memerlukan anggaran sebesar …… (narasi rupiah)", "field_id": "p9_biaya_total_terbilang",
            "type": "text", "required": True, "topleft": [227.2, 617.96, 319.45, 630.61], "pdf": [227.2, 211.39, 290.0, 14],
            "note": "Anggaran rupiah terbilang naratif"
        },
        {
            "no": 116, "page": 9, "placeholder": "Jakarta, …… (Tanggal Dokumen)", "field_id": "p9_ttd_tanggal",
            "type": "date", "required": True, "topleft": [417.6, 638.61, 439.58, 651.26], "pdf": [417.6, 190.74, 120.0, 14],
            "note": "Tanggal penetapan/pengesahan dokumen (misal: 15 Januari 2026)"
        },
        {
            "no": 117, "page": 9, "placeholder": "Asisten Deputi ……, (Jabatan TTD)", "field_id": "p9_ttd_asdep",
            "type": "text", "required": True, "topleft": [431.96, 653.16, 453.94, 665.81], "pdf": [431.96, 176.19, 130.0, 14],
            "note": "Nama jabatan Asisten Deputi pada blok tanda tangan"
        },
        {
            "no": 118, "page": 9, "placeholder": "…… (Nama Pejabat TTD)", "field_id": "p9_ttd_nama",
            "type": "text", "required": True, "topleft": [396.0, 724.62, 417.98, 737.27], "pdf": [358.0, 104.73, 190.0, 14],
            "note": "Nama pejabat Asisten Deputi yang menandatangani"
        },
        {
            "no": 119, "page": 9, "placeholder": "NIP …… (NIP Pejabat TTD)", "field_id": "p9_ttd_nip",
            "type": "text", "required": True, "topleft": [396.0, 749.6, 414.32, 762.25], "pdf": [396.0, 79.75, 160.0, 14],
            "note": "Nomor Induk Pegawai (NIP) pejabat pengesah"
        },

        # PAGE 10 (Lampiran I: Gender Analysis Pathway)
        {
            "no": 120, "page": 10, "placeholder": "Langkah 1: Identifikasi Isu dan Masalah Gender", "field_id": "p10_gap_langkah1",
            "type": "textarea", "required": True, "topleft": [70.5, 153.5, 185.5, 642.0], "pdf": [73.0, 200.0, 110.0, 485.0],
            "note": "Identifikasi kesenjangan gender, data terpilah, bentuk isu gender"
        },
        {
            "no": 121, "page": 10, "placeholder": "Langkah 2: Identifikasi Faktor Penyebab", "field_id": "p10_gap_langkah2",
            "type": "textarea", "required": True, "topleft": [185.5, 153.5, 310.5, 642.0], "pdf": [188.0, 200.0, 120.0, 485.0],
            "note": "Faktor penyebab ranah pemerintah, masyarakat, keluarga, dll"
        },
        {
            "no": 122, "page": 10, "placeholder": "Langkah 3: Penyusunan Rencana Aksi Responsif Gender", "field_id": "p10_gap_langkah3",
            "type": "textarea", "required": True, "topleft": [310.5, 153.5, 441.5, 642.0], "pdf": [313.0, 200.0, 126.0, 485.0],
            "note": "Rencana aksi responsif gender sesuai tusi Kemenko PMK"
        },
        {
            "no": 123, "page": 10, "placeholder": "Langkah 4: Identifikasi Pemangku Kepentingan (K/L/PD)", "field_id": "p10_gap_langkah4",
            "type": "textarea", "required": True, "topleft": [441.5, 153.5, 555.5, 642.0], "pdf": [444.0, 200.0, 109.0, 485.0],
            "note": "Pihak internal dan eksternal pelaksana renaksi"
        },

        # PAGE 11-13 (Lampiran II: Manajemen Risiko)
        {
            "no": 124, "page": 11, "placeholder": "Tabel Profil Risiko Baris 1 (Administrasi-Tata Kelola UKE)", "field_id": "p11_risiko_row_1",
            "type": "risk-row", "required": True, "topleft": [1.5, 137.0, 585.0, 185.0], "pdf": [1.5, 657.0, 583.5, 48.0],
            "note": "Profil Risiko 1: Lingkup Administrasi/Tata Kelola internal UKE"
        },
        {
            "no": 125, "page": 11, "placeholder": "Tabel Profil Risiko Baris 2 (Substansi Program/IKU/PK)", "field_id": "p11_risiko_row_2",
            "type": "risk-row", "required": True, "topleft": [1.5, 185.0, 585.0, 237.0], "pdf": [1.5, 605.0, 583.5, 52.0],
            "note": "Profil Risiko 2: Lingkup Substansi program/IKU/PK"
        },
        {
            "no": 126, "page": 11, "placeholder": "Tabel Profil Risiko Baris 3 (MRPN/PKPN)", "field_id": "p11_risiko_row_3",
            "type": "risk-row", "required": True, "topleft": [1.5, 237.0, 585.0, 298.0], "pdf": [1.5, 544.0, 583.5, 61.0],
            "note": "Profil Risiko 3: Lingkup MRPN/PKPN prioritas presiden"
        }
    ]

    # Write FIELD-INVENTORY.md
    with open('FIELD-INVENTORY.md', 'w', encoding='utf-8') as f:
        f.write("# FIELD INVENTORY: TEMPLATE KERANGKA ACUAN KEGIATAN (KAK)\n\n")
        f.write("Total Halaman Dokumen: 13 Halaman\n")
        f.write("Format Kertas: A4 (596.0 x 842.0 pt)\n")
        f.write("Total Field Teridentifikasi: 126 Field / Elemen Input\n\n")
        f.write("| No | Page | Placeholder Asli | Field ID | Type | Required | Koordinat PDF (x, y, w, h) | Keterangan |\n")
        f.write("|---|---|---|---|---|---|---|---|\n")
        for item in inventory_items:
            req_str = "Ya *" if item['required'] else "Opsional"
            pdf_c = f"x={item['pdf'][0]}, y={item['pdf'][1]}, w={item['pdf'][2]}, h={item['pdf'][3]}"
            f.write(f"| {item['no']} | {item['page']} | `{item['placeholder']}` | `{item['field_id']}` | {item['type']} | {req_str} | `{pdf_c}` | {item['note']} |\n")

    # Write FIELD-MAPPING.md
    with open('FIELD-MAPPING.md', 'w', encoding='utf-8') as f:
        f.write("# FIELD MAPPING & ARSITEKTUR KAK\n\n")
        f.write("Dokumen ini memetakan teks template asli, Field ID, komponen UI input, dan perilaku overlay PDF.\n\n")
        f.write("## 1. Sinkronisasi Data Lintas Halaman\n")
        f.write("Beberapa data yang muncul berulang kali diinput **SATU KALI** oleh pengguna pada Wizard Form dan secara otomatis disinkronkan ke seluruh 13 halaman:\n\n")
        f.write("- `asisten_deputi`: Halaman 1 (Judul), Halaman 2 (Eselon II, Tusi), Halaman 3 (RPJMN, RO), Halaman 4 (RB, PUG, MR), Halaman 5 (Tahapan), Halaman 9 (Biaya & Tanda Tangan).\n")
        f.write("- `tahun_anggaran`: Halaman 1 (Atas & Bawah), Halaman 2, Halaman 3, Halaman 5, Halaman 6, Halaman 7, Halaman 8, Halaman 9.\n")
        f.write("- `deputi_bidang`: Halaman 1 (Bawah), Halaman 2 (Tusi), Halaman 3 (Program Prioritas).\n")
        f.write("- `ro_nama` & `ro_kode`: Halaman 1, Halaman 2, Halaman 3, Halaman 5.\n")
        f.write("- `kro_nama` & `kro_kode`: Halaman 1, Halaman 2.\n")
        f.write("- `kegiatan_nama` & `kegiatan_kode`: Halaman 1, Halaman 2.\n\n")
        
        f.write("## 2. Pemetaan Wizard Form (16 Tahapan)\n\n")
        
        steps = [
            ("Step 1", "Identitas Dokumen & Sampul", ["cover_asisten_deputi", "cover_tahun", "cover_deputi_bidang"]),
            ("Step 2", "Klasifikasi & Rincian Output", ["cover_kegiatan_nama", "cover_kegiatan_kode", "cover_kro_nama", "cover_kro_kode", "cover_ro_nama", "cover_ro_kode", "p2_volume_ro"]),
            ("Step 3", "Sasaran & Indikator Kinerja", ["p2_sasaran_program_bidang", "p2_ikp_bidang", "p2_sasaran_kegiatan_bidang", "p2_sasaran_kegiatan_kode", "p2_indikator_ro"]),
            ("Step 4", "Dasar Hukum", ["p2_dasar_hukum_ro", "p2_dasar_hukum_1", "p2_dasar_hukum_2", "p2_dasar_hukum_3"]),
            ("Step 5", "Tugas dan Fungsi (Tusi Kemenko PMK)", ["p2_perpres_nomor", "p2_perpres_tentang", "p2_urusan_bidang", "p2_deputi_bidang_tusi", "p2_fungsi_deputi", "p2_fungsi_deputi_bidang", "p2_asdep_tusi", "p2_asdep_fungsi", "p2_asdep_koordinasi", "p3_kl_koordinasi"]),
            ("Step 6", "Keterkaitan RPJMN & RKP", ["p3_asdep_program_kerja", "p3_pn_nomor", "p3_pn_nama", "p3_sasaran_pn_nomor", "p3_sasaran_pn_nama", "p3_rkp_tahun", "p3_pp_nomor", "p3_pp_nama", "p3_intervensi_bidang", "p3_intervensi_fokus", "p3_indikator_tahun", "p3_indikator_rpjmn_list"]),
            ("Step 7", "Data Dukung & Gap Analysis", ["p3_renstra_periode", "p3_gap_analysis_narasi", "p3_program_prioritas_deputi", "p3_program_prioritas_uraian", "p3_ro_1_fokus_tujuan", "p3_ro_2_fokus_tujuan", "p3_ro_3_fokus_tujuan"]),
            ("Step 8", "Reformasi Birokrasi (RB) & Gender (PUG)", ["p4_rb_asdep", "p4_rb_indikator_list", "p4_pug_asdep_1", "p4_pug_bidang", "p4_pug_kesenjangan", "p4_pug_faktor", "p4_pug_asdep_2", "p4_pug_intervensi", "p4_mr_asdep"]),
            ("Step 9", "Penerima Manfaat & Strategi Pelaksanaan", ["p4_manfaat_internal", "p4_manfaat_eksternal", "p5_manfaat_lainnya", "p5_metode_volume", "p5_metode_rak1", "p5_metode_rak2", "p5_metode_rak3", "p5_tahapan_tahun"]),
            ("Step 10", "Tahap 1: Identifikasi Permasalahan", ["p5_t1_pendahuluan", "p5_t1_kegiatan_judul", "p6_t1_lokasi", "p6_t1_waktu", "p6_t1_peserta", "p6_t1_jumlah_peserta", "p6_t1_narasumber", "p6_t1_output", "p6_t1_alasan_lokasi"]),
            ("Step 11", "Tahap 2: Sinkronisasi, Koordinasi & Pengendalian", ["p6_t2_pendahuluan", "p6_t2_lokasi", "p6_t2_waktu", "p6_t2_peserta", "p6_t2_jumlah_peserta", "p6_t2_narasumber", "p6_t2_output", "p6_t2_alasan_lokasi"]),
            ("Step 12", "Tahap 3: Monitoring dan Evaluasi", ["p7_t3_pendahuluan", "p7_t3_lokasi", "p7_t3_waktu", "p7_t3_peserta", "p7_t3_jumlah_peserta", "p7_t3_narasumber", "p7_t3_output", "p7_t3_alasan_lokasi"]),
            ("Step 13", "Tahap 4: Penyusunan Rekomendasi Kebijakan", ["p7_t4_pendahuluan_p1", "p8_t4_pendahuluan_p2", "p8_t4_lokasi", "p8_t4_waktu", "p8_t4_peserta", "p8_t4_jumlah_peserta", "p8_t4_narasumber", "p8_t4_output", "p8_t4_alasan_lokasi", "p8_anggaran_output"]),
            ("Step 14", "Jadwal Pelaksanaan (12 Bulan) & Biaya", ["p8_jadwal_rak", "p9_jadwal_matrix", "p9_biaya_asdep", "p9_biaya_tahun", "p9_biaya_volume", "p9_biaya_total_terbilang", "p9_ttd_tanggal", "p9_ttd_asdep", "p9_ttd_nama", "p9_ttd_nip"]),
            ("Step 15", "Lampiran I: Gender Analysis Pathway (GAP)", ["p10_gap_langkah1", "p10_gap_langkah2", "p10_gap_langkah3", "p10_gap_langkah4"]),
            ("Step 16", "Lampiran II: Manajemen Risiko & Review", ["p11_risiko_row_1", "p11_risiko_row_2", "p11_risiko_row_3"])
        ]
        
        for step_title, step_desc, f_ids in steps:
            f.write(f"### {step_title}: {step_desc}\n")
            f.write(f"Field yang terlibat: `{', '.join(f_ids)}`\n\n")

    # Write AMBIGUOUS-FIELDS.md
    with open('AMBIGUOUS-FIELDS.md', 'w', encoding='utf-8') as f:
        f.write("# AMBIGUOUS FIELDS & PENETAPAN SOLUSI\n\n")
        f.write("Sesuai instruksi Bagian 37, berikut inventarisasi teks/placeholder yang ambigu beserta kemungkinan makna dan keputusan teknisnya:\n\n")

        ambiguous = [
            {
                "page": 2,
                "text": "Peraturan Presiden Nomor …… (1) tentang …… (2) s.d. (9) dan di Hal 3 s.d. (15)",
                "meaning": "Angka dalam tanda kurung (1), (2), (3)...(15) adalah nomor penanda internal/template buatan pembuat format untuk memandu pengguna.",
                "field_id": "p2_perpres_nomor, p2_perpres_tentang, p2_urusan_bidang, p2_deputi_bidang_tusi, p2_fungsi_deputi, dst.",
                "reason": "Sesuai aturan Bagian 7 spesifikasi, marker '(1)', '(2)', dst. HARUS DIHAPUS pada PDF final output. Solusi: Overlay menutupi area marker dengan background putih dan mencetak nilai input pengguna tanpa tanda penomoran."
            },
            {
                "page": 4,
                "text": "Kotak kuning berisi 'Catatan narasi terkait RB yang disusun pada penjelasan pelaksanaan tugas fungsi UKE harus memuat: ● regulasi... ● kondisi capaian...'",
                "meaning": "Panduan penyusunan narasi Reformasi Birokrasi dari Kemenko PMK.",
                "field_id": "p4_rb_indikator_list",
                "reason": "Teks ini bukan isi dokumen final melainkan petunjuk teknis bagi penyusun. Pada UI form ditampilkan sebagai 'Petunjuk Penyusunan RB', dan area template di-overlay dengan narasi RB yang disusun pengguna atau teks default profesional tanpa kotak kuning kotor."
            },
            {
                "page": "5, 6, 7, 8",
                "text": "'Buat kalimat pendahuluan adapun seperti contoh berikut' diikuti teks paragraf contoh",
                "meaning": "Teks panduan dan contoh narasi tahapan kegiatan (Identifikasi, Sinkronisasi, Monev, Rekomendasi).",
                "field_id": "p5_t1_pendahuluan, p6_t2_pendahuluan, p7_t3_pendahuluan, p7_t4_pendahuluan_p1, p8_t4_pendahuluan_p2",
                "reason": "Teks 'Buat kalimat pendahuluan adapun seperti contoh berikut' adalah instruksi template. Pada PDF output, teks instruksi ini harus dihilangkan, dan digantikan oleh narasi pendahuluan yang bersih (baik menggunakan contoh default atau teks kustom pengguna)."
            },
            {
                "page": 8,
                "text": "Anggaran yang dibutuhkan untuk menghasilkan output ini adalah sebesar Rp.xxxxx vs Halaman 9 sebesar …… (narasi rupiah)",
                "meaning": "Halaman 8 mencantumkan nominal angka (misal Rp 150.000.000), halaman 9 mencantumkan angka beserta terbilang naratif (misal Rp 150.000.000,- (Seratus Lima Puluh Juta Rupiah)).",
                "field_id": "p8_anggaran_output & p9_biaya_total_terbilang",
                "reason": "Aplikasi menyediakan generator terbilang otomatis Bahasa Indonesia: ketika pengguna memasukkan angka nominal di field anggaran, sistem secara otomatis mengonversinya menjadi teks terbilang yang tepat."
            },
            {
                "page": 10,
                "text": "Tabel Lampiran I (Gender Analysis Pathway) berisi panduan dan contoh di bawah header 4 kolom",
                "meaning": "Template memuat penjelasan cara mengisi 4 langkah GAP beserta contoh pengisian pada industri kayu/fashion.",
                "field_id": "p10_gap_langkah1, p10_gap_langkah2, p10_gap_langkah3, p10_gap_langkah4",
                "reason": "Empat langkah GAP diisi pengguna secara terstruktur pada Form (Langkah 1, 2, 3, 4). Pada output PDF, area isi panduan/contoh di-overlay dengan data input pengguna yang rapi sesuai batas kolom tabel asli tanpa mengubah garis dan header tabel."
            },
            {
                "page": 11,
                "text": "Gambar tabel spreadsheet Lampiran II (Manajemen Risiko) memiliki 3 baris dengan teks merah 'Contoh ...'",
                "meaning": "Screenshot tabel contoh profil risiko yang dimasukkan oleh pembuat dokumen.",
                "field_id": "p11_risiko_row_1, p11_risiko_row_2, p11_risiko_row_3",
                "reason": "Pengguna dapat menginput atau mengedit 3 baris risiko (Lingkup Administrasi, Substansi, MRPN/PKPN). Sistem melakukan overlay teks rapi di atas baris tabel, menutupi teks 'Contoh' berwarna merah dengan teks input resmi berwarna hitam."
            }
        ]

        for item in ambiguous:
            f.write(f"### Halaman {item['page']}: {item['text']}\n")
            f.write(f"- **Kemungkinan Makna**: {item['meaning']}\n")
            f.write(f"- **Rekomendasi Field ID**: `{item['field_id']}`\n")
            f.write(f"- **Alasan & Keputusan Teknis**: {item['reason']}\n\n")

    print('Generated FIELD-INVENTORY.md, FIELD-MAPPING.md, and AMBIGUOUS-FIELDS.md successfully!')

if __name__ == '__main__':
    generate_docs()
