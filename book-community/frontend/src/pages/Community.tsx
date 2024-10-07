import Main from "../components/Main";
import Books from "../components/Books";
import { useQuery } from "@tanstack/react-query";
import { fetchBooks } from "../util/http";
import { useSearchParams } from "react-router-dom";
import { useRef } from "react";

import DetailsModal from "../components/DetailsModal";

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

export default function CommunityPage() {
  const detailsRef = useRef<DialogHandle>(null);
  const [searchParams, setSearchParams] = useSearchParams({});
  const { data, isPending, isError, error } = useQuery<Data>({
    queryKey: ["books"],
    queryFn: fetchBooks,
  });
  let content: JSX.Element | undefined;
  console.log(searchParams);

  function handleGetDetails(id: string) {
    detailsRef.current?.open();
    setSearchParams({ bookid: id });
  }

  function handleClose() {}

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
        <p className="py-[20rem] pr-6 text-3xl">
          No books available at the moment
        </p>
      </div>
    );
  }

  if (data && data.length > 0) {
    content = (
      <Books onGetDetails={handleGetDetails} books={data} minimize={false} />
    );
  }

  return (
    <>
      <DetailsModal ref={detailsRef} onClose={handleClose} />
      <Main>{content}</Main>
    </>
  );
}
