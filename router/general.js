const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



public_users.post("/register", (req,res) => {
  const {username, password} = req.body;
      // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
  });

// Get the book list available in the shop
public_users.get('/', async (req, res) => {

    const getBooks = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(books);
        }, 100);
      });
    };

    const bookList = await getBooks();
    res.status(200).json(bookList);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;

  
    const getBookByISBN = (isbn) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const book = Object.values(books).find(book => book.isbn === isbn);
          if (book) {
            resolve(book);
          } else {
            reject(new Error('Book not found'));
          }
        }, 100);
      });
    };

    const book = await getBookByISBN(isbn);
    res.status(200).json(book);
  
});
  
// Get book details based on author
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author;

  const getBooksByAuthor = (author) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let foundBooks = Object.values(books).filter(book => book.author === author);
        if (foundBooks.length > 0) {
          resolve(foundBooks);
        } else {
          reject(new Error(`Books by author '${author}' not found.`));
        }
      }, 100); // Simulated delay
    });
  };

  getBooksByAuthor(author)
    .then(foundBooks => {
      res.status(200).json(foundBooks);
    })
    .catch(error => {
      res.status(404).json({ message: error.message });
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title = req.params.title;
  for(let book in books){
    if (books[book].title === title){
      res.send(books[book]);
    }
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
const getBookByTitle = (title) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const book = Object.values(books).find(book => book.title === title);
      if (book) {
        resolve(book);
      } else {
        reject(new Error(`Book with title '${title}' not found.`));
      }
    }, 100); 
  });
};


public_users.get('/title/:title', (req, res) => {
  const title = req.params.title;

  getBookByTitle(title)
    .then(book => {
      res.status(200).json(book);
    })
    .catch(error => {
      res.status(404).json({ message: error.message });
    });
});



module.exports.general = public_users;
