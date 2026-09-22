import type { KAKData } from '../types/kak';
import { defaultKAKData, emptyKAKData } from '../data/initialData';

const STORAGE_KEY = 'kak_draft_data_v1';
const STORAGE_TIME_KEY = 'kak_draft_time_v1';

export function loadSavedDraft(): { hasDraft: boolean; data: KAKData; timestamp: string | null } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const time = localStorage.getItem(STORAGE_TIME_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return {
          hasDraft: true,
          data: { ...defaultKAKData, ...parsed },
          timestamp: time,
        };
      }
    }
  } catch (e) {
    console.error('Failed to load draft from localStorage', e);
  }
  return { hasDraft: false, data: defaultKAKData, timestamp: null };
}

export function saveDraft(data: KAKData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    localStorage.setItem(STORAGE_TIME_KEY, new Date().toISOString());
  } catch (e) {
    console.error('Failed to save draft to localStorage', e);
  }
}

export function clearDraft(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_TIME_KEY);
  } catch (e) {
    console.error('Failed to clear draft from localStorage', e);
  }
}

export function exportDataToJson(data: KAKData): void {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const fileName = data.asisten_deputi
    ? `kak-data-${data.asisten_deputi.toLowerCase().replace(/[^a-z0-9]/g, '-')}.json`
    : 'kak-data.json';
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function importDataFromJson(file: File): Promise<KAKData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);
        if (parsed && typeof parsed === 'object') {
          resolve({ ...emptyKAKData, ...parsed });
        } else {
          reject(new Error('Format file JSON tidak valid.'));
        }
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Gagal membaca file.'));
    reader.readAsText(file);
  });
}
