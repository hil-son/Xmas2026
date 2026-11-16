import { Dialog } from "@mui/material";
import { Noto_Sans } from "next/font/google";
import AppImage from "@components/AppImage";
import PopupCloseButton from "@components/dialogs/PopupCloseButton";
import { gameConfig } from "@config/gameConfig";
import styles from "./PrizeDetailsDialog.module.scss";

interface PrizeDetailsDialogProps {
  open: boolean;
  onClose: () => void;
}

const detailFont = Noto_Sans({
  weight: ["400", "500", "700", "800"],
  subsets: ["latin"],
  display: "swap",
});

const asset = (file: string) => `${gameConfig.basePath}/images/prize-details/${file}`;

const bulbSize: Record<string, [number, number]> = {
  "bulb-2412.svg": [28.974, 34.461],
  "bulb-2413.svg": [32.1093, 28.9739],
  "bulb-2414.svg": [32.1093, 28.9739],
  "bulb-2415.svg": [31.1532, 30.1079],
  "bulb-2416.svg": [32.1093, 28.9739],
  "bulb-2417.svg": [31.1532, 30.1079],
  "bulb-2418.svg": [32.1093, 28.9739],
  "bulb-2419.svg": [28.974, 34.461],
  "bulb-2420.svg": [32.1093, 28.9739],
  "bulb-2421.svg": [31.1532, 30.1079],
  "bulb-2422.svg": [32.1093, 28.9739],
  "bulb-2423.svg": [31.1532, 30.1079],
  "bulb-2424.svg": [32.1093, 28.9739],
  "bulb-2425.svg": [28.974, 34.461],
};

// Figma bounding boxes. Bulb art includes a glow, so each image is centered on its box.
const bulbs: Array<[string, number, number, number, number]> = [
  ["bulb-2414.svg", 18, 13, 19, 18],
  ["bulb-2415.svg", 9, 52, 25, 24],
  ["bulb-2413.svg", 8, 111, 18, 19],
  ["bulb-2412.svg", -13, 159, 20, 15],
  ["bulb-2414.svg", -8, 218, 19, 18],
  ["bulb-2415.svg", -17, 257, 25, 24],
  ["bulb-2413.svg", -6, 316, 18, 19],
  ["bulb-2412.svg", -9, 364, 20, 15],
  ["bulb-2414.svg", 15, 408, 19, 18],
  ["bulb-2415.svg", 9, 447, 25, 24],
  ["bulb-2416.svg", 368, 2, 17, 19],
  ["bulb-2417.svg", 355, 52, 17, 18],
  ["bulb-2418.svg", 368, 97, 19, 19],
  ["bulb-2419.svg", 377, 156, 16, 21],
  ["bulb-2420.svg", 390, 215, 18, 19],
  ["bulb-2421.svg", 379, 262, 23, 23],
  ["bulb-2424.svg", 390, 308, 19, 16],
  ["bulb-2425.svg", 366, 364, 21, 17],
  ["bulb-2422.svg", 370, 408, 15, 18],
  ["bulb-2423.svg", 352, 441, 20, 21],
];

function place(px: number) {
  return `calc(${px} / 390 * var(--s))`;
}

function Deco({
  file,
  x,
  y,
  w,
  h,
  flip = false,
}: {
  file: string;
  x: number;
  y: number;
  w: number;
  h: number;
  flip?: boolean;
}) {
  return (
    <img
      src={asset(file)}
      alt=""
      className={flip ? `${styles.deco} ${styles.flip}` : styles.deco}
      style={{ left: place(x), top: place(y), width: place(w), height: place(h) }}
    />
  );
}

const PrizeDetailsDialog: React.FC<PrizeDetailsDialogProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} className={styles.root}>
      <div className={`${styles.frame} ${detailFont.className}`}>
        <div className={styles.card}>
          <PopupCloseButton onClick={onClose} className={styles.close} />
          <div className={styles.copy}>
            <h2 className={styles.title}>Game Details</h2>
            <p className={styles.lead}>
              Collect the most <strong>Gift Box</strong> to win Park’n Shop Voucher<span className={styles.mark}>*</span>!
            </p>
            <p className={styles.period}>
              Game period:
              <br />
              23 Nov to 21 Dec 2026
            </p>
          </div>

          <div className={styles.banner}>
            <img src={asset("banner.jpg")} alt="" />
          </div>

          <button type="button" className={styles.ok} onClick={onClose}>
            <AppImage src={gameConfig.assets.ui.okButton} alt="OK" />
          </button>

          <p className={styles.terms}>
            <a href="https://web.three.com.hk/tnc/261123/tnc-xmas-crush-en.pdf" target="_blank" rel="noreferrer">
              Terms and conditions apply.
            </a>
          </p>

          <Deco file="wire.svg" x={-5} y={0} w={31} h={450} />
          <Deco file="wire.svg" x={366} y={0} w={31} h={450} flip />
          {bulbs.map(([file, x, y, w, h], index) => {
            const [sw, sh] = bulbSize[file];
            return (
              <Deco
                key={`${file}-${index}`}
                file={file}
                x={x + w / 2 - sw / 2}
                y={y + h / 2 - sh / 2}
                w={sw}
                h={sh}
              />
            );
          })}
          <Deco file="sparkle-title.svg" x={80} y={21} w={28} h={28} />
          <Deco file="sparkle-photo.svg" x={323} y={165} w={23} h={23} />
          <Deco file="string-left.svg" x={49} y={1} w={1} h={46} />
          <Deco file="bauble.svg" x={37} y={50} w={26} h={26} />
          <Deco file="bauble-cap.svg" x={46} y={47} w={9} h={5} />
          <Deco file="string-right.svg" x={343} y={1} w={2} h={47} />
          <Deco file="bauble-right.svg" x={329} y={51} w={28} h={27} />
          <Deco file="bauble-right-cap.svg" x={339} y={48} w={10} h={5} />
          <Deco file="bauble-right-tip.svg" x={343} y={68} w={13} h={12} />
          <Deco file="star.svg" x={49} y={297} w={31} h={31} />
        </div>
      </div>
    </Dialog>
  );
};

export default PrizeDetailsDialog;
