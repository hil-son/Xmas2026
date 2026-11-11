import AppImage from "@components/AppImage";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
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

const coverSrc = `${gameConfig.basePath}/images/cover.png`;
const pugSrc = `${gameConfig.basePath}/images/pug.png`;
const playSrc = `${gameConfig.basePath}/images/cover-play.png?v=lights`;

// White bulb centers on cover-play.png, walked around the rim.
const PLAY_BULBS: Array<[number, number]> = [
  [1.7, 32.5], [4.1, 14.0], [9.8, 4.4], [13.7, 7.0], [17.7, 7.0], [21.7, 7.0],
  [25.6, 7.0], [29.6, 7.9], [33.6, 7.9], [37.5, 8.8], [41.4, 9.7], [45.2, 10.5],
  [48.6, 12.3], [52.0, 12.3], [55.5, 10.5], [59.4, 9.7], [63.2, 8.8], [67.1, 7.9],
  [71.1, 7.9], [75.1, 7.0], [79.0, 7.0], [83.0, 7.0], [87.0, 5.3], [90.9, 4.4],
  [94.8, 10.5], [97.7, 26.3], [98.9, 49.1], [97.7, 71.9], [94.9, 87.7], [91.1, 93.9],
  [87.0, 93.9], [83.1, 93.9], [79.2, 91.2], [75.2, 91.2], [71.3, 91.2], [67.3, 90.4],
  [63.3, 90.4], [59.5, 89.5], [55.7, 87.7], [52.1, 86.8], [48.7, 86.0], [45.2, 87.7],
  [41.5, 88.6], [37.7, 89.5], [33.7, 90.4], [29.8, 91.2], [25.8, 91.2], [21.8, 91.2],
  [17.9, 93.9], [14.0, 93.9], [10.1, 93.9], [6.1, 90.4], [2.8, 77.2], [1.1, 56.1],
];

const SHINING_BULBS = PLAY_BULBS
  .map((bulb, index) => ({ bulb, index, rank: Math.abs(Math.sin(index * 91.7)) }))
  .sort((a, b) => a.rank - b.rank)
  .slice(0, Math.round(PLAY_BULBS.length / 2));
const prizeSrc = `${gameConfig.basePath}/images/cover-prize.png`;
const giftSrc = `${gameConfig.basePath}/images/cover-gift.png`;
const checkedStampSrc = `${gameConfig.basePath}/images/cover-gift-checked.png`;

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
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const lightsRef = useRef<HTMLDivElement>(null);
  const snowRef = useRef<HTMLCanvasElement>(null);
  const globeRef = useRef<HTMLCanvasElement>(null);
  const pugRef = useRef<HTMLCanvasElement>(null);
  const [scale, setScale] = useState(1);
  const [prizeOpen, setPrizeOpen] = useState(false);
  const fxRef = useRef<CoverFx>({
    snow: true,
    pump: true,
    blink: false,
    tail: false,
    pumpBurst: 1.6,
  });
  const [fxOn, setFxOn] = useState({ snow: true, pump: true, blink: false, tail: false });

  useLayoutEffect(() => {
    const root = rootRef.current;
    const parent = root?.parentElement;
    if (!parent) return;

    const fit = () => {
      const width = parent.clientWidth;
      const height = parent.clientHeight;
      if (!width || !height) return;
      setScale(Math.min(width / STAGE_W, height / STAGE_H));
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

  const toggleFx = (key: FxKey) => {
    const next = !fxRef.current[key];
    fxRef.current[key] = next;
    if (key === "pump" && next) fxRef.current.pumpBurst = 1.6;
    setFxOn((current) => ({ ...current, [key]: next }));
  };

  return (
    <div className={styles.root} ref={rootRef}>
      <div
        className={styles.stage}
        style={{
          width: STAGE_W,
          height: STAGE_H,
          transform: `translate(-50%, -50%) scale(${scale})`,
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
          className={styles.prizeCard}
          onClick={() => setPrizeOpen(true)}
          aria-label="Prize details"
        >
          <img src={prizeSrc} alt="" />
        </button>
        <div className={styles.giftCard}>
          <img className={styles.giftArt} src={giftSrc} alt="" />
          <span className={styles.score}>{formatNumberWithCommas(specialItemPoint)}</span>
          {[1, 2, 3].map((day) =>
            day <= continuousCheckinCount ? (
              <img
                key={day}
                className={`${styles.stamp} ${styles[`stamp${day}`]}`}
                src={checkedStampSrc}
                alt=""
              />
            ) : null
          )}
        </div>
        <button type="button" className={styles.playButton} onClick={onPlay} aria-label="Play">
          <img src={playSrc} alt="" />
          <span className={styles.bulbRim} aria-hidden="true">
            {SHINING_BULBS.map(({ bulb: [x, y], index }) => {
              const phase = Math.abs(Math.sin(index * 12.9898) * 43758.5453);
              const pace = Math.abs(Math.sin(index * 78.233) * 24634.6345);
              const phaseRand = phase - Math.floor(phase);
              const paceRand = pace - Math.floor(pace);
              return (
                <i
                  key={index}
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    animationDuration: `${6 + paceRand * 4}s`,
                    animationDelay: `${-phaseRand * 10}s`,
                  }}
                />
              );
            })}
          </span>
        </button>
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
