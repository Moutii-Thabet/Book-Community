import { twMerge } from "tailwind-merge";

type BookCardProps = {
  creator: string;
  date: string;
  rating: number;
  title: string;
  imageUrl: string;
  description: string;
};

export default function BookCard({
  creator,
  date,
  rating,
  title,
  imageUrl,
  description,
}: BookCardProps) {
  let ratingColor;
  if (rating >= 0 && rating <= 4) {
    ratingColor = "text-red-700";
  }
  if (rating > 4 && rating < 8) {
    ratingColor = "text-yellow-100";
  }
  if (rating >= 8 && rating < 11) {
    ratingColor = "text-green-700";
  }
  return (
    <div className="flex rounded-md  flex-col gap-4 h-[45rem] md:h-[30rem] py-10 px-6 text-center bg-orange-300 shadow-lg shadow-gray-800">
      <hgroup className="text-xl md:text-md flex flex-col gap-4 md:text-sm">
        <div className="flex justify-between px-12">
          <p>
            Posted by: <span className="font-bold underline">{creator}</span>
          </p>
          <p className="font-bold">·</p>
          <p className="font-bold">@{date}</p>
        </div>
        <p>
          Rated:{" "}
          <span className={twMerge("font-bold", ratingColor)}>{rating}</span> by
          the post author
        </p>
        <h1 className="text-2xl md:text-xl font-bold">{title}</h1>
      </hgroup>
      <div>
        <img
          className="h-[15rem] w-max mx-auto"
          src={`http://localhost:3000/${imageUrl}`}
          alt={`book cover of: ${title}`}
        />
      </div>
      <p>
        <span className="text-xl">{description}</span>
      </p>
    </div>
  );
}
