import { useRef, forwardRef, useImperativeHandle } from "react";
import { createPortal } from "react-dom";

type DialogHandle = {
  open: () => void;
  close: () => void;
};

type ModalProps = {
  children: React.ReactNode;
  onClose: () => void;
};

export default forwardRef<DialogHandle, ModalProps>(function Modal(
  { children, onClose },
  ref
) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useImperativeHandle(ref, () => ({
    open: () => dialogRef.current?.showModal(),
    close: () => dialogRef.current?.close(),
  }));
  return createPortal(
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="bg-orange-300 rounded-lg border-2 border-solid border-slate-950 shadow-lg shadow-gray-800"
    >
      {children}
    </dialog>,
    document.getElementById("modal-root")!
  );
});
