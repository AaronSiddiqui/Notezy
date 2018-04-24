var express = require('express');
var router = express.Router();
var Comment = require('../models/comments');
var checkAuth = require('../middleware/check-auth');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

/**
 * Returns a single comment from our database(MY VERSION)
 */
router.get('/getComment/:id', function (req, res, next) {
    var id = req.params.id;

    Comment.find({ _id: id }, function (err, comment) {
        if (err)
            res.status(500).json(err);

        res.status(200).json(comment);
    })
});

/**
 * Returns all comments from our database
 */
router.get('/getComments', function (req, res, next) {
    Comment.find({}, function (err, comments) {
        if (err)
            res.status(500).json(err);

        res.status(200).json(comments);
    });
});

/**
 * Adds comments to our database
 */
router.post('/addComment', function (req, res, next) {
    // Extract the request body which contains the comments
    var comment = new Comment(req.body);

    comment.save(function (err, savedComment) {
        if (err)
            res.status(500).json(err);

        res.status(201).json({
            status: "Successfully added the comment",
            id: savedComment._id
        });
    });
});

/**
  Updates a comment already in the database
 */
router.put('/updateComment/:id', function (req, res, next) {
    var id = req.params.id;

    Comment.update({ _id: id }, req.body, function (err) {
        if (err)
            res.status(500).json(err);

        res.status(405).json({
            status: "Successfully updated the comment"
        });
    });
});

/**
 * Deletes a comment from the database
 */
router.delete('/removeComment/:id', function (req, res, next) {
    var id = req.params.id;

    Comment.remove({ _id: id }, function (err) {
        if (err)
            res.status(500).json(err);

        res.status(405).json({
            status: "Successfully removed the comment"
        });
    });
});

module.exports = router;