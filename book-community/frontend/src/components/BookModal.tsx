import { ComponentProps, forwardRef } from "react";

import Modal from "./Modal";
import NewBook from "./NewBook";

type DialogHandle = {
  open: () => void;
};

type ModalProps = ComponentProps<"dialog">

export default forwardRef<DialogHandle,ModalProps>(function BookModal(props, ref) {
  return (
    <Modal ref={ref}>
        <NewBook/>
    </Modal>
  );
});
