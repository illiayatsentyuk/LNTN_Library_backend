import Book from "../models/book.js";

export const getBooks = async (req, res, next) => {
  try {
    const { take, skip, title, author, sort } = req.query;

    // Build query object
    let query = {};

    // Search by title (case-insensitive)
    if (title) {
      query.title = { $regex: title, $options: "i" };
    }

    // Search by author (case-insensitive)
    if (author) {
      query.author = { $regex: author, $options: "i" };
    }

    // Build sort object
    let sortObject = {};
    if (sort) {
      if (sort.toUpperCase() === "ASC") {
        sortObject.title = 1; // ascending
      } else if (sort.toUpperCase() === "DESC") {
        sortObject.title = -1; // descending
      }
    }

    // Execute query with pagination and sorting
    let booksQuery = Book.find(query);

    // Apply sorting
    if (Object.keys(sortObject).length > 0) {
      booksQuery = booksQuery.sort(sortObject);
    }

    // Apply pagination
    if (skip) {
      booksQuery = booksQuery.skip(parseInt(skip));
    }

    if (take) {
      booksQuery = booksQuery.limit(parseInt(take));
    }

    const books = await booksQuery.exec();
    res.status(200).json(books);
  } catch (error) {
    next(error);
  }
};

export const createBook = async (req, res, next) => {
  const book = req.body;
  const newBook = new Book(book);
  try {
    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    next(error);
  }
};

export const getBookById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const book = await Book.findById(id);
    res.status(200).json(book);
  } catch (error) {
    next(error);
  }
};
