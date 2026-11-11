const STORAGE_KEY = "cny-candy-crush-progress";

export interface LocalProgress {
  bestScore: number;
  continuousCheckinCount: number;
  specialItemPoint: number;
  checkInDate: string | null;
}

const emptyProgress: LocalProgress = {
  bestScore: 0,
  continuousCheckinCount: 0,
  specialItemPoint: 0,
  checkInDate: null,
};

export const todayStamp = (): string => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
};

export const loadProgress = (): LocalProgress => {
  if (typeof window === "undefined") return emptyProgress;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyProgress;
    const parsed = JSON.parse(raw) as Partial<LocalProgress>;
    return {
      bestScore: Number(parsed.bestScore) || 0,
      continuousCheckinCount: Number(parsed.continuousCheckinCount) || 0,
      specialItemPoint: Number(parsed.specialItemPoint) || 0,
      checkInDate: typeof parsed.checkInDate === "string" ? parsed.checkInDate : null,
    };
  } catch {
    return emptyProgress;
  }
};

export const saveProgress = (progress: LocalProgress) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
};

export const isCheckedInToday = (progress: LocalProgress): boolean => {
  return progress.checkInDate === todayStamp();
};
