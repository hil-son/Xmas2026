import { Dialog, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import AppImage from "@components/AppImage";
import { gameConfig } from "@config/gameConfig";
import styles from "@components/dialogs/GameEndDialog.module.scss";
import detailStyles from "./PrizeDetailsDialog.module.scss";

interface PrizeDetailsDialogProps {
  open: boolean;
  onClose: () => void;
}

const PrizeDetailsDialog: React.FC<PrizeDetailsDialogProps> = ({ open, onClose }) => {
  const copyRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startY: number; startScroll: number } | null>(null);
  const [thumb, setThumb] = useState({ visible: false, height: 0, top: 0 });

  const updateThumb = useCallback(() => {
    const el = copyRef.current;
    if (!el) return;
    const overflow = el.scrollHeight - el.clientHeight;
    if (overflow <= 1) {
      setThumb({ visible: false, height: 0, top: 0 });
      return;
    }
    const height = Math.max(28, (el.clientHeight / el.scrollHeight) * el.clientHeight);
    const top = (el.scrollTop / overflow) * (el.clientHeight - height);
    setThumb({ visible: true, height, top });
  }, []);

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(updateThumb);
    window.addEventListener("resize", updateThumb);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", updateThumb);
    };
  }, [open, updateThumb]);

  const onThumbPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = copyRef.current;
    if (!el) return;
    event.preventDefault();
    event.stopPropagation();
    dragRef.current = { startY: event.clientY, startScroll: el.scrollTop };
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Drag still follows pointermove events when capture is unavailable.
    }
  };

  const onThumbPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const el = copyRef.current;
    if (!drag || !el) return;
    const overflow = el.scrollHeight - el.clientHeight;
    const travel = el.clientHeight - thumb.height;
    if (overflow <= 0 || travel <= 0) return;
    el.scrollTop = drag.startScroll + ((event.clientY - drag.startY) / travel) * overflow;
  };

  const onThumbPointerUp = () => {
    dragRef.current = null;
  };

  const onTrackPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = copyRef.current;
    if (!el) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientY - rect.top) / rect.height;
    el.scrollTop = ratio * (el.scrollHeight - el.clientHeight) - el.clientHeight / 2;
  };

  return (
    <Dialog open={open} onClose={onClose} className={styles.root}>
      <AppImage
        src={gameConfig.assets.ui.giftBoxIcon}
        className={styles.titleImage}
        alt=""
      />

      <div className={styles.resultContainer}>
        <AppImage
          src={gameConfig.assets.ui.endDialogGiftBoxBg}
          className={styles.resultContainerBg}
          alt=""
        />
        <div className={styles.resultContent}>
          <div className={detailStyles.scroller}>
            <div className={detailStyles.copy} ref={copyRef} onScroll={updateThumb}>
              <div>
                <Typography>Park&apos;n Shop Voucher</Typography>
                <Typography className={detailStyles.description}>
                  This is dummy description text for the prize details popup. Grab a gift box in
                  Christmas Crush for a chance to win a Park&apos;n Shop voucher during the holiday
                  campaign. Play from the first of December through the eighteenth and collect gift
                  boxes as you match items on the board. Check in for three days in a row to earn
                  thirty extra Gold Ingots on the third day. Voucher winners are drawn after the
                  campaign ends. Please replace this placeholder with the final prize terms, dates,
                  and eligibility notes before the event launches for players across the holiday
                  season today.
                </Typography>
              </div>
              <Typography className={styles.scoreNumText}>1–18 Dec</Typography>
              <div>
                <Typography>3-day check-in</Typography>
                <div className={styles.giftNumberContainer}>
                  <AppImage
                    src={gameConfig.assets.ui.giftBoxIcon}
                    alt=""
                    className={styles.giftBoxIcon}
                  />
                  <Typography className={styles.giftNumText}>+30</Typography>
                </div>
              </div>
            </div>
            {thumb.visible && (
              <div className={detailStyles.track} onPointerDown={onTrackPointerDown}>
                <div className={detailStyles.rail}>
                  <div
                    className={detailStyles.thumb}
                    role="scrollbar"
                    aria-orientation="vertical"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round((thumb.top / Math.max(1, (copyRef.current?.clientHeight ?? 0) - thumb.height)) * 100)}
                    style={{ height: thumb.height, transform: `translateY(${thumb.top}px)` }}
                    onPointerDown={onThumbPointerDown}
                    onPointerMove={onThumbPointerMove}
                    onPointerUp={onThumbPointerUp}
                    onPointerCancel={onThumbPointerUp}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <button type="button" className={styles.button} onClick={onClose}>
        <AppImage src={gameConfig.assets.ui.okButton} alt="Close" />
      </button>
    </Dialog>
  );
};

export default PrizeDetailsDialog;
