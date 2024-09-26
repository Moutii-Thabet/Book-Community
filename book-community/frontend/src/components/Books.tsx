import BookCard from "./BookCard"

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
    books:Data
}

export default function Books({books}:BooksProps) {
    return <div className="w-1/2 h-fit mx-auto pt-20">
    <ul className="grid grid-cols-2 gap-8">
      {books.map((book) => {
        return (
          <BookCard
            key={book._id}
            title={book.title}
            creator={book.creator.name}
            date={book.createdAt}
            rating={book.rating}
            imageUrl={book.imageUrl}
            description={book.description}
          />
        );
      })}
    </ul>
  </div>
}