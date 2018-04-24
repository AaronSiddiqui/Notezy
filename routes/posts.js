var express = require('express');
var path = require('path');
var router = express.Router();
var Post = require('../models/posts');
var checkPost = require('../middleware/check-post');
var multer = require('multer');         //Module to upload files to the database

/**
 * Specification variable to place the file in the './uploads/' directory and what to call them
 */
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/posts');
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + ' ' + file.originalname)      //new Date().toISOString() converts the current date to a string
  }
});

/**
 * Specification variable to filter for the file types that can be uploaded to posts
 */
const fileFilter = function (req, file, cb) {
  var fileTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword',                           //File types that are allowed
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',                                      //.jpeg, .png, .pdf, .doc, .docx, .ppt, .pptx
    'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation']

  if (fileTypes.indexOf(file.mimetype) > -1) {     //Checks to see if file.mimetype is in the fileFilter array
    cb(null, true);
  } else {
    cb(null, false);
  }
};

/**
 * Adds the specification variables to 'multer' and saves them in the upload variable
 */
var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10       //Sets the file size limit to 10MB
  },
  fileFilter: fileFilter
});

/* GET posts listing. */
router.get('/', function (req, res, next) {
  res.render('list-posts');
});

router.get('/createPost', function (req, res, next) {   //Renders the page for the client to create a post
  res.render('create-post');
});

/**
 * Returns a single post from the database based on ID
 */
router.get('/getPost/:id', function (req, res, next) {
  var id = req.params.id;

  Post.find({ _id: id }, function (err, post) {
    if (err)
      res.status(500).json(err);

    res.status(200).json(post);
  });
});

/**
 * Returns all the posts from the database
 */
router.get('/getPosts', function (req, res, next) {
  Post.find({}, function (err, posts) {
    if (err)
      res.status(500).json(err);

    res.status(200).json(posts);
  });
});

/**
 * Adds posts to our database
 */
router.post('/addPost', upload.any(), function (req, res, next) {
  var post = new Post(req.body);

  for (var i = 0; i < req.files.length; i++) {
    post.post_file.push(req.files[i].path);
  }

  post.save(function (err, savedPost) {
    if (err)
      res.status(500).json(err);

    res.status(201).json({
      status: "Successfully added the post",
      id: savedPost._id
    });
  });
});

/**
  Updates a post already in the database
 */
router.put('/updatePost/:id', upload.single('post_file'), function (req, res, next) {
  var id = req.params.id;

  if (req.file) {
    Post.update({ _id: id }, { post_file: req.file.path }, function (err) {
      if (err)
        res.status(500).json({
          status: "Could not change file path"
        })
    });
  }

  Post.update({ _id: id }, req.body, function (err) {
    if (err)
      res.status(500).json(err);

    res.status(405).json({
      status: "Successfully updated the post"
    });
  })
});

/**
 * Deletes a post from the database
 */
router.delete('/removePost/:id', function (req, res, next) {
  var id = req.params.id;

  Post.remove({ _id: id }, function (err) {
    if (err)
      res.status(500).json(err);

    res.status(405).json({
      status: "Successfully removed the post"
    });
  });
});

router.get('/:post_title', checkPost, function (req, res, next) {        //Checks to see if the post exists and renders the single-post page
  res.render('single-post');
});

/**
 * Returns a single post from the database based on post title
 */
router.get('/:post_title/getPost', function (req, res, next) {
  var postTitle = req.params.post_title;

  Post.findOne({ post_title: postTitle }, function (err, post) {
    if (err)
      res.status(500).json(err);

    res.status(200).json(post);
  });
});

module.exports = router;