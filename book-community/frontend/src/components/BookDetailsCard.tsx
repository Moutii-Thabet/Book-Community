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

type BookDetailsCardProps = {
  book: Book;
  handleClose: () => void;
};

export default function BookDetailsCard({
  book,
  handleClose,
}: BookDetailsCardProps) {
  console.log(book);
  return (
    <div className="flex flex-col text-center gap-8 text-black">
      <div className="flex justify-evenly text-2xl mt-8 ">
        <p className="underline">{book.creator.name}</p>
        <div className="flex">
          <p className="underline">{book.createdAt}</p>
          <span
            onClick={handleClose}
            className="relative left-[10rem] bottom-6 hover:text-red-600 cursor-pointer bg-orange-400/30 px-4 pt-1 pb-2 rounded-full"
          >
            x
          </span>
        </div>
      </div>
      <h1 className="text-3xl font-bold"> {book.title} </h1>

      <img
        className="w-[40rem] h-[50rem] mx-auto"
        src={`http://localhost:3000/${book.imageUrl}`}
        alt={`book cover of: ${book.title}`}
      />

      <p className="mb-8 text-2xl w-[40rem] text-left mx-auto">
        {book.description}
      </p>
    </div>
  );
}
