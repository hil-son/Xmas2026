"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Locale = "en" | "zh-Hant";

const STORAGE_KEY = "xmas-locale";

const messages = {
  en: {
    language: "Language",
    howToPlay: "How to play",
    play: "Play",
    close: "Close",
    pause: "Pause",
    prizeDetails: "Prize details",
    swirl: "Swirl the snow globe",
    audioOn: "Audio on",
    audioOff: "Audio off",
    detailsTitle: "Game Details",
    detailsBefore: "Collect the most ",
    detailsGift: "Gift Box",
    detailsAfter: " to win Park’n Shop Voucher",
    detailsPeriodLabel: "Game period:",
    detailsPeriod: "26 Nov to 20 Dec 2026",
    terms: "Terms and conditions apply.",
    termsUrl: "https://web.three.com.hk/tnc/261123/tnc-xmas-crush-en.pdf",
    xmasSpecial: "Xmas Special",
    xmasSpecialBody: "Special Xmas Gift boxes will appear randomly. Grab the most Gift boxes will win rewards!",
    checkInTitle: "Daily Check-in Bonus",
    checkInBodyBefore: "Check in for 3 consecutive days to receive ",
    checkInBodyEm: "30 extra Gift boxes.",
    rulesTitle: "Game Rules",
    rulesMatch: "Match 3 or more of the same item to eliminate them and earn points!",
    rulesTime: "Match items to restore the timer below. When time runs out, the game is over.",
    checkInLeft2: "2 more check-ins to earn",
    checkInLeft1: "1 more check-in to earn",
    checkInDone: "30 extra Gift boxes earned! Enjoy!",
    checkInReward: "30 extra Gift boxes.",
    received: "You have received",
    yourScore: "Your Score",
    best: "BEST",
    score: "SCORE",
    paused: "PAUSED",
    yourGiftBox: "Your Gift Box",
    dailyCheckIn: "Daily Check-in",
    day1: "Day 1",
    day2: "Day 2",
    day3: "Day 3",
  },
  "zh-Hant": {
    language: "語言",
    howToPlay: "玩法說明",
    play: "開始",
    close: "關閉",
    pause: "暫停",
    prizeDetails: "獎賞詳情",
    swirl: "搖一搖雪球",
    audioOn: "開啟音效",
    audioOff: "關閉音效",
    detailsTitle: "遊戲詳情",
    detailsBefore: "收集最多",
    detailsGift: "禮物盒",
    detailsAfter: "，贏取百佳購物禮券",
    detailsPeriodLabel: "活動期間：",
    detailsPeriod: "2026年11月26日至12月20日",
    terms: "受條款及細則約束。",
    termsUrl: "https://web.three.com.hk/tnc/261123/tnc-xmas-crush-tc.pdf",
    xmasSpecial: "聖誕特別獎",
    xmasSpecialBody: "特別聖誕禮物盒會隨機出現。收集最多禮物盒，即可贏取獎賞！",
    checkInTitle: "每日簽到獎賞",
    checkInBodyBefore: "連續簽到 3 天，可額外獲得",
    checkInBodyEm: " 30 個禮物盒。",
    rulesTitle: "遊戲規則",
    rulesMatch: "連線 3 個或以上相同圖案即可消除得分！",
    rulesTime: "每次消除都能延長倒數時間，時間歸零即結束遊戲。",
    checkInLeft2: "再簽到 2 次即可獲得",
    checkInLeft1: "再簽到 1 次即可獲得",
    checkInDone: "已獲得額外 30 個禮物盒，祝你玩得開心！",
    checkInReward: "額外 30 個禮物盒。",
    received: "你已獲得",
    yourScore: "你的分數",
    best: "最高",
    score: "分數",
    paused: "暫停",
    yourGiftBox: "你的禮物盒",
    dailyCheckIn: "每日簽到獎賞",
    day1: "第一日",
    day2: "第二日",
    day3: "第三日",
  },
} as const;

export type MessageKey = keyof typeof messages.en;

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: MessageKey) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "zh-Hant") setLocaleState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === "zh-Hant" ? "zh-Hant" : "en";
  }, [locale]);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  };

  const t = (key: MessageKey) => messages[locale][key];

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error("useLanguage must be used within LanguageProvider");
  return value;
}
