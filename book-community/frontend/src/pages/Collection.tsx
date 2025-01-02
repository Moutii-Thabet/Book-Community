import { useRef, useState } from "react";
import Main from "../components/Main";
import Books from "../components/Books";
import { useLoaderData } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchUserBooks } from "../util/http";
import Button from "../components/Button";
import BookModal from "../components/BookModal";

type User = {
  name: string;
};

type Book = {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  rating: number;
  creator: User;
  createdAt: string;
};

type Data = Book[] | [];

type DialogHandle = {
  open: () => void;
  close: () => void;
};

export default function CollectionPage() {
  const [bookId, setBookId] = useState<string>("");
  const modalRef = useRef<DialogHandle>(null);
  const token = useLoaderData() as string;
  const { data, isPending, isError, error } = useQuery<Data>({
    queryKey: ["books", "admin"],
    queryFn: ({ signal }) => fetchUserBooks(signal, token),
  });

  function handleClick() {
    modalRef.current?.open();
  }

  function handleClose() {
    modalRef.current?.close();
    setBookId("");
  }

  function handleGetDetails(id: string) {
    modalRef.current?.open();
    setBookId(id);
  }

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

  if (data && data.length <= 0) {
    content = (
      <div className="w-fit mx-auto">
        <p className="py-[20rem] w-fit mx-auto pr-6 text-3xl text-center">
          <p>No books available at the moment</p>
          <Button text="Add a book" className="mt-4" onClick={handleClick} />
        </p>
      </div>
    );
  }

  if (data && data.length > 0) {
    content = (
      <Books
        books={data}
        minimize={true}
        onAddBook={handleClick}
        onGetDetails={handleGetDetails}
      />
    );
  }

  return (
    <>
      <BookModal bookId={bookId} ref={modalRef} onClose={handleClose} />
      <Main>{content}</Main>
    </>
  );
}
