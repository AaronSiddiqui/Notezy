var express = require('express');
var router = express.Router();
var User = require('../models/users');
var jwt = require('jsonwebtoken');
var checkAuth = require('../middleware/check-auth')
var multer = require('multer');         //Module to upload files to the database

/**
 * Specification variable to place the file in the './uploads/' directory and what to call them
 */
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/user_pics');
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + ' ' + file.originalname)      //new Date().toISOString() converts the current date to a string
  }
});

/**
 * Specification variable to filter for the file types that can be uploaded to posts
 */
const fileFilter = function (req, file, cb) {
  var fileTypes = ['image/jpeg', 'image/png']                           //File types that are allowed, .jpeg, .png

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

/**
 * Returns a single user from our database based on name
 */
router.get('/getUserByName/:name', function (req, res, next) {
  var name = req.params.name;

  User.findOne({ user_name: name }, function (err, user) {
    if (err)
      res.status(500).json(err);

    res.status(200).json(user);
  })
});

/**
 * Returns a single user from our database based on ID
 */
router.get('/getUserByID/:id', function (req, res, next) {
  var id = req.params.id;

  User.findOne({ _id: id }, function (err, user) {
    if (err)
      res.status(500).json(err);

    res.status(200).json(user);
  })
});

/**
 * Returns all users from our database
 */
router.get('/getUsers', function (req, res, next) {
  User.find({}, function (err, users) {
    if (err)
      res.status(500).json(err);

    res.status(200).json(users);
  });
});

router.post('/register', function (req, res, next) {
  var newUsername = req.body.user_name;
  var newPassword = req.body.password;
  // Check if account already exists
  User.findOne({ user_name: newUsername }, function (err, user) {
    if (err)
      res.status(500).json(err);

    // check to see if theres already a user with that email
    if (user) {
      res.status(409).json({
        status: "info",
        body: "Username already taken"
      });
    } else {
      // If there is no user with that username create the user
      var newUser = new User();

      //Sets the user's credentials
      newUser.user_name = newUsername;
      newUser.password = newUser.generateHash(newPassword);
      newUser.access_token = createJwt({ user_name: newUsername });

      newUser.save(function (err, user) {
        if (err)
          res.status(500).json(err);

        res.cookie('Authorization', 'Bearer ' + user.access_token);
        res.json({ status: "New account created" });
      });
    }
  });
});

router.post('/login', function (req, res, next) {
  var username = req.body.user_name;
  var password = req.body.password;

  User.findOne({ user_name: username }, function (err, user) {
    // if there are any errors, return the error
    if (err)
      res.status(500).json(err);
    // If user account found then check the password
    if (user) {
      // Compare passwords
      if (user.validPassword(password)) {
        // Success : Assign new access token for the session
        user.access_token = createJwt({ user_name: username });
        user.save();
        res.cookie('Authorization', 'Bearer ' + user.access_token);
        res.json({ status: "You successfully logged in" });
      }
      else {
        res.status(401).send({
          status: "error",
          body: "Email or password does not match"
        });
      }
    }
    else {
      res.status(401).send({
        status: "error",
        body: "Username not found"
      });
    }
  });
});

/**
  Updates a user already in the database
 */
router.put('/updateUser/:id', checkAuth, upload.single('profile_pic'), function (req, res, next) {
  var id = req.params.id;

  if (req.file) {
    User.update({ _id: id }, { profile_pic: req.file.path }, function (err) {
      if (err)
        res.status(500).json({
          status: "Could not change image path"
        })
    });
  }
  
  User.update({ _id: id }, req.body, function (err) {
    if (err)
      res.status(500).json(err);

    res.status(405).json({
      status: "Successfully updated the user"
    });
  });
});

/**
 * Deletes a user from the database
 */
router.delete('/removeUser/:id', checkAuth, function (req, res, next) {
  var id = req.params.id;

  User.remove({ _id: id }, function (err) {
    if (err)
      res.status(500).json(err);

    res.status(405).json({
      status: "Successfully removed the user"
    });
  });
});

/**
 * Returns a single user from our database(MY VERSION)
 */
router.get('/:username', function (req, res, next) {
  var username = req.params.username;

  User.findOne({ user_name: username }, function (err, user) {
    if (err)
      res.status(500).json(err);

    if (user) {                    //Checks to see if the user exists
      res.render('profile');
    } else {
      res.status(500).json({
        status: "User doesn't exist"
      })
    }
  });
});

/*
 Creates a JWT
 */
function createJwt(profile) {
  return jwt.sign(profile, "Daniel O'Donell is some boi", {
    expiresIn: '3h'
  });
}

module.exports = router;
