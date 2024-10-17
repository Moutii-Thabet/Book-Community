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
};

export default function BookDetailsCard({ book }: BookDetailsCardProps) {
  return <div>{book.title}</div>;
}
