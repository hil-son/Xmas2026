import { Dialog, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import styles from "./GameCheckInEndDialog.module.scss";
import AppImage from "@components/AppImage";
import { gameConfig, uiFor } from "@config/gameConfig";
import { useLanguage } from "@/i18n/LanguageProvider";

interface GameCheckInEndDialogProps {
  open: boolean;
  continuousCheckinCount: number;
  onNextEndDialog: () => void;
}

const GameEndDialog: React.FC<GameCheckInEndDialogProps> = ({
  open,
  continuousCheckinCount,
  onNextEndDialog,
}) => {
  const { locale, t } = useLanguage();
  const ui = uiFor(locale);
  const [checkInDayBox, setCheckInDayBox] = useState<string>(gameConfig.assets.ui.checkInDialogCheckInBox.day1);
  const [checkInDayTopBanner, setCheckInDayTopBanner] = useState<string>(ui.checkInDialogCheckInTopBanner.day1);
  
  useEffect(() => {
    const banners = ui.checkInDialogCheckInTopBanner;
    if (continuousCheckinCount === 1) {
      setCheckInDayBox(gameConfig.assets.ui.checkInDialogCheckInBox.day1);
      setCheckInDayTopBanner(banners.day1);
    } else if (continuousCheckinCount === 2) {
      setCheckInDayBox(gameConfig.assets.ui.checkInDialogCheckInBox.day2);
      setCheckInDayTopBanner(banners.day2);
    } else if (continuousCheckinCount === 3) {
      setCheckInDayBox(gameConfig.assets.ui.checkInDialogCheckInBox.day3);
      setCheckInDayTopBanner(banners.day3);
    }
  });

  return (
    <Dialog open={open} className={styles.root}>
      <div className={styles.sheet}>
      <AppImage
        src={checkInDayTopBanner}
        className={styles.titleImage}
        alt="Instructions title"
      />
      
      <div className={styles.contentContainer}>
        <div className={styles.checkInArt}>
          <AppImage
            src={checkInDayBox}
            alt=""
            className={styles.checkInDayBox}
          />
          {locale === "zh-Hant" && (
            <>
              <span className={`${styles.tcPlate} ${styles.tcCheckTitle}`}>{t("dailyCheckIn")}</span>
              <span className={`${styles.tcPlate} ${styles.tcDay} ${styles.tcDay1}`}>{t("day1")}</span>
              <span className={`${styles.tcPlate} ${styles.tcDay} ${styles.tcDay2}`}>{t("day2")}</span>
              <span className={`${styles.tcPlate} ${styles.tcDay} ${styles.tcDay3}`}>{t("day3")}</span>
            </>
          )}
        </div>

        <Typography align="center" className={styles.titleText}>
          {t("checkInTitle")}
        </Typography>
        
        <Typography
          align="center"
          className={continuousCheckinCount >= 3 ? styles.contentOtherText : styles.contentText}
        >
          { continuousCheckinCount === 1
            ? t("checkInLeft2")
            : continuousCheckinCount === 2
              ? t("checkInLeft1")
              : t("checkInDone") }
        </Typography>

        <Typography align="center" className={styles.contentOtherText}>
          { continuousCheckinCount === 1 || continuousCheckinCount === 2
            ? t("checkInReward") : "" }
        </Typography>
      </div>

      <button type="button" className={styles.button} onClick={onNextEndDialog}>
        <AppImage
          src={ui.okButton}
          alt="Play again button"
        />
      </button>
      </div>
    </Dialog>
  );
};

export default GameEndDialog;
