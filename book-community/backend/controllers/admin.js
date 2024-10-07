import Book from "../models/book.js";
import fs from "fs/promises";

import { validationResult } from "express-validator";

import { throwError } from "../util/error.js";

export async function getBooks(req, res, next) {
  const userId = req.userId;
  console.log(userId);
  try {
    const books = await Book.find({ creator: userId }).populate("creator");
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
    res.status(200).json({
      message: "Fetched your books successfully",
      books: updatedBooks,
    });
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    next(error);
  }
}

export async function postBook(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (req.file) {
        await fs.unlink(req.file.path);
      }
      throwError("Invalid Input(s)", 417, errors.array());
    }
    const image = req.file;
    if (!image) {
      throwError("Attached file is not an image", 415);
    }
    const title = req.body.title;
    const description = req.body.description;
    const rating = Number(req.body.rating) || 99;

    const book = new Book({
      title,
      description,
      imageUrl: image.path,
      rating,
      creator: req.userId,
    });

    await book.save();

    res.status(201).json({ message: "book added successfully" });
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    next(error);
  }
}

export async function patchBook(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (req.file) {
        await fs.unlink(req.file.path);
      }
      throwError("Invalid Input", 417, errors.array());
    }
    const patchedInput = req.query.patchedInput;

    const book = await Book.findById(req.params.bookId);
    if (!book) {
      throwError("Book with this id does not exist.", 404);
    }
    if (book.creator.toString() !== req.userId) {
      throwError("Not authorized", 401);
    }
    if (patchedInput === "image") {
      if (req.file) {
        //console.log(req.file);
        await fs.unlink(book.imageUrl);
        book.imageUrl = req.file.path;
        await book.save();
        return res.status(200).json({ message: "book updated successfully" });
      }
      throwError("Attached file is not an image", 415);
    }
    const patchedInputValue = req.body.value;
    book[patchedInput] = patchedInputValue;
    await book.save();
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    next(error);
  }
}

export async function deleteBook(req, res, next) {
  const bookId = req.params.bookId;
  try {
    const book = await Book.findById(bookId);
    if (!book) {
      throwError("Book with this id does not exist", 404);
    }
    if (book.creator.toString() !== req.userId) {
      throwError("Not authorized", 401);
    }

    await Book.findByIdAndDelete(bookId);
    await fs.unlink(book.imageUrl);
    res.status(200).json({ message: "book deleted successfully" });
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    next(error);
  }
}
