import docx
import re
import xml.etree.ElementTree as ET
import zipfile
import shutil
import os

def remove_element(p):
    """Remove a paragraph element completely from document."""
    p_elem = p._element
    parent = p_elem.getparent()
    if parent is not None:
        parent.remove(p_elem)

def set_cell_text_preserve_style(cell, new_text):
    """Replace all text in a table cell while keeping the first paragraph, run formatting, and preserving any drawings."""
    if not cell.paragraphs:
        cell.text = new_text
        return
    p = cell.paragraphs[0]
    for extra_p in cell.paragraphs[1:]:
        p_elem = extra_p._p
        if p_elem.getparent() is not None:
            p_elem.getparent().remove(p_elem)
    set_para_text_preserve_style(p, new_text)

def set_para_text_preserve_style(p, new_text):
    """Replace all text in a paragraph while keeping paragraph format, first run format, and preserving any drawings/images."""
    runs = list(p.runs)
    if not runs:
        p.add_run(new_text)
        return
    
    first_text_run = None
    for r in runs:
        if not (r._r.xpath('.//w:drawing') or r._r.xpath('.//w:pict')):
            first_text_run = r
            break
            
    if first_text_run is None:
        first_text_run = p.add_run(new_text)
    else:
        first_text_run.text = new_text
        
    for r in runs:
        if r._r != first_text_run._r:
            if not (r._r.xpath('.//w:drawing') or r._r.xpath('.//w:pict')):
                r.text = ""

