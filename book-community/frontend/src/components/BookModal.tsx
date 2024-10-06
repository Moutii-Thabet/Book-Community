import { ChangeEvent, useState, forwardRef } from "react";
import { useRouteLoaderData } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";

import Modal from "./Modal";
import Button from "./Button";
import ImagePicker from "./ImagePicker";
import Input from "./Input";
import queryClient, { addBook } from "../util/http";

type DialogHandle = {
  open: () => void;
  close: () => void;
};

type ModalProps = {
  onClose: () => void;
};

type Inputs = {
  image?: File | null;
  title: string;
  description: string;
  rating?: number;
};

export default forwardRef<DialogHandle, ModalProps>(function BookModal(
  { onClose },
  ref
) {
  const [previewImage, setPreviewImage] = useState<null | string>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Inputs>();

  const { mutateAsync } = useMutation({
    mutationFn: addBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books", "admin"] });
      onClose();
    },
  });

  const token = useRouteLoaderData("collection") as string;

  const fieldNameClass = "text-2xl font-bold";

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    const extension = file?.type.split("/")[1];
    console.log(file);
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
      await mutateAsync({ data: fd, token });
    }
  }

  return (
    <Modal onClose={handleCloseModal} ref={ref}>
      <div className="flex flex-col gap-10  px-20 py-20 text-xl text-black text-center">
        <h1 className="text-4xl font-bold w-fit mx-auto">Add a book</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ImagePicker
            onRemoveImage={handleRemoveImage}
            onChange={handleChange}
            imagePreview={previewImage}
          />
          <table className="border-separate border-spacing-y-4 border-spacing-x-4">
            <tr>
              <td className={fieldNameClass}>Title:</td>
              <td>
                <Input
                  key="title"
                  {...register("title", {
                    required: "The title field is required",
                    minLength: {
                      value: 2,
                      message: "The title must be at least 2 characters long",
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
                  placeholder="Rating"
                  error={errors.rating}
                />
              </td>
            </tr>
          </table>
          <div className="flex gap-4">
            <Button text="Save" />
            <Button type="button" text="Cancel" onClick={onClose} />
          </div>
        </form>
      </div>
    </Modal>
  );
});
