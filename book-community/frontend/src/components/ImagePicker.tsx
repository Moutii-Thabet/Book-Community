import { ChangeEvent, useRef } from "react";

type ImagePickerProps = {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  imagePreview: null | string;
};

export default function ImagePicker({
  onChange,
  onRemoveImage,
  imagePreview,
}: ImagePickerProps) {
  const imageRef = useRef<HTMLInputElement>(null);

  function handleClick() {
    imageRef.current?.click();
  }

  return (
    <>
      <div className="cursor-pointer w-fit mx-auto bg-orange-400/20 px-6 py-6 rounded-lg">
        {!imagePreview && (
          <p
            onClick={handleClick}
            className=" p-14 border-dashed border-orange-500 border-4 text-2xl font-bold"
          >
            Add an image
          </p>
        )}
        {imagePreview && (
          <div className="relative">
            <div
              onClick={onRemoveImage}
              className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
            >
              <p className="text-white text-xl">Click to remove image</p>
            </div>
            <img
              className="w-40 h-40 "
              src={imagePreview}
              alt="selected image"
            />
          </div>
        )}
        <input ref={imageRef} type="file" hidden onChange={onChange} />
      </div>
    </>
  );
}
