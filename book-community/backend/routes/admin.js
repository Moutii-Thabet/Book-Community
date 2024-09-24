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
    body("value").custom((value, { req }) => {
      const patchedInput = req.query.patchedInput;
      if (
        !patchedInput ||
        (patchedInput !== "image" &&
          patchedInput !== "title" &&
          patchedInput !== "description" &&
          patchedInput !== "rating")
      ) {
        throw new Error("Unexpected field name was attached to the url.");
      }
      if (patchedInput === "title" || patchedInput === "description") {
        if (value.trim().length < 3) {
          throw new Error(
            patchedInput + " must be at least 3 characters long. "
          );
        }
        return true;
      } else if (patchedInput === "rating") {
        if (value < 0 || value > 10) {
          throw new Error("Rating must be between 0 and 10");
        }
        return true;
      }
      console.log("returning true");
      return true;
    }),
  ],
  isAuth,
  patchBook
);

router.delete("/book/:bookId", isAuth, deleteBook);

export default router;
