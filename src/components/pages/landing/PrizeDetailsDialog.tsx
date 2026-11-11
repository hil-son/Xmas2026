import { Dialog } from "@mui/material";
import styles from "./PrizeDetailsDialog.module.scss";

interface PrizeDetailsDialogProps {
  open: boolean;
  onClose: () => void;
}

const PrizeDetailsDialog: React.FC<PrizeDetailsDialogProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} className={styles.root}>
      <div className={styles.card}>
        <h2>Prize details</h2>
        <p>
          Grab a gift box in Christmas Crush for a chance to win a Park&apos;n Shop voucher.
          Play from 1 to 18 December. Each match can add a gift box to your total.
        </p>
        <p>
          Check in three days in a row and you earn 30 extra Gold Ingots on the third day.
          Voucher winners are drawn after the campaign ends. This note is temporary.
        </p>
        <button type="button" onClick={onClose}>
          Close
        </button>
      </div>
    </Dialog>
  );
};

export default PrizeDetailsDialog;
