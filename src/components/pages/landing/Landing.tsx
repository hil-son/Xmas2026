import AppImage from "@components/AppImage";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Abhaya_Libre, Montserrat_Alternates } from "next/font/google";
import { gameConfig } from "@config/gameConfig";
import { formatNumberWithCommas } from "@utils/index";
import styles from "./Landing.module.scss";
import { CoverFx, STAGE_H, STAGE_W, startCoverEffects } from "./coverEffects";
import PrizeDetailsDialog from "./PrizeDetailsDialog";

interface LandingProps {
  audioOn: boolean;
  continuousCheckinCount: number;
  specialItemPoint: number;
  setAudioOn: (audioOn: boolean) => void;
  onPlay: () => void;
  onInstructions: () => void;
  onLeaderBoard: () => void;
  onEventDetails: () => void;
}

const labelFont = Abhaya_Libre({ weight: "800", subsets: ["latin"], display: "swap" });
const valueFont = Montserrat_Alternates({ weight: "700", subsets: ["latin"], display: "swap" });

const coverSrc = `${gameConfig.basePath}/images/cover.png`;
const pugSrc = `${gameConfig.basePath}/images/pug.png`;
const playSrc = `${gameConfig.basePath}/images/cover-play.png?v=lights`;
const prizeSrc = `${gameConfig.basePath}/images/cover-prize.png`;
const cardBase = `${gameConfig.basePath}/images/covercard`;

const cardFlakes = [2, 3, 2, 4, 2, 4, 2, 4, 2, 5, 6, 5, 6, 5, 6, 5, 6, 5, 2, 5, 6, 5, 6, 5, 6, 5, 6, 5, 6, 5, 6, 5, 6, 5, 6, 5, 6, 5] as const;
const flakeFile = { 2: "a", 3: "b", 4: "c", 5: "d", 6: "e" } as const;

type FxKey = "snow" | "pump" | "blink" | "tail";

const FX_TOGGLES: Array<{ key: FxKey; label: string; icon: React.ReactNode }> = [
  {
    key: "snow",
    label: "Snow",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M12 2v20M4.9 6.5l14.2 11M19.1 6.5L4.9 17.5" />
        <path d="M12 5.2l1.5-2.4M12 5.2L10.5 2.8M12 18.8l1.5 2.4M12 18.8l-1.5 2.4M6.4 8.2L4.2 6.6M6.4 8.2l.2-2.8M17.6 15.8l2.2 1.6M17.6 15.8l-.2 2.8M17.6 8.2l2.2-1.6M17.6 8.2l-.2-2.8M6.4 15.8L4.2 17.4M6.4 15.8l.2 2.8" />
      </svg>
    ),
  },
  {
    key: "pump",
    label: "Pump globe snow",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5.2 13.4a6.8 6.8 0 0 1 13.6 0" />
        <path d="M4.4 13.4h15.2" />
        <path d="M7.2 15.2h9.6l.9 1.7H6.3z" fill="currentColor" stroke="none" />
        <path d="M8.4 18.8h7.2" />
        <circle cx="9.4" cy="9.6" r=".9" fill="currentColor" stroke="none" />
        <circle cx="12.5" cy="7.6" r=".7" fill="currentColor" stroke="none" />
        <circle cx="14.6" cy="10.6" r=".8" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    key: "blink",
    label: "Eye blink",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3.2 12.5s3.4-4.6 8.8-4.6 8.8 4.6 8.8 4.6-3.4 4.6-8.8 4.6-8.8-4.6-8.8-4.6Z" />
        <circle cx="12" cy="12.5" r="2.1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    key: "tail",
    label: "Tail wag",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5.5 17.2c1.4 2.2 4.6 2.8 7 1.2 2.6-1.7 2.3-5 .1-6.1-1.8-.9-2.6.7-1.7 2 .9 1.3 3 .9 3.8-.7 1.3-2.4-.2-5-2.6-5.8" />
      </svg>
    ),
  },
];

const FX_COLUMNS: FxKey[][] = [
  ["snow", "pump"],
  ["blink", "tail"],
];

