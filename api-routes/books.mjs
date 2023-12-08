import express from "express";
import { body } from "express-validator";
import {
  getAllBooks,
  registBook,
  updateBook,
  deliteBook,
  getBookById,
} from "../controllers/booksController.mjs";
import { requestErrorHandler } from "../helpers/helper.mjs";

const router = express.Router();

// api/books
router.get("/", requestErrorHandler(getAllBooks));

router.get("/:id", requestErrorHandler(getBookById));

//using express-validator to check if contents are empty
router.post(
  "/",
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("comment").notEmpty().withMessage("Comment is required"),
  body("rating")
    .notEmpty()
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating is required"),
  requestErrorHandler(registBook)
);

router.patch(
  "/:id",
  body("title").optional().notEmpty().withMessage("Title is required"),
  body("description")
    .optional()
    .notEmpty()
    .withMessage("Description is required"),
  body("comment").optional().notEmpty().withMessage("Comment is required"),
  body("rating")
    .optional()
    .notEmpty()
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating is required"),
  requestErrorHandler(updateBook)
);

router.delete("/:id", requestErrorHandler(deliteBook));

export default router;
