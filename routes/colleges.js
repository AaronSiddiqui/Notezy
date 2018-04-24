var express = require('express');
var router = express.Router();
var College = require('../models/colleges');
var courses = require('../routes/courses')
var checkCollege = require('../middleware/check-college')
var multer = require('multer');         //Module to upload files to the database

/**
 * Specification variable to place the file in the './uploads/' directory and what to call them
 */
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/college_pics');
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
 * Returns a single college from our database based on id
 */
router.get('/getCollege/:id', function (req, res, next) {
  var id = req.params.id;

  College.find({ _id: id }, function (err, college) {
    if (err)
      res.status(500).json(err);

    res.status(200).json(college);
  })
});

/**
 * Returns all colleges from our database
 */
router.get('/getColleges/', function (req, res, next) {
  College.find(function (err, college) {
    if (err)
      res.status(500).json(err);

    res.status(200).json(college);
  })
});

/**
 * Adds colleges to our database
 */
router.post('/addCollege/', upload.single('college_image'), function (req, res, next) {
  // Extract the request body which contains the colleges
  var college = new College(req.body);

  if (req.file) {
    college.college_image = req.file.path
  }

  college.save(function (err, savedCollege) {
    if (err)
      res.status(500).json(err);

    res.status(405).json({
      status: "Successfully added the college",
      id: savedCollege._id
    });
  });
});

/**
  Updates a college already in the database
 */
router.put('/updateCollege/:id', upload.single('college_image'), function (req, res, next) {
  var id = req.params.id;

  if (req.file) {
    College.update({ _id: id }, { college_image: req.file.path }, function(err) {
      if(err)
        res.status(500).json({
          status: "Could not change image path"
        })
    });
  }

  College.update({ _id: id }, req.body, function (err) {
    if (err)
      res.status(500).json(err);

    res.status(405).json({
      status: "Successfully updated the college"
    });
  });
});

/**
 * Deletes a college from the database
 */
router.delete('/removeCollege/:id', function (req, res, next) {
  var id = req.params.id;

  College.remove({ _id: id }, function (err) {
    if (err)
      res.status(500).json(err);

    res.json({
      status: "Successfully removed the college"
    });
  });
});

router.use('/:college_name', checkCollege, courses);  //Checks to see if the college exists and then passes it to courses

module.exports = router;