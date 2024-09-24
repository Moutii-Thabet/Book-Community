import { useRef, forwardRef, useImperativeHandle } from "react";
import { createPortal } from "react-dom";

type DialogHandle = {
  open: () => void;
};

type ModalProps = {
  children: React.ReactNode;
};

export default forwardRef<DialogHandle, ModalProps>(function Modal(
  { children },
  ref
) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useImperativeHandle(ref, () => ({
    open: () => dialogRef.current?.showModal(),
  }));
  return createPortal(
    <dialog ref={dialogRef}>{children}</dialog>,
    document.getElementById("modal-root")!
  );
});
