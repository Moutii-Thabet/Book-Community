import { forwardRef } from "react";
import { useSearchParams } from "react-router-dom";
import Modal from "./Modal";

type DialogHandle = {
  open: () => void;
  close: () => void;
};

type DetailsModalProps = {
  onClose: () => void;
};

export default forwardRef<DialogHandle, DetailsModalProps>(
  function DetailsModal({ onClose }, ref) {
    const [searchParams] = useSearchParams();
    return (
      <Modal onClose={onClose} ref={ref}>
        <div>{searchParams.get("bookid")}</div>
      </Modal>
    );
  }
);
