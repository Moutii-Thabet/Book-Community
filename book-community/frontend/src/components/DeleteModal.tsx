type DeleteModalProps = {
  ref: React.RefObject<HTMLDialogElement>;
  confirmDelete: () => void;
  cancelDelete: () => void;
};

export default function DeleteModal({
  ref,
  cancelDelete,
  confirmDelete,
}: DeleteModalProps) {
  return (
    <dialog
      ref={ref}
      className="bg-orange-300 rounded-lg border-2 border-solid border-slate-950 shadow-lg shadow-gray-800"
    >
      <div className="text-2xl text-black flex flex-col gap-8 px-10 py-8">
        <p className="font-bold">Are you Sure you want to DELETE this book?</p>
        <div className="flex justify-evenly w-full">
          <button
            onClick={confirmDelete}
            className="px-4 py-2 bg-red-500 rounded-md"
          >
            Delete
          </button>
          <button
            onClick={cancelDelete}
            className="hover:bg-black/30 px-4 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </dialog>
  );
}
