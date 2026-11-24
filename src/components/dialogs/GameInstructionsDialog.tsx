import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent } from "@mui/material";
import AppImage from "@components/AppImage";
import PopupCloseButton from "./PopupCloseButton";
import styles from "./GameInstructionsDialog.module.scss";
import { gameConfig, uiFor } from "@config/gameConfig";
import Typography from "@mui/material/Typography";
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from "swiper";

import 'swiper/css';
import 'swiper/css/pagination';

import { Pagination } from 'swiper/modules';
import { useLanguage } from "@/i18n/LanguageProvider";

const STEP_COUNT = 3;

interface GameInstructionsDialogProps {
  open: boolean;
  onPlay: () => void;
  onClose: () => void;
}

const GameInstructionsDialog: React.FC<GameInstructionsDialogProps> = ({
  open,
  onPlay,
  onClose,
}) => {
  const { locale, t } = useLanguage();
  const ui = uiFor(locale);
  const swiperRef = useRef<SwiperType | null>(null);
  const [step, setStep] = useState(0);
  const [seen, setSeen] = useState<boolean[]>(() => Array(STEP_COUNT).fill(false).map((_, index) => index === 0));

  useEffect(() => {
    if (!open) return;
    setStep(0);
    setSeen(Array(STEP_COUNT).fill(false).map((_, index) => index === 0));
    swiperRef.current?.slideTo(0, 0);
  }, [open]);

  const markSeen = (index: number) => {
    setStep(index);
    setSeen((current) => {
      if (current[index]) return current;
      const next = [...current];
      next[index] = true;
      return next;
    });
  };

  const showPlay = seen.every(Boolean) && step === STEP_COUNT - 1;

  const onNext = () => {
    const swiper = swiperRef.current;
    if (!swiper) return;
    if (seen.every(Boolean)) {
      swiper.slideTo(STEP_COUNT - 1);
      return;
    }
    const upcoming = seen.findIndex((value, index) => !value && index > step);
    const anyUnseen = seen.findIndex((value) => !value);
    swiper.slideTo(upcoming >= 0 ? upcoming : anyUnseen);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className={styles.root}
    >
      <DialogContent className={styles.sheet}>
        <PopupCloseButton onClick={onClose} className={styles.close} />
        <Swiper
          spaceBetween={30}
          pagination={{
            clickable: true,
            el: "."+styles.instructionSwiperPagination,
            bulletActiveClass: styles.instructionSwiperPaginationBulletActive,
          }}
          modules={[Pagination]}
          className="instructionSwiper"
          observeParents={true}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            swiper.slideTo(0, 0);
          }}
          onSlideChange={(swiper) => markSeen(swiper.activeIndex)}
        >
          <SwiperSlide data-hash="slide1">
            <AppImage
              src={ui.instructionsTitle}
              className={styles.titleImage}
              alt="Instructions title"
            />

            <div className={styles.contentContainer}>
              <div className={styles.animationContainer}>
                <AppImage
                  src={gameConfig.assets.ui.instructionsAnimation}
                  alt="Instructions animation"
                />
              </div>

              <Typography align="center" className={styles.titleText}>
                {t("xmasSpecial")}
              </Typography>

              <AppImage
                  src={gameConfig.assets.ui.instructionsGiftNumSample}
                  alt="Instructions Gift Box Sample"
                  className={styles.instructionsGiftNumSample}
              />

              <Typography align="center" className={styles.contentText}>
                {t("xmasSpecialBody")}
              </Typography>
            </div>
          </SwiperSlide>

          <SwiperSlide data-hash="slide2">
            <AppImage
              src={ui.instructionsTitle}
              className={styles.titleImage}
              alt="Instructions title"
            />

            <div className={styles.contentContainer}>
              <div className={styles.animationContainer}>
                <AppImage
                  src={gameConfig.assets.ui.checkInDialogCheckInBox.day3}
                  alt="CheckInBox Day3"
                />
              </div>

              <Typography align="center" className={styles.titleText}>
                {t("checkInTitle")}
              </Typography>

              <Typography align="center" className={styles.contentText}>
                {t("checkInBodyBefore")}
                <span className={styles.brownText}>{t("checkInBodyEm")}</span>
              </Typography>
            </div>
          </SwiperSlide>

          <SwiperSlide data-hash="slide3">
            <AppImage
              src={ui.instructionsTitle}
              className={styles.titleImage}
              alt="Instructions title"
            />

            <div className={styles.contentContainer}>
              <div className={styles.animationContainer}>
                <AppImage
                  src={gameConfig.assets.ui.instructionsAnimation}
                  alt="Instructions animation"
                />
              </div>

              <Typography align="center" className={styles.titleText}>
                {t("rulesTitle")}
              </Typography>

              <Typography align="center" className={styles.contentText}>
                {t("rulesMatch")}
              </Typography>

              <div className={styles.animationContainer}>
                <AppImage
                  src={gameConfig.assets.ui.instructionsTimeBar}
                  alt="Instructions Time Bar"
                />
              </div>

              <Typography align="center" className={styles.contentText}>
                {t("rulesTime")}
              </Typography>
            </div>
          </SwiperSlide>

          
        </Swiper>
        <div className={styles.instructionSwiperPagination}></div>
        {showPlay ? (
          <button type="button" className={styles.playNowButton} onClick={onPlay}>
            <AppImage
              src={ui.playNowButton}
              alt="Play now button"
            />
          </button>
        ) : (
          <button type="button" className={styles.nextButton} onClick={onNext}>
            <AppImage
              src={ui.nextButton}
              alt="Next"
            />
          </button>
        )}
        <p className={styles.musicCredit}>
          <a href="https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1100365" target="_blank" rel="noreferrer">
            Up on the Housetop
          </a>
          {" · Kevin MacLeod · "}
          <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">
            CC BY 4.0
          </a>
        </p>
      </DialogContent>

      
    </Dialog>
  );
};

export default GameInstructionsDialog;
