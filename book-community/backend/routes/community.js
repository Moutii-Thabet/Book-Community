import { Router } from "express";

import { getBooks, getBook } from "../controllers/community.js";

const router = Router();

router.get("/books", getBooks);

router.get("/book/:bookId", getBook);

export default router;
