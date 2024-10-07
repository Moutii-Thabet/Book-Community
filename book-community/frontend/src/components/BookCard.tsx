import { twMerge } from "tailwind-merge";

type BookCardProps = {
  creator: string;
  minimize: boolean;
  date: string;
  rating: number;
  title: string;
  id: string;
  imageUrl: string;
  description: string;
  onGetDetails: (id: string) => void;
};

export default function BookCard({
  creator,
  date,
  rating,
  title,
  imageUrl,
  description,
  id,
  minimize,
  onGetDetails,
}: BookCardProps) {
  let ratingColor;
  if (rating >= 0 && rating <= 3) {
    ratingColor = "text-red-700";
  }
  if (rating > 4 && rating < 7) {
    ratingColor = "text-yellow-100";
  }
  if (rating >= 7 && rating < 11) {
    ratingColor = "text-green-700";
  }
  return (
    <div
      className={twMerge(
        "flex rounded-md  flex-col gap-4 h-[45rem] py-10 px-6 text-center bg-orange-300 shadow-lg shadow-gray-800 hover:shadow-white hover:outline hover:outline-white cursor-pointer",
        minimize && "h-80 py-5 px-3 w-fit"
      )}
      onClick={() => onGetDetails(id)}
    >
      <hgroup
        className={twMerge(
          "text-xl  flex flex-col gap-4",
          minimize && "text-md text-center"
        )}
      >
        <div className="flex justify-between px-12">
          {!minimize && (
            <>
              <p>
                Posted by:{" "}
                <span className="font-bold underline">{creator}</span>
              </p>
              <p className="font-bold">·</p>
            </>
          )}
          <p className={twMerge("font-bold", minimize && "w-fit mx-auto")}>
            @{date}
          </p>
        </div>
        <p>
          Rated{" "}
          <span className={twMerge("font-bold", ratingColor)}>{rating}</span>{" "}
          {!minimize ? "by the post author" : ""}
        </p>
        <h1 className={twMerge("text-2xl  font-bold", minimize && "text-xl")}>
          {title}
        </h1>
      </hgroup>
      <div>
        <img
          className={twMerge(
            "w-max h-[25rem]  mx-auto",
            minimize && "h-32 w-fit"
          )}
          src={`http://localhost:3000/${imageUrl}`}
          alt={`book cover of: ${title}`}
        />
      </div>
      <p>
        <span className={twMerge("text-xl", minimize && "text-md")}>
          {description}
        </span>
      </p>
    </div>
  );
}
