import styles from "./PopupCloseButton.module.scss";
import { useLanguage } from "@/i18n/LanguageProvider";

interface PopupCloseButtonProps {
  onClick: () => void;
  className?: string;
}

const PopupCloseButton: React.FC<PopupCloseButtonProps> = ({ onClick, className }) => {
  const { t } = useLanguage();
  return (
    <button
      type="button"
      className={className ? `${styles.close} ${className}` : styles.close}
      onClick={onClick}
      aria-label={t("close")}
    >
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M7 7l10 10M17 7 7 17" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      </svg>
    </button>
  );
};

export default PopupCloseButton;
