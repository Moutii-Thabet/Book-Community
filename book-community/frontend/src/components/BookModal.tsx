import { ComponentProps, forwardRef } from "react";

import Modal from "./Modal";
import Button from "./Button";
import ImagePicker from "./ImagePicker";
import Input from "./Input";

type DialogHandle = {
  open: () => void;
  close: () => void;
};

type ModalProps = {
  onClose: () => void;
};

export default forwardRef<DialogHandle, ModalProps>(function BookModal(
  { onClose },
  ref
) {
  const fieldNameClass = "text-xl font-bold";
  return (
    <Modal ref={ref}>
      <div className="flex flex-col gap-4 bg-orange-300 px-20 py-20 text-xl text-black">
        <ImagePicker />
        <table className="border-separate border-spacing-y-4 border-spacing-x-4">
          <tr>
            <td className={fieldNameClass}>Title:</td>
            <td>
              <Input type="text" />
            </td>
          </tr>
          <tr>
            <td className={fieldNameClass}>Description:</td>
            <td>
              <Input type="text" />
            </td>
          </tr>
          <tr>
            <td className={fieldNameClass}>Rating:</td>
            <td>
              <Input type="number" />
            </td>
          </tr>
        </table>
        <div className="flex gap-4">
          <Button text="Save" />
          <Button text="Cancel" onClick={onClose} />
        </div>
      </div>
    </Modal>
  );
});
