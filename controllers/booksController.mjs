import { validationResult } from "express-validator";
import Book from "../models/book.mjs";

// get method, get all books
async function getAllBooks(req, res) {
  try {
    const books = await Book.find().sort({ updatedAt: -1 });
    res.json(books);
  } catch (error) {
    res.status(404).send("Error retrieving books");
  }
}

// get method, get a single book
async function getBookById(req, res) {
  try {
    const _id = req.params.id;
    const book = await Book.findOne({ _id: _id });
    res.json(book);
  } catch (error) {
    res.status(404).send("Error retrieving books");
  }
}

//post method
async function registBook(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errs = errors.array();
      return res.status(400).json(errs);
    }
    const book = new Book(req.body);
    const newBook = await book.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(404).send("Error failed to create book");
  }
}

//patch method
async function updateBook(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errs = errors.array();
      return res.status(400).json(errs);
    }

    const { title, rating, description, comment } = req.body;
    const _id = req.params.id;
    const books = await Book.findById(_id);
    if (title !== undefined) {
      // in case the req was undifined
      books.title = title;
    }
    if (rating !== undefined) {
      books.rating = rating;
    }
    if (description !== undefined) {
      books.description = description;
    }
    if (comment !== undefined) {
      books.comment = comment;
    }
    await books.save();
    res.json(books);
  } catch (error) {
    res.status(404).send("Error failed to edit book");
  }
}

// delete method
async function deliteBook(req, res) {
  try {
    const _id = req.params.id;
    const result = await Book.deleteOne({ _id });
    // console.log(result);
    res.json({ msg: "Book deleted successfully" });
  } catch (error) {
    res.status(500).send("message: Target book not found");
  }
}

export { getAllBooks, getBookById, registBook, updateBook, deliteBook };
