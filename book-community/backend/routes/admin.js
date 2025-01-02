import { Router } from "express";
import { isAuth } from "../middlewares/auth.js";

import {
  getBooks,
  postBook,
  patchBook,
  deleteBook,
} from "../controllers/admin.js";

import { body } from "express-validator";

const router = Router();

router.get("/books", isAuth, getBooks);

router.post(
  "/book",
  [
    body("title")
      .isString()
      .custom((value) => {
        console.log(value.trim().length);
        if (value.trim().length < 3) {
          throw new Error("Title must be at least 3 characters long.");
        }
        return true;
      }),
    body("description")
      .isString()
      .custom((value) => {
        if (value.trim().length < 3) {
          throw new Error("Title must be at least 3 characters long.");
        }
        return true;
      }),
  ],
  isAuth,
  postBook
);

router.patch(
  "/book/:bookId",
  [
    body("title")
      .isString()
      .custom((value) => {
        console.log(value.trim().length);
        if (value.trim().length < 3) {
          throw new Error("Title must be at least 3 characters long.");
        }
        return true;
      }),
    body("description")
      .isString()
      .custom((value) => {
        if (value.trim().length < 3) {
          throw new Error("Title must be at least 3 characters long.");
        }
        return true;
      }),
  ],
  isAuth,
  patchBook
);

router.delete("/book/:bookId", isAuth, deleteBook);

export default router;
