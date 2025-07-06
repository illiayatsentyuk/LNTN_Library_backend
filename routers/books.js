import express from "express";
import { getBooks, createBook, getBookById } from "../controllers/books.js";
import { isAuth } from "../middleware/isAuth.js";

const router = express.Router();

router.get("/", getBooks);
router.post("/", isAuth, createBook);
router.get("/:id", getBookById);

export default router;
