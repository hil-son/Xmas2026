import { Dialog } from "@mui/material";
import AppImage from "@components/AppImage";
import PopupCloseButton from "./PopupCloseButton";
import styles from "./GamePauseDialog.module.scss";
import { gameConfig, uiFor } from "@config/gameConfig";
import { useLanguage } from "@/i18n/LanguageProvider";

interface GamePauseDialogProps {
  open: boolean;
  audioOn: boolean;
  setAudioOn: (audioOn: boolean) => void;
  onResumeGame: () => void;
  onRestartGame: () => void;
  onBackToMenu: () => void;
}

const GamePauseDialog: React.FC<GamePauseDialogProps> = ({
  open,
  audioOn,
  setAudioOn,
  onResumeGame,
  onRestartGame,
  onBackToMenu,
}) => {
  const { locale } = useLanguage();
  const ui = uiFor(locale);
  return (
    <Dialog open={open} className={styles.root}>
      <div className={styles.controlsContainer}>
        <PopupCloseButton onClick={onResumeGame} className={styles.close} />
        <button
          type="button"
          className={styles.controlButton}
          onClick={() => setAudioOn(!audioOn)}
        >
          {audioOn ? (
            <AppImage src={gameConfig.assets.ui.audioOnButton} alt="Audio on" />
          ) : (
            <AppImage
              src={gameConfig.assets.ui.audioOffButton}
              alt="Audio off"
            />
          )}
        </button>
      </div>

      <AppImage
        src={ui.gamePausedTitle}
        className={styles.titleImage}
        alt="Game paused title"
      />

      <button type="button" className={styles.button} onClick={onResumeGame}>
        <AppImage
          src={ui.resumeGameButton}
          alt="Resume game button"
        />
      </button>

      <button type="button" className={styles.button} onClick={onRestartGame}>
        <AppImage
          src={ui.restartGameButton}
          alt="Restart game button"
        />
      </button>

      <button type="button" className={styles.button} onClick={onBackToMenu}>
        <AppImage
          src={ui.backToMenuButton}
          alt="Back to menu button"
        />
      </button>
    </Dialog>
  );
};

export default GamePauseDialog;
