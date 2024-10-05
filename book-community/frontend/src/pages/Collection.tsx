import { useRef } from "react";
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
  const modalRef = useRef<DialogHandle>(null);
  const token = useLoaderData() as string;
  console.log(token);
  const { data, isPending, isError, error } = useQuery<Data>({
    queryKey: ["event"],
    queryFn: ({ signal }) => fetchUserBooks(signal, token),
  });

  function handleClick() {
    modalRef.current?.open();
  }

  function handleClose() {
    console.log("closing modal...");
    modalRef.current?.close();
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
    console.log(data);
    content = (
      <div className="w-fit mx-auto">
        <p className="py-[14rem] w-fit mx-auto pr-6 text-3xl text-center">
          <p>No books available at the moment</p>
          <Button text="Add a book" className="mt-4" onClick={handleClick} />
        </p>
      </div>
    );
  }

  if (data && data.length > 0) {
    console.log(data);
    content = <Books books={data} />;
  }

  return (
    <>
      <BookModal ref={modalRef} onClose={handleClose} />
      <Main>{content}</Main>
    </>
  );
}
