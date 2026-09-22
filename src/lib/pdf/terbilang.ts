/**
 * Mengubah angka menjadi kalimat terbilang Bahasa Indonesia.
 * Contoh: 150000000 -> "Seratus Lima Puluh Juta Rupiah"
 */
export function angkaKeTerbilang(nilai: number | string): string {
  const angkaStr = String(nilai).replace(/[^0-9]/g, '');
  if (!angkaStr || angkaStr === '0') return 'Nol Rupiah';

  const angka = parseInt(angkaStr, 10);
  if (isNaN(angka)) return '';

  const huruf = [
    '',
    'Satu',
    'Dua',
    'Tiga',
    'Empat',
    'Lima',
    'Enam',
    'Tujuh',
    'Delapan',
    'Sembilan',
    'Sepuluh',
    'Sebelas',
  ];

  function konversi(n: number): string {
    let hasil = '';
    if (n < 12) {
      hasil = huruf[n];
    } else if (n < 20) {
      hasil = konversi(n - 10) + ' Belas';
    } else if (n < 100) {
      hasil = konversi(Math.floor(n / 10)) + ' Puluh ' + konversi(n % 10);
    } else if (n < 200) {
      hasil = 'Seratus ' + konversi(n - 100);
    } else if (n < 1000) {
      hasil = konversi(Math.floor(n / 100)) + ' Ratus ' + konversi(n % 100);
    } else if (n < 2000) {
      hasil = 'Seribu ' + konversi(n - 1000);
    } else if (n < 1000000) {
      hasil = konversi(Math.floor(n / 1000)) + ' Ribu ' + konversi(n % 1000);
    } else if (n < 1000000000) {
      hasil = konversi(Math.floor(n / 1000000)) + ' Juta ' + konversi(n % 1000000);
    } else if (n < 1000000000000) {
      hasil = konversi(Math.floor(n / 1000000000)) + ' Miliar ' + konversi(n % 1000000000);
    } else if (n < 1000000000000000) {
      hasil = konversi(Math.floor(n / 1000000000000)) + ' Triliun ' + konversi(n % 1000000000000);
    }
    return hasil.trim();
  }

  const terbilangStr = konversi(angka).replace(/\s+/g, ' ').trim();
  return `${terbilangStr} Rupiah`;
}

export const numberToTerbilangRupiah = angkaKeTerbilang;

export function formatRupiah(nilai: number | string): string {
  const angkaStr = String(nilai).replace(/[^0-9]/g, '');
  if (!angkaStr) return 'Rp 0';
  const angka = parseInt(angkaStr, 10);
  if (isNaN(angka)) return 'Rp 0';
  return `Rp ${angka.toLocaleString('id-ID')}`;
}