def prepare_template():
    source_path = "Copy of Format Digitalisasi KAK.docx"
    dest_path = "templates/template_kak.docx"
    
    doc = docx.Document(source_path)
    
    # --- 1. COVER PAGE ---
    set_para_text_preserve_style(doc.paragraphs[9], "ASISTEN DEPUTI {asisten_deputi}")
    set_para_text_preserve_style(doc.paragraphs[10], "TAHUN {tahun_anggaran}")
    set_para_text_preserve_style(doc.paragraphs[13], "REKOMENDASI ALTERNATIF KEBIJAKAN {ro_nama}")
    set_para_text_preserve_style(doc.paragraphs[14], "({ro_kode})")
    set_para_text_preserve_style(doc.paragraphs[17], "Kebijakan Bidang {kro_nama}")
    set_para_text_preserve_style(doc.paragraphs[18], "({kro_kode})")
    set_para_text_preserve_style(doc.paragraphs[21], "Kebijakan {kegiatan_nama}")
    set_para_text_preserve_style(doc.paragraphs[22], "({kegiatan_kode})")
    set_para_text_preserve_style(doc.paragraphs[29], "DEPUTI BIDANG {deputi_bidang}")
    set_para_text_preserve_style(doc.paragraphs[31], "TAHUN {tahun_anggaran}")

    # --- 2. TABLE 0 (Identitas KAK) ---
    t0 = doc.tables[0]
    set_cell_text_preserve_style(t0.rows[1].cells[2], "Asisten Deputi {asisten_deputi}")
    set_cell_text_preserve_style(t0.rows[3].cells[2], "Meningkatnya koordinasi dalam mengembangkan dan menyerasikan kebijakan Bidang {sasaran_program_bidang}")
    set_cell_text_preserve_style(t0.rows[4].cells[2], "Jumlah Rekomendasi Kebijakan di Bidang {ikp_bidang} yang dihasilkan")
    set_cell_text_preserve_style(t0.rows[5].cells[2], "Kebijakan {kegiatan_nama} ({kegiatan_kode})")
    set_cell_text_preserve_style(t0.rows[6].cells[2], "Tersusunnya Kebijakan Bidang {sasaran_kegiatan_bidang} ({sasaran_kegiatan_kode})")
    set_cell_text_preserve_style(t0.rows[7].cells[2], "Kebijakan Bidang {kro_nama} ({kro_kode})")
    set_cell_text_preserve_style(t0.rows[8].cells[2], "Rekomendasi Alternatif Kebijakan {ro_nama} ({ro_kode})")
    set_cell_text_preserve_style(t0.rows[9].cells[2], "Jumlah Rekomendasi Alternatif Kebijakan {indikator_ro}")
    set_cell_text_preserve_style(t0.rows[10].cells[2], "{volume_ro} Rekomendasi Alternatif Kebijakan")

    # --- 3. DASAR HUKUM ---
    set_para_text_preserve_style(doc.paragraphs[41], "Dasar hukum tugas fungsi dan/atau ketentuan yang terkait langsung dengan RO {dasar_hukum_ro} diantaranya yaitu:")
    set_para_text_preserve_style(doc.paragraphs[42], "1) {dasar_hukum_1}")
    set_para_text_preserve_style(doc.paragraphs[43], "2) {dasar_hukum_2}")
    set_para_text_preserve_style(doc.paragraphs[44], "3) {dasar_hukum_3}")

    # --- 4. GAMBARAN UMUM & RPJMN ---
    p48_text = (
        "Berdasarkan Peraturan Presiden Nomor {perpres_nomor} tentang {perpres_tentang} "
        "antara lain mengatur bahwa Kementerian Koordinator Bidang Pembangunan Manusia dan Kebudayaan (Kemenko PMK) "
        "mempunyai tugas dan fungsi menyelenggarakan urusan pemerintahan di bidang {urusan_bidang} "
        "untuk membantu Presiden dalam menyelenggarakan pemerintahan negara. Dalam menjalankan tugas tersebut, "
        "Deputi Bidang {deputi_bidang_tusi} menyelenggarakan fungsi {fungsi_deputi} kebijakan di bidang {fungsi_deputi_bidang}. "
        "Untuk mendukung pelaksanaan fungsi tersebut, Asisten Deputi {asdep_tusi} juga menjalankan fungsi {asdep_fungsi} "
        "dengan seluruh Kementerian/Lembaga dibawah koordinasi Asisten Deputi {asdep_koordinasi} antara lain {kl_koordinasi}."
    )
    set_para_text_preserve_style(doc.paragraphs[48], p48_text)

    p49_text = (
        "Program kerja Asisten Deputi {asdep_program_kerja} berdasarkan Rencana Pembangunan Jangka Menengah Nasional "
        "(RPJMN) 2025 – 2029 menjadi bagian dari Prioritas Nasional (PN) {pn_nomor} yaitu {pn_nama}. "
        "Sasaran utama PN {sasaran_pn_nomor} yaitu {sasaran_pn_nama}. Rencana Kerja Pemerintah (RKP) {rkp_tahun} sebagai turunan dari "
        "RPJMN 2025-2029 menyebutkan bahwa arah kebijakan dalam rangka mewujudkan sasaran pembangunan PN {pp_nomor} "
        "yaitu {pp_nama}. Intervensi kebijakan bidang {intervensi_bidang} yang menjadi fokus yaitu {intervensi_fokus}."
    )
    set_para_text_preserve_style(doc.paragraphs[49], p49_text)

    p50_text = (
        "Program dan indikator merujuk RPJMN yang dikawal di tahun {indikator_tahun} "
        "(\"Indikator berdasarkan Lampiran III RPJMN 2025-2029\") diantaranya yaitu:\n{indikator_rpjmn_list}"
    )
    set_para_text_preserve_style(doc.paragraphs[50], p50_text)

    p51_text = (
        "Adapun program dan indikator lainnya merujuk renstra Kemenko PMK {renstra_periode} yang telah ditetapkan "
        "penjelasan prioritas lainnya yang merupakan mandat peraturan (\"Indikator yang diampu melalui RO xxx dan "
        "telah tercantum dalam Perjanjian Kinerja\") yaitu {renstra_indikator_opsional}"
    )
    set_para_text_preserve_style(doc.paragraphs[51], p51_text)

    p52_text = "Data terbaru terkait program {kegiatan_nama} menyatakan bahwa {gap_analysis_narasi}"
    set_para_text_preserve_style(doc.paragraphs[52], p52_text)

    p53_text = "Asisten Deputi {asdep_tusi} memiliki program prioritas lainnya yang harus dikoordinasikan yaitu {program_prioritas_uraian}"
    set_para_text_preserve_style(doc.paragraphs[53], p53_text)

    p54_text = "Berdasarkan penjelasan di atas maka terkait dengan tugas dan fungsi Asisten Deputi {ro_rencana_asdep} , output yang akan dihasilkan pada rencana kerja tahun anggaran {tahun_anggaran} adalah:"
    set_para_text_preserve_style(doc.paragraphs[54], p54_text)

    set_para_text_preserve_style(doc.paragraphs[55], "1. {ro_1_fokus_tujuan}")
    set_para_text_preserve_style(doc.paragraphs[57], "2. {ro_2_fokus_tujuan}")
    set_para_text_preserve_style(doc.paragraphs[59], "3. {ro_3_fokus_tujuan}")
    set_para_text_preserve_style(doc.paragraphs[60], "{ro_4_opsional}")

    # --- 5. REFORMASI BIROKRASI (RB) & GENDER (PUG) & MR ---
    p63_text = "Terhadap pelaksanaan Reformasi Birokrasi (RB), Asisten Deputi {rb_asdep} mendapatkan mandat pengawalan indikator RB yaitu:\n{rb_indikator_list}"
    set_para_text_preserve_style(doc.paragraphs[63], p63_text)

    # Note: P64 - P70 are preserved intact (Catatan narasi terkait RB)

    p72_text = (
        "Asisten Deputi {pug_asdep_1} telah mengintegrasikan perspektif gender dalam pelaksanaan program dan kegiatan "
        "melalui penerapan Anggaran Responsif Gender (ARG) dan penyusunan Gender Analysis Pathway (GAP). Berdasarkan hasil analisis "
        "gender, masih terdapat kesenjangan dalam pelaksanaan kebijakan bidang {pug_bidang}, antara lain {pug_kesenjangan} "
        "yang dipengaruhi oleh faktor {pug_faktor}. Untuk mengatasi kesenjangan tersebut, Kemenko PMK melalui Asisten Deputi "
        "{pug_asdep_2} melakukan intervensi melalui {pug_intervensi}. Diharapkan program dan kegiatan yang dilaksanakan "
        "dapat mendukung terwujudnya pembangunan manusia dan kebudayaan yang inklusif dan tepat sasaran. GAP secara lebih rinci "
        "dituangkan dalam matriks sebagaimana dimuat dalam lampiran KAK ini."
    )
    set_para_text_preserve_style(doc.paragraphs[72], p72_text)

    p74_text = (
        "Dalam memastikan tercapainya output dan memaksimalkan dampak positif program, perlu dilakukan manajemen risiko untuk "
        "mencegah kegagalan, melindungi sumber daya, dan ketepatan waktu pencapaian target serta efektivitas anggaran. Risiko yang "
        "ada dalam pelaksanaan program pada Asisten Deputi {mr_asdep} yang perlu dikendalikan melalui penguatan koordinasi lintas "
        "sektor, monitoring dan evaluasi, serta penegasan peran dan tanggung jawab stakeholder."
    )
    set_para_text_preserve_style(doc.paragraphs[74], p74_text)

    # --- 6. PENERIMA MANFAAT & STRATEGI ---
    set_para_text_preserve_style(doc.paragraphs[78], "1) {manfaat_internal}")
    set_para_text_preserve_style(doc.paragraphs[79], "2) {manfaat_eksternal}")
    set_para_text_preserve_style(doc.paragraphs[80], "3) {manfaat_lainnya}")
    set_para_text_preserve_style(doc.paragraphs[83], "{manfaat_lainnya_masyarakat}")

    set_para_text_preserve_style(doc.paragraphs[87], "Metode pelaksanaan yang digunakan dalam menghasilkan {metode_volume} output Rekomendasi Alternatif Kebijakan yaitu melalui:")
    set_para_text_preserve_style(doc.paragraphs[88], "SKP 1: {metode_rak1}")
    set_para_text_preserve_style(doc.paragraphs[89], "SKP 2: {metode_rak2}")
    set_para_text_preserve_style(doc.paragraphs[90], "SKP 3: {metode_rak3}")
    set_para_text_preserve_style(doc.paragraphs[93], "Tahapan pelaksanaan kegiatan yang akan dilakukan pada tahun {tahapan_tahun}, diantaranya sebagai berikut:")

    # --- 7. TAHAP 1 - 4 ---
    set_para_text_preserve_style(doc.paragraphs[94], "2.1. Sub Komponen 051 Sinkronisasi, Koordinasi dan Pengendalian Bidang {kro_nama}")
    set_para_text_preserve_style(doc.paragraphs[97], "{t1_pendahuluan}")
    set_para_text_preserve_style(doc.paragraphs[100], "1. {t1_kegiatan_judul}")
    set_para_text_preserve_style(doc.paragraphs[101], "Lokasi : {t1_lokasi}")
    set_para_text_preserve_style(doc.paragraphs[102], "Waktu : {t1_waktu}")
    set_para_text_preserve_style(doc.paragraphs[103], "Peserta : {t1_peserta}")
    set_para_text_preserve_style(doc.paragraphs[104], "Jumlah Peserta : {t1_jumlah_peserta} orang")
    set_para_text_preserve_style(doc.paragraphs[105], "Narasumber : {t1_narasumber}")
    set_para_text_preserve_style(doc.paragraphs[106], "Output yang akan dicapai : {t1_output}")
    set_para_text_preserve_style(doc.paragraphs[107], "Alasan pemilihan lokasi : {t1_alasan_lokasi}")

    set_para_text_preserve_style(doc.paragraphs[114], "{t2_pendahuluan}")
    set_para_text_preserve_style(doc.paragraphs[117], "1. Forum koordinasi daerah")
    set_para_text_preserve_style(doc.paragraphs[118], "Lokasi : {t2_lokasi}")
    set_para_text_preserve_style(doc.paragraphs[119], "Waktu : {t2_waktu}")
    set_para_text_preserve_style(doc.paragraphs[120], "Peserta : {t2_peserta}")
    set_para_text_preserve_style(doc.paragraphs[121], "Jumlah Peserta : {t2_jumlah_peserta} orang")
    set_para_text_preserve_style(doc.paragraphs[122], "Narasumber : {t2_narasumber}")
    set_para_text_preserve_style(doc.paragraphs[123], "Output yang akan dicapai : {t2_output}")
    set_para_text_preserve_style(doc.paragraphs[124], "Alasan pemilihan lokasi : {t2_alasan_lokasi}")

    set_para_text_preserve_style(doc.paragraphs[131], "{t3_pendahuluan}")
    set_para_text_preserve_style(doc.paragraphs[134], "1. Kunjungan lapangan ke daerah untuk melakukan verifikasi langsung atas pelaksanaan program")
    set_para_text_preserve_style(doc.paragraphs[135], "Lokasi : {t3_lokasi}")
    set_para_text_preserve_style(doc.paragraphs[136], "Waktu : {t3_waktu}")
    set_para_text_preserve_style(doc.paragraphs[137], "Peserta : {t3_peserta}")
    set_para_text_preserve_style(doc.paragraphs[138], "Jumlah Peserta : {t3_jumlah_peserta} orang")
    set_para_text_preserve_style(doc.paragraphs[139], "Narasumber : {t3_narasumber}")
    set_para_text_preserve_style(doc.paragraphs[140], "Output yang akan dicapai : {t3_output}")
    set_para_text_preserve_style(doc.paragraphs[141], "Alasan pemilihan lokasi : {t3_alasan_lokasi}")

    set_para_text_preserve_style(doc.paragraphs[148], "{t4_pendahuluan_p1}\n\n{t4_pendahuluan_p2}")
    set_para_text_preserve_style(doc.paragraphs[151], "1. Rapat penyusunan rekomendasi kebijakan dengan melibatkan kementerian/lembaga teknis, pemerintah daerah, akademisi, dan masyarakat sipil")
    set_para_text_preserve_style(doc.paragraphs[152], "Lokasi : {t4_lokasi}")
    set_para_text_preserve_style(doc.paragraphs[153], "Waktu : {t4_waktu}")
    set_para_text_preserve_style(doc.paragraphs[154], "Peserta : {t4_peserta}")
    set_para_text_preserve_style(doc.paragraphs[155], "Jumlah Peserta : {t4_jumlah_peserta} orang")
    set_para_text_preserve_style(doc.paragraphs[156], "Narasumber : {t4_narasumber}")
    set_para_text_preserve_style(doc.paragraphs[157], "Output yang akan dicapai : {t4_output}")
    set_para_text_preserve_style(doc.paragraphs[158], "Alasan pemilihan lokasi : {t4_alasan_lokasi}")
    set_para_text_preserve_style(doc.paragraphs[162], "Anggaran yang dibutuhkan untuk menghasilkan output ini adalah sebesar Rp. {anggaran_output}")
    set_para_text_preserve_style(doc.paragraphs[164], "2.2. Sub Komponen 052 Sinkronisasi, Koordinasi dan Pengendalian Bidang {kro_nama}")

    # --- 8. TABLE 1 (Jadwal 12 Bulan) ---
    t1 = doc.tables[1]
    set_cell_text_preserve_style(t1.rows[2].cells[1], "RAK 1")
    set_cell_text_preserve_style(t1.rows[3].cells[1], "Subkomponen 051")
    set_cell_text_preserve_style(t1.rows[8].cells[1], "Subkomponen 052")
    # Optimize cell spacing in table 1
    for r in t1.rows:
        for cell in r.cells:
            for p in cell.paragraphs:
                p.paragraph_format.space_before = docx.shared.Pt(0)
                p.paragraph_format.space_after = docx.shared.Pt(0)
                p.paragraph_format.line_spacing = 1.15

    # --- 9. BIAYA & PENGESAHAN ---
    p171_text = (
        "Asisten Deputi {biaya_asdep} pada Tahun Anggaran {biaya_tahun} untuk menghasilkan "
        "{biaya_volume} output memerlukan anggaran sebesar {biaya_total_terbilang}."
    )
    set_para_text_preserve_style(doc.paragraphs[171], p171_text)
    set_para_text_preserve_style(doc.paragraphs[172], "Jakarta, {ttd_tanggal}")
    set_para_text_preserve_style(doc.paragraphs[173], "Asisten Deputi {ttd_asdep},")
    set_para_text_preserve_style(doc.paragraphs[177], "{ttd_nama}")
    set_para_text_preserve_style(doc.paragraphs[178], "NIP. {ttd_nip}")

    # --- 10. TABLE 2 (Lampiran I GAP) ---
    t2 = doc.tables[2]
    set_cell_text_preserve_style(t2.rows[2].cells[0], "{gap_langkah1}")
    set_cell_text_preserve_style(t2.rows[2].cells[1], "{gap_langkah2}")
    set_cell_text_preserve_style(t2.rows[2].cells[2], "{gap_langkah3}")
    set_cell_text_preserve_style(t2.rows[2].cells[3], "{gap_langkah4}")

    # --- REMOVE UNUSED INSTRUCTION / PLACEHOLDER PARAGRAPHS COMPLETELY ---
    delete_indices = [
        165, # Dan seterusnya
        160, 159, # Dst..
        150, # Sebutkan kegiatan...
        147, # Buat kalimat pendahuluan...
        144, # *akun yang diperkenankan Tahap 4
        143, 142, # Dst..
        133, # Sebutkan kegiatan...
        130, # Buat kalimat pendahuluan...
        127, # *akun yang diperkenankan Tahap 3
        126, 125, # Dst..
        116, # Sebutkan kegiatan...
        113, # Buat kalimat pendahuluan...
        110, # *akun yang diperkenankan Tahap 2
        109, 108, # Dst..
        99,  # Sebutkan kegiatan...
        96,  # Buat kalimat pendahuluan...
        91,  # Diisi dengan cara pelaksanaannya...
        84,  # Ditambahkan informasi mengenai data terpilah...
        81,  # Empty paragraph between 80 and 82
        58,  # Template placeholder for SKP 2
        56,  # Template placeholder for SKP 1
        45,  # Cantumkan Undang-undang...
    ]

    for idx in sorted(delete_indices, reverse=True):
        if idx < len(doc.paragraphs):
            remove_element(doc.paragraphs[idx])

    # Dynamic removal of any remaining instruction paragraphs
    for p in list(doc.paragraphs):
        p_text_lower = p.text.lower().strip()
        if "akun yang diperkenankan" in p_text_lower or p_text_lower in ["dst..", "dst", "dan seterusnya"]:
            remove_element(p)

    # Save to intermediate path
    temp_saved = "templates/temp_unstripped.docx"
    doc.save(temp_saved)

    # --- 11. XML CLEANUP: STRIP HIGHLIGHTS & COMMENTS & CLEAN UP EMPTY RUNS ---
    with zipfile.ZipFile(temp_saved, 'r') as zin, zipfile.ZipFile(dest_path, 'w', compression=zipfile.ZIP_DEFLATED) as zout:
        for item in zin.infolist():
            data = zin.read(item.filename)
            if item.filename == "word/document.xml":
                xml_str = data.decode("utf-8")
                # Remove all <w:highlight .../>
                xml_str = re.sub(r'<w:highlight\b[^>]*/>', '', xml_str)
                # Remove comment markers
                xml_str = re.sub(r'<w:commentRangeStart\b[^>]*/>', '', xml_str)
                xml_str = re.sub(r'<w:commentRangeEnd\b[^>]*/>', '', xml_str)
                xml_str = re.sub(r'<w:commentReference\b[^>]*/>', '', xml_str)
                data = xml_str.encode("utf-8")
            elif item.filename == "word/comments.xml":
                data = b'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:comments xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"></w:comments>'
            elif item.filename == "word/commentsExtended.xml":
                data = b'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w15:commentsEx xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml"></w15:commentsEx>'
            zout.writestr(item, data)

    if os.path.exists(temp_saved):
        os.remove(temp_saved)
    print("Final template prepared successfully at", dest_path)

if __name__ == "__main__":
    prepare_template()
