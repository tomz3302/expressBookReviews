const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{  // Filter the users array for any user with the same username
  let userswithsamename = users.filter((user) => {
      return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
      return true;
  } else {
      return false;
  }
}

const authenticatedUser = (username, password) => {
  
  let validusers = users.filter((user) => {
      return (user.username === username && user.password === password);
  });
  if (validusers.length > 0) {
      return true;
  } else {
      return false;
  }
}
//only registered users can login
regd_users.post("/login", (req,res) => {
  const {username, password} = req.body;
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }
  // Authenticate user
  if (authenticatedUser(username, password)) {
    // Generate JWT access token
    let accessToken = jwt.sign({
        data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken, username
    }
  return res.status(200).send("User successfully logged in");
} else {
  return res.status(208).json({ message: "Invalid Login. Check username and password" });
}


});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let username = req.session.authorization.username;
  let review = req.query.review;
  
  let reviewExists = false;

  
  for (let bookId in books) {
    if (books[bookId].isbn === isbn) {
      
      for (let reviewKey in books[bookId].reviews) {
        if (books[bookId].reviews[reviewKey].user === username) {
          
          books[bookId].reviews[reviewKey].review = review;
          reviewExists = true;
          break;
        }
      }

      if (!reviewExists) {
        const newReviewKey = `review${Object.keys(books[bookId].reviews).length + 1}`;
        books[bookId].reviews[newReviewKey] = { user: username, review: review };
      }

      return res.status(200).send({ message: "Review added/updated successfully." });
    }
  }

  // If ISBN is not found
  return res.status(404).send({ message: "Book not found." });

 
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let username = req.session.authorization.username;

  for (let bookId in books) {
    if (books[bookId].isbn === isbn) {
      
      for (let reviewKey in books[bookId].reviews) {
        if (books[bookId].reviews[reviewKey].user === username) {
          
          delete books[bookId].reviews[reviewKey];
          return res.status(200).send({ message: "Review removed successfully." });
        }
      }
      return res.status(404).send({ message: "Review by this user not found." });

    }
  }
  return res.status(404).send({ message: "Book not found." });

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
