var express = require('express');
var router = express.Router();
var Course = require('../models/courses');
var modules = require('../routes/modules');
var checkCourse = require('../middleware/check-course')

/* GET courses listing. */
router.get('/', function(req, res, next) {
  res.render('list-courses');
});

/**
 * Returns a single course from our database
 */
router.get('/getCourse/:id', function (req, res, next) {
  var id = req.params.id;

  Course.find({ _id: id }, function (err, course) {
    if (err)
      res.status(500).json(err);

    res.status(200).json(course);
  })
});

/**
 * Returns all courses from our database
 */
router.get('/getCourses', function (req, res, next) {
  Course.find({}, function (err, courses) {
    if (err)
      res.status(500).json(err);

    res.status(200).json(courses);
  });
});

/**
 * Adds courses to our database
 */
router.post('/addCourse', function (req, res, next) {
  // Extract the request body which contains the courses
  var course = new Course(req.body);

  course.save(function (err, savedCourse) {
    if (err)
      res.status(500).json(err);

    res.status(201).json({
      status: "Successfully added the course",
      id: savedCourse._id
    });
  });
});

/**
  Updates a course already in the database
 */
router.put('/updateCourse/:id', function (req, res, next) {
  var id = req.params.id;

  Course.update({ _id: id }, req.body, function (err) {
    if (err)
      res.status(500).json(err);

    res.status(405).json({
      status: "Successfully updated the course"
    });
  });
});

/**
 * Deletes a course from the database
 */
router.delete('/removeCourse/:id', function (req, res, next) {
  var id = req.params.id;

  Course.remove({ _id: id }, function (err) {
    if (err)
      res.status(500).json(err);

    res.status(405).json({
      status: "Successfully removed the course"
    });
  });
});

router.use('/:course_code', checkCourse, modules);  //Checks to see if the course exists and then passes it to modules

module.exports = router;