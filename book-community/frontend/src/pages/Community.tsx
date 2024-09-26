import Main from "../components/Main";
import BookCard from "../components/BookCard";
import Books from "../components/Books";
import { useQuery } from "@tanstack/react-query";
import { fetchBooks } from "../util/http";

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

export default function CommunityPage() {
  const { data, isPending, isError, error } = useQuery<Data>({
    queryKey: ["books"],
    queryFn: fetchBooks,
  });
  let content: JSX.Element | undefined;

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
    content = <Books books={data} />
  }

  return (
    <>
      <Main>{content}</Main>
    </>
  );
}
