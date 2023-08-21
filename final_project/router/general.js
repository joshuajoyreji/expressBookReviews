const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

public_users.post("/register", (req,res) => {
  username = req.body.username;
  password = req.body.password;
  if(!username || !password){
    return res.status(404).json({message: "Invalid username or password"});
  }
  else{
    if(!doesExist(username)){
      users.push({username:username, password:password})
      return res.status(200).send("User successfully registered");
    }
    else{
      return res.status(404).send("User already exists");
    }
  }
  
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,3));
  // res.send(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  isbn = req.params.isbn
  res.send(books[isbn])
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  author = req.params.author
  for (let bookId in books){
    if (author === books[bookId].author){
      res.send(books[bookId])
    }
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  title = req.params.title
  for (let bookId in books){
    if (title === books[bookId].title){
      res.send(books[bookId])
    }
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  isbn = req.params.isbn
  res.send(books[isbn].review)
});

module.exports.general = public_users;