const Landing: React.FC<LandingProps> = ({
  audioOn,
  continuousCheckinCount,
  specialItemPoint,
  setAudioOn,
  onPlay,
  onInstructions,
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const lightsRef = useRef<HTMLDivElement>(null);
  const snowRef = useRef<HTMLCanvasElement>(null);
  const globeRef = useRef<HTMLCanvasElement>(null);
  const pugRef = useRef<HTMLCanvasElement>(null);
  const [scale, setScale] = useState(1);
  const [prizeOpen, setPrizeOpen] = useState(false);
  const playRef = useRef<HTMLButtonElement>(null);
  const fxRef = useRef<CoverFx>({
    snow: true,
    pump: true,
    blink: false,
    tail: false,
    pumpBurst: 1.6,
    glitterTouch: true,
    stir: 0,
  });
  const [fxOn, setFxOn] = useState({ snow: true, pump: true, blink: false, tail: false });
  const [glitterOn, setGlitterOn] = useState(true);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const parent = root?.parentElement;
    if (!parent) return;

    const fit = () => {
      const width = parent.clientWidth;
      if (!width) return;
      setScale(width / STAGE_W);
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(parent);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const lights = lightsRef.current;
    const snow = snowRef.current;
    const globe = globeRef.current;
    const pug = pugRef.current;
    if (!lights || !snow || !globe || !pug) return;

    return startCoverEffects({
      lights,
      bulbClassName: styles.bulb,
      snow,
      globe,
      pug,
      pugImageUrl: pugSrc,
      coverImageUrl: coverSrc,
      fx: fxRef.current,
    });
  }, []);

  useEffect(() => {
    const button = playRef.current;
    if (!button) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let timer = 0;

    const burst = () => {
      if (cancelled) return;
      const angle = (3.5 + Math.random() * 3) * (Math.random() < 0.5 ? -1 : 1);
      const duration = 1240 + Math.random() * 760;
      button.style.setProperty("--swing", `${angle}deg`);
      button.style.setProperty("--swing-duration", `${duration}ms`);
      button.classList.remove(styles.swinging);
      void button.offsetWidth;
      button.classList.add(styles.swinging);

      const againSoon = Math.random() < 0.45;
      const wait = duration + (againSoon ? 180 : 650 + Math.random() * 1700);
      timer = window.setTimeout(burst, wait);
    };

    timer = window.setTimeout(burst, 360 + Math.random() * 700);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      button.classList.remove(styles.swinging);
    };
  }, []);

  const toggleGlitterTouch = () => {
    const next = !fxRef.current.glitterTouch;
    fxRef.current.glitterTouch = next;
    if (!next) fxRef.current.stir = 0;
    setGlitterOn(next);
  };

  const stirGlobe = () => {
    if (!fxRef.current.glitterTouch || fxRef.current.stir > 0) return;
    fxRef.current.stir = 1;
  };

  useEffect(() => {
    let listening = false;
    let armed = false;
    let asked = false;

    const onOrientation = (event: DeviceOrientationEvent) => {
      const beta = event.beta;
      if (beta == null) return;
      const upright = beta >= 25 && beta <= 140;
      const upsideDown = beta <= -50 || beta >= 150;
      if (upright) {
        armed = true;
        return;
      }
      if (!armed || !upsideDown) return;
      armed = false;
      if (!fxRef.current.glitterTouch || fxRef.current.stir > 0) return;
      fxRef.current.stir = 1;
    };

    const listen = () => {
      if (listening) return;
      listening = true;
      window.addEventListener("deviceorientation", onOrientation);
    };

    const ask = () => {
      const orientationEvent = DeviceOrientationEvent as typeof DeviceOrientationEvent & {
        requestPermission?: () => Promise<"granted" | "denied">;
      };
      if (typeof orientationEvent.requestPermission !== "function") return;
      if (asked) return;
      asked = true;
      void orientationEvent.requestPermission().then((state) => {
        if (state !== "granted") return;
        window.removeEventListener("deviceorientation", onOrientation);
        listening = false;
        listen();
      }).catch(() => {});
    };

    const needsPermission = typeof (DeviceOrientationEvent as typeof DeviceOrientationEvent & {
      requestPermission?: () => Promise<"granted" | "denied">;
    }).requestPermission === "function";
    if (!needsPermission) listen();
    window.addEventListener("pointerdown", ask);
    return () => {
      window.removeEventListener("deviceorientation", onOrientation);
      window.removeEventListener("pointerdown", ask);
    };
  }, []);

  const toggleFx = (key: FxKey) => {
    const next = !fxRef.current[key];
    fxRef.current[key] = next;
    if (key === "pump" && next) fxRef.current.pumpBurst = 1.6;
    setFxOn((current) => ({ ...current, [key]: next }));
  };

  return (
    <div className={styles.root} ref={rootRef}>
      <div className={styles.sizer} style={{ height: STAGE_H * scale }}>
      <div
        className={styles.stage}
        style={{
          width: STAGE_W,
          height: STAGE_H,
          transform: `scale(${scale})`,
        }}
      >
        <img className={styles.plate} src={coverSrc} alt="" />
        <div className={styles.lights} ref={lightsRef} />
        <canvas className={styles.pugLive} ref={pugRef} />
        <canvas className={styles.globeSnow} ref={globeRef} width={292} height={292} />
        <div className={styles.shinePlaque} />
        <canvas className={styles.snow} ref={snowRef} width={STAGE_W} height={STAGE_H} />
        <button
          type="button"
          className={glitterOn ? styles.globeHit : `${styles.globeHit} ${styles.globeHitOff}`}
          aria-label="Swirl the snow globe"
          onPointerDown={stirGlobe}
        />
        <button
          type="button"
          className={styles.prizeCard}
          onClick={() => setPrizeOpen(true)}
          aria-label="Prize details"
        >
          <img src={prizeSrc} alt="" />
        </button>
        <div className={styles.giftCard}>
          <div className={`${styles.flakeRow} ${styles.flakeTop}`}>
            {cardFlakes.map((flake, index) => (
              <img key={index} src={`${cardBase}/flake-${flakeFile[flake]}.svg`} alt="" />
            ))}
          </div>
          <div className={styles.giftCol}>
            <p className={`${styles.cardLabel} ${labelFont.className}`}>Your Gift Box</p>
            <div className={styles.giftMeta}>
              <span className={`${styles.giftDates} ${valueFont.className}`}>1–18 Dec</span>
              <div className={`${styles.countPill} ${valueFont.className}`}>
                <img className={styles.pillGift} src={`${gameConfig.basePath}/images/xmas-giftbox-2.png?v=goldgift`} alt="" />
                <span>{formatNumberWithCommas(specialItemPoint)}</span>
              </div>
            </div>
          </div>
          <div className={styles.checkCol}>
            <p className={`${styles.cardLabel} ${labelFont.className}`}>Daily Check-in</p>
            <div className={styles.days}>
              {[1, 2, 3].map((day) => (
                <div className={styles.day} key={day}>
                  <img
                    className={styles.dayMark}
                    src={day <= continuousCheckinCount ? `${cardBase}/check-done.svg?v=checked` : `${cardBase}/check-empty.svg`}
                    alt=""
                  />
                  <span className={`${styles.dayLabel} ${valueFont.className}`}>Day {day}</span>
                </div>
              ))}
            </div>
          </div>
          <div className={`${styles.bonus} ${valueFont.className}`}>
            <img className={styles.bonusBg} src={`${cardBase}/plus-bubble.svg`} alt="" />
            <span>+30</span>
            <img className={styles.bonusGift} src={`${gameConfig.basePath}/images/xmas-giftbox-2.png?v=goldgift`} alt="" />
          </div>
          <div className={`${styles.flakeRow} ${styles.flakeBottom}`}>
            {cardFlakes.map((flake, index) => (
              <img key={`b${index}`} src={`${cardBase}/flake-${flakeFile[flake]}.svg`} alt="" />
            ))}
          </div>
        </div>
        <button ref={playRef} type="button" className={styles.playButton} onClick={onPlay} aria-label="Play">
          <img src={playSrc} alt="" />
        </button>
      </div>
      </div>

      <div className={styles.fxToggles}>
        {FX_COLUMNS.map((column) => (
          <div className={styles.fxCol} key={column.join("-")}>
            {column.map((key) => {
              const toggle = FX_TOGGLES.find((item) => item.key === key);
              if (!toggle) return null;
              const pressed = fxOn[key];
              return (
                <button
                  key={key}
                  type="button"
                  className={pressed ? `${styles.fxBtn} ${styles.fxOn}` : styles.fxBtn}
                  aria-pressed={pressed}
                  aria-label={toggle.label}
                  title={toggle.label}
                  onClick={() => toggleFx(key)}
                >
                  {toggle.icon}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <button
        type="button"
        className={styles.howToButton}
        aria-label="How to play"
        onClick={onInstructions}
      >
        ?
      </button>
      <button
        type="button"
        className={glitterOn ? styles.glitterToggle : `${styles.glitterToggle} ${styles.glitterOff}`}
        aria-pressed={glitterOn}
        aria-label={glitterOn ? "Snow globe touch on" : "Snow globe touch off"}
        onClick={toggleGlitterTouch}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M12 3v18M5.2 6.8l13.6 10.4M18.8 6.8 5.2 17.2" />
          <path d="M12 6.2 13.4 4M12 6.2 10.6 4M12 17.8l1.4 2.2M12 17.8 10.6 20M7.2 8.4 5.4 7.2M7.2 8.4l.2-2.2M16.8 15.6l1.8 1.2M16.8 15.6l-.2 2.2M16.8 8.4l1.8-1.2M16.8 8.4l-.2-2.2M7.2 15.6 5.4 16.8M7.2 15.6l.2 2.2" />
          {!glitterOn && <path d="M5 19 19 5" strokeWidth="2.2" />}
        </svg>
      </button>
      <button
        type="button"
        className={styles.audioControlButton}
        onClick={() => setAudioOn(!audioOn)}
      >
        {audioOn ? (
          <AppImage src={gameConfig.assets.ui.audioOnButton} alt="Audio on" />
        ) : (
          <AppImage src={gameConfig.assets.ui.audioOffButton} alt="Audio off" />
        )}
      </button>
      <PrizeDetailsDialog open={prizeOpen} onClose={() => setPrizeOpen(false)} />
    </div>
  );
};

export default Landing;
