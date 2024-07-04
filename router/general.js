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
public_users.get('/',function (req, res) {
  res.status(300).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  for(let book in books){
    if(books[book].isbn === isbn){
      res.status(300).send(books[book]);
    }
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  let foundBooks = [];

  for (let book in books) {
    if (books[book].author === author) {
      foundBooks.push(books[book]);
    }
  }

  if (foundBooks.length > 0) {
    res.json(foundBooks);
  } else {
    res.status(404).send(`Books by author '${author}' not found.`);
  }
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
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  for(let book in books){
    if(books[book].isbn === isbn){
      res.status(300).send(books[book].reviews);
    }
  }
});



module.exports.general = public_users;
