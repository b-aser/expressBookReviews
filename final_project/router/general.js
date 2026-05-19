const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!isValid(username)) {
    return res.status(400).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});

// Task 10: Get the book list available in the shop using async/await with Axios
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:2000/');
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

// Task 11: Get book details based on ISBN using async/await with Axios
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const response = await axios.get(`http://localhost:2000/isbn/${isbn}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Task 12: Get book details based on author using Promise callbacks
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  new Promise((resolve, reject) => {
    const authorBooks = Object.values(books).filter(
      book => book.author.toLowerCase() === author.toLowerCase()
    );
    if (authorBooks.length > 0) {
      resolve(authorBooks);
    } else {
      reject("No books found for this author");
    }
  })
    .then(authorBooks => res.status(200).json(authorBooks))
    .catch(err => res.status(404).json({ message: err }));
});

// Task 13: Get all books based on title using Promise callbacks
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  new Promise((resolve, reject) => {
    const titleBooks = Object.values(books).filter(
      book => book.title.toLowerCase() === title.toLowerCase()
    );
    if (titleBooks.length > 0) {
      resolve(titleBooks);
    } else {
      reject("No books found with this title");
    }
  })
    .then(titleBooks => res.status(200).json(titleBooks))
    .catch(err => res.status(404).json({ message: err }));
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
