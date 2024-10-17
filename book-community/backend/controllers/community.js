import Book from "../models/book.js";

import { throwError } from "../util/error.js";

export async function getBooks(req, res, next) {
  try {
    const books = await Book.find().populate("creator");
    const updatedBooks = books.map((book) => {
      return {
        ...book._doc,
        _id: book._id.toString(),
        createdAt: book.createdAt.toDateString(),
        creator: {
          name: book.creator.name,
        },
      };
    });
    res
      .status(200)
      .json({ message: "Fetched books successfully", books: updatedBooks });
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    next(error);
  }
}

export async function getBook(req, res, next) {
  const bookId = req.params.bookId;
  console.log(bookId);
  try {
    const book = await Book.findById(bookId).populate("creator");
    if (!book) {
      throwError("Book with this id does not exist.", 404);
    }
    const updatedBook = {
      ...book._doc,
      _id: book._id.toString(),
      createdAt: book.createdAt.toDateString(),
      creator: {
        name: book.creator.name,
      },
    };

    res
      .status(200)
      .json({ message: "fetched book successfully.", book: updatedBook });
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    next(error);
  }
}
