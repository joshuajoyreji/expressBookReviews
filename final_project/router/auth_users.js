const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

regd_users.get("/",(req,res)=>{
  res.send(users);
})

const authenticatedUser = (username,password)=>{ 
  let validuser = users.filter((user)=>{
    return user.username === username && user.password === password;
  })
  if(validuser.length>0)
  {
    return true;
  }
  else{
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  username = req.body.username;
  password = req.body.password;
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }
  if(authenticatedUser(username,password)){
    let token = jwt.sign({
      data: password
    },
    "access",
    {expiresIn: 3600}
    );
    req.session.authorization = {
      token,
      username
    }
    return res.status(200).send("User successfully logged in");
  }
  else{
    return res.status(403).json({message:"Invalid Login. Check username and password"});
  }
});

// Add or Modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const reviewText = req.query.review; 
  const isbn = req.params.isbn;
  const user = req.session.authorization.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!books[isbn].reviews) {
    books[isbn].reviews = [];
  }

  // Check if the user has already posted a review for this book
  const existingReviewIndex = books[isbn].reviews.findIndex(
    (review) => review.user === user
  );

  if (existingReviewIndex !== -1) {
    // If the user has already posted a review, update it
    books[isbn].reviews[existingReviewIndex].reviewText = reviewText;
  } else {
    // If the user hasn't posted a review yet, add a new one
    books[isbn].reviews.push({ user, reviewText });
  }

  return res.status(200).json({ message: "Review added/modified successfully" });
});



// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const user = req.session.authorization.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!books[isbn].reviews || books[isbn].reviews.length === 0) {
    return res.status(404).json({ message: "No reviews found for this book" });
  }
  books[isbn].reviews = books[isbn].reviews.filter((review) => review.user !== user);

  return res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
