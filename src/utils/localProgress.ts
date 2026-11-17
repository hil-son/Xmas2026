const STORAGE_KEY = "cny-candy-crush-progress";
const HOW_TO_PLAY_KEY = "cny-candy-crush-seen-howto";

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

// A finished 3-day streak pays 30 gift boxes, then the marks clear and day 1 starts again.
export function nextCheckInCycle(count: number, alreadyToday: boolean): {
  stored: number;
  shown: number;
  bonus: number;
} {
  const cycle = ((Number(count) || 0) % 3 + 3) % 3;
  if (alreadyToday) {
    return { stored: cycle, shown: cycle, bonus: 0 };
  }
  const next = cycle + 1;
  if (next >= 3) {
    return { stored: 0, shown: 3, bonus: 30 };
  }
  return { stored: next, shown: next, bonus: 0 };
}

export const hasPlayedBefore = (): boolean => {
  if (typeof window === "undefined") return true;
  if (window.localStorage.getItem(HOW_TO_PLAY_KEY) === "1") return true;

  const progress = loadProgress();
  return (
    progress.bestScore > 0 ||
    progress.continuousCheckinCount > 0 ||
    progress.specialItemPoint > 0 ||
    progress.checkInDate !== null
  );
};

export const markHowToPlaySeen = () => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(HOW_TO_PLAY_KEY, "1");
};
