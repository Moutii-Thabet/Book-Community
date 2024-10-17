import { forwardRef } from "react";
import Modal from "./Modal";
import { useQuery } from "@tanstack/react-query";

import { fetchBook } from "../util/http";
import BookDetailsCard from "./BookDetailsCard";

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
    const { data, isError, isPending, error } = useQuery({
      queryKey: ["event", bookid],
      queryFn: () => fetchBook(bookid),
    });
    let content;

    if (isPending) {
      content = (
        <div className="w-fit mx-auto">
          <span className="loading loading-lg mt-[20rem] ml-12 "></span>
          <p className="py-6 pr-6 text-2xl">Loading Data...</p>
        </div>
      );
    }

    if (isError && error) {
      content = (
        <div className="w-fit mx-auto">
          <p className="py-[20rem] pr-6 text-3xl">{error.message}</p>
        </div>
      );
    }

    if (data) {
      content = (
        <div>
          <BookDetailsCard book={data} />
        </div>
      );
    }

    return (
      <Modal onClose={onClose} ref={ref}>
        <div className="w-[40rem] h-[50rem]">{content}</div>
      </Modal>
    );
  }
);
