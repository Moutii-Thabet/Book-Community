import { ChangeEvent, useState, forwardRef, useEffect, useRef } from "react";
import { useRouteLoaderData } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

import Modal from "./Modal";
import Button from "./Button";
import ImagePicker from "./ImagePicker";
import Input from "./Input";
import queryClient, {
  addBook,
  editBook,
  fetchBook,
  deleteBook,
} from "../util/http";
import DeleteModal from "./DeleteModal";

type DialogHandle = {
  open: () => void;
  close: () => void;
};

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

type Data = {
  book: Book;
  message: string;
};

type ModalProps = {
  onClose: () => void;
  bookId: string;
};

type Inputs = {
  image?: File | null;
  title: string;
  description: string;
  rating?: number;
};

type CustomError = {
  message: string;
  errorData:
    | {
        type: string;
        value: string | undefined;
        msg: string;
        path: string;
        location: string;
      }[]
    | null;
};

export default forwardRef<DialogHandle, ModalProps>(function BookModal(
  { onClose, bookId },
  ref
) {
  const deleteRef = useRef<HTMLDialogElement>(null);
  const token = useRouteLoaderData("collection") as string;
  const { data: bookData, isError } = useQuery<Data>({
    queryKey: ["book", bookId],
    queryFn: () => fetchBook(bookId),
    enabled: bookId !== "",
  });
  if (isError) {
    onClose();
  }

  const [previewImage, setPreviewImage] = useState<null | string>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Inputs>();

  async function urlToFile(imageUrl: string) {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], "image." + imageUrl.split(".")[1], {
        type: blob.type,
      });
      setSelectedImage(file);
    } catch (error) {
      console.log(error);
      setSelectedImage(null);
    }
  }

  useEffect(() => {
    if (bookData && bookData.book.imageUrl) {
      const imageUrl = "http://localhost:3000/" + bookData?.book.imageUrl;
      setPreviewImage(imageUrl);
      urlToFile(imageUrl);
    }
    reset({
      title: bookData?.book.title,
      description: bookData?.book.description,
      rating: bookData?.book.rating,
    });
  }, [bookData, reset]);

  const { mutateAsync } = useMutation({
    mutationFn: addBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books", "admin"] });
      onClose();
    },
    onError: (error: CustomError) => {
      if (error.errorData) {
        toast((t) => {
          return (
            <span className="flex flex-col gap-2">
              {error.errorData!.map((error) => (
                <p className="text-red-600">{error.msg}</p>
              ))}

              <button onClick={() => toast.dismiss(t.id)}>Dismiss</button>
            </span>
          );
        });
      } else {
        toast((t) => {
          return (
            <span>
              <p className="text-red-600">{error.message}</p>
              <button onClick={() => toast.dismiss(t.id)}>Dismiss</button>
            </span>
          );
        });
      }
    },
  });

  const { mutateAsync: patchBook } = useMutation({
    mutationFn: editBook,
    onMutate: async (data) => {
      const newBook = Object.fromEntries(data.data.entries());
      await queryClient.cancelQueries({ queryKey: ["books", "admin"] });
      const previousBooks = queryClient.getQueryData([
        "books",
        "admin",
      ]) as Book[];

      const bookIndex = previousBooks.findIndex((book) => book._id === bookId);
      const newBooks = [...previousBooks];
      newBooks[bookIndex] = {
        ...newBooks[bookIndex],
        title: newBook.title as string,
        description: newBook.description as string,
        rating: +newBook.rating,
      };
      queryClient.setQueryData(["books", "admin"], newBooks);
      onClose();
      return { previousBooks };
    },
    onError(error, _variables, context) {
      console.log(error);
      queryClient.setQueryData(["books", "admin"], context?.previousBooks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["books", "admin"] });
    },
  });

  const { mutateAsync: removeBook } = useMutation({
    mutationFn: deleteBook,
    onError: (error) => {
      onClose();
      toast((t) => {
        return (
          <span>
            <p className="text-red-600">{error.message}</p>
            <button onClick={() => toast.dismiss(t.id)}>Dismiss</button>
          </span>
        );
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["books", "admin"] });
    },
  });

  const fieldNameClass = "text-2xl font-bold";

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    const extension = file?.type.split("/")[1];
    if (extension === "png" || extension === "jpg" || extension === "jpeg") {
      if (file) {
        setSelectedImage(file);
        const reader = new FileReader();

        reader.onloadend = () => {
          setPreviewImage(reader.result as string); // FileReader returns the result as a Data URL
        };

        reader.readAsDataURL(file); // Read the file as Data URL
      }
    }
  }

  function handleCloseModal() {
    setPreviewImage(null);
    reset();
  }

  function handleRemoveImage() {
    setPreviewImage(null);
  }

  async function onSubmit(data: Inputs) {
    data.image = selectedImage;
    if (data.image) {
      const fd = new FormData();
      fd.append("title", data.title);
      fd.append("description", data.description);
      fd.append("image", data.image);
      fd.append("rating", data.rating!.toString());
      if (bookId !== "") {
        await patchBook({ id: bookId, token, data: fd });
      } else {
        await mutateAsync({ data: fd, token });
      }
    }
    reset();
  }

  function handleDelete() {
    deleteRef.current?.showModal();
  }

  function handleCancelDelete() {
    deleteRef.current?.close();
  }

  async function handleConfirmDelete() {
    reset();
    onClose();
    await removeBook({ bookId, token });
    deleteRef.current?.close();
  }

  return (
    <>
      <DeleteModal
        confirmDelete={handleConfirmDelete}
        cancelDelete={handleCancelDelete}
        ref={deleteRef}
      />
      <Modal onClose={handleCloseModal} ref={ref}>
        <Toaster
          position="top-center"
          toastOptions={{ duration: 5000, className: "mt-20 text-2xl" }}
        />
        <div className="flex flex-col gap-10  px-20 py-20 text-xl text-black text-center">
          {bookData && (
            <p
              title="Delete"
              className="w-fit absolute right-6 top-6 text-right cursor-pointer"
              onClick={handleDelete}
            >
              <FontAwesomeIcon
                icon={faTrash}
                size="2xl"
                style={{ color: "#ff0000" }}
              />
            </p>
          )}

          <h1 className="text-4xl font-bold w-fit mx-auto">
            {bookData ? "Edit your book" : "Add a book"}
          </h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ImagePicker
              onRemoveImage={handleRemoveImage}
              onChange={handleChange}
              imagePreview={previewImage}
            />
            <table className="border-separate border-spacing-y-4 border-spacing-x-4">
              <tbody>
                <tr>
                  <td className={fieldNameClass}>Title:</td>
                  <td>
                    <Input
                      key="title"
                      {...register("title", {
                        required: "The title field is required",
                        minLength: {
                          value: 2,
                          message:
                            "The title must be at least 2 characters long",
                        },
                      })}
                      type="text"
                      placeholder="Title"
                      error={errors.title}
                    />
                  </td>
                </tr>
                <tr>
                  <td className={fieldNameClass}>Description:</td>
                  <td>
                    <Input
                      key="description"
                      {...register("description", {
                        required: "The description field is required",
                        minLength: {
                          value: 2,
                          message:
                            "The description must be at least 2 characters long",
                        },
                      })}
                      type="text"
                      placeholder="Description"
                      error={errors.description}
                    />
                  </td>
                </tr>
                <tr>
                  <td className={fieldNameClass}>Rating:</td>
                  <td>
                    <Input
                      key="rating"
                      {...register("rating", {
                        required: "The rating field is required",
                        min: {
                          value: 0,
                          message: "The rating must be between 0 and 10",
                        },
                        max: {
                          value: 10,
                          message: "The rating must be between 0 and 10",
                        },
                      })}
                      type="number"
                      min={0}
                      max={10}
                      placeholder="Rating"
                      error={errors.rating}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="flex gap-4">
              <Button text="Save" />
              <Button type="reset" text="Cancel" onClick={onClose} />
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
});
