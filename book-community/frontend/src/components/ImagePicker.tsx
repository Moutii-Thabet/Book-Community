import { ChangeEvent, useRef, useState } from "react";

export default function ImagePicker() {
  const imageRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<null | string>(null);

  function handleClick() {
    imageRef.current?.click();
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      // When file reading is complete, set the preview URL
      reader.onloadend = () => {
        setImagePreview(reader.result as string); // FileReader returns the result as a Data URL
      };

      reader.readAsDataURL(file); // Read the file as Data URL
    }
  }
  return (
    <>
      <div onClick={handleClick} className="cursor-pointer">
        {!imagePreview && (
          <p className="w-fit mx-auto p-16 border-dashed border-orange-500 border-4 text-xl">
            Add an image
          </p>
        )}
        {imagePreview && (
          <img
            className="w-40 h-40 mx-auto"
            src={imagePreview}
            alt="selected image"
          />
        )}
        <input ref={imageRef} type="file" hidden onChange={handleChange} />
      </div>
    </>
  );
}
