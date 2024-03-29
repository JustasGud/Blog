const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
const pages = ["Home", "About", "Contact", "Compose"];
//let posts = [];
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// adding mongo db connection to blogDB
mongoose.connect("mongodb://localhost:27017/blogDB");

// creating blog shema
const blogSchema = new mongoose.Schema({
  title: String,
  body: String,
});

// creating post model
const Post = mongoose.model("Post", blogSchema);

app.get("/", function (req, res) {
  Post.find({}, function (err, posts) {
    if (err) {
      console.log(err);
    } else {
      posts.forEach((post) => {
        // console.log(post.title, post.body);
      });
      res.render("home", {
        pageTitle: pages[0],
        content: homeStartingContent,
        postArray: posts,
      });
    }
  });
});

app.get("/about", function (req, res) {
  res.render("about", { pageTitle: pages[1], content: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { pageTitle: pages[2], content: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose", { pageTitle: pages[3] });
});

app.get("/posts/:postId", (req, res) => {
  const requestedPostId = req.params.postId;

  Post.findOne({ _id: requestedPostId }, function (err, post) {
    res.render("post", {
      postObjectTitle: post.title,
      postObjectBody: post.body,
    });
  });
});

app.post("/compose", function (req, res) {
  // collection info from the end user about post title and body
  const post = {
    title: req.body.postTitle,
    body: req.body.postBody,
  };

  // creating new document in blogDB based on end user input
  const newPost = new Post({
    title: post.title,
    body: post.body,
  });

  // saving post data in blogDB
  newPost.save(function (err) {
    if (!err) {
      res.redirect("/");
    }
  });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
