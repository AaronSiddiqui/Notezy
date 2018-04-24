var Post = require('../models/posts');

module.exports = function (req, res, next) {
  var postTitle = req.params.post_title;

  Post.findOne({ post_title: postTitle }, function (err, post) {
    if (err)
      res.status(500).json(err);

    if (post) {                    //Checks to see if the post exists
      next();
    } else {
      res.render('errors/err-post');
    }
  });
};