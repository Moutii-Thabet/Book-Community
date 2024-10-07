import { twMerge } from "tailwind-merge";
import BookCard from "./BookCard";

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

type BooksProps = {
  books: Data;
  minimize: boolean;
  onAddBook?: () => void;
  onGetDetails: (id: string) => void;
};

export default function Books({
  books,
  minimize,
  onAddBook,
  onGetDetails,
}: BooksProps) {
  return (
    <div className="w-1/2 h-fit mx-auto pt-20">
      <ul
        className={twMerge("grid grid-cols-2 gap-8", minimize && "grid-cols-3")}
      >
        {minimize && (
          <div
            onClick={onAddBook}
            className="flex rounded-md w-[16rem]  flex-col gap-2 text-center bg-orange-300 shadow-lg shadow-gray-800 hover:shadow-white hover:outline hover:outline-white cursor-pointer"
          >
            <p className=" flex flex-col gap-4 w-fit mx-auto my-auto text-3xl font-bold">
              <span>Add Book</span> <br />
              <span className="text-4xl rounded-full bg-orange-400 w-fit mx-auto p-6">
                +
              </span>
            </p>
          </div>
        )}
        {books.map((book) => {
          return (
            <BookCard
              minimize={minimize}
              key={book._id}
              id={book._id}
              title={book.title}
              creator={book.creator.name}
              date={book.createdAt}
              rating={book.rating}
              imageUrl={book.imageUrl}
              description={book.description}
              onGetDetails={onGetDetails}
            />
          );
        })}
      </ul>
    </div>
  );
}
