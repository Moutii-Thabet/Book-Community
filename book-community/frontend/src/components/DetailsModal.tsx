import { forwardRef } from "react";
import Modal from "./Modal";

type DialogHandle = {
  open: () => void;
  close: () => void;
};

type DetailsModalProps = {
  onClose: () => void;
  bookid: string;
};

export default forwardRef<DialogHandle, DetailsModalProps>(
  function DetailsModal({ onClose, bookid }, ref) {
    return (
      <Modal onClose={onClose} ref={ref}>
        <div>{bookid}</div>
      </Modal>
    );
  }
);
