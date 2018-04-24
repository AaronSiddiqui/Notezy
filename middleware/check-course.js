var Course = require('../models/courses');

module.exports = function (req, res, next) {
  var courseCode = req.params.course_code;

  Course.findOne({ course_code: courseCode.toUpperCase() }, function (err, course) {
    if (err)
      res.status(500).json(err);

    if (course) {                    //Checks to see if the course exists
      next();
    } else {
      res.render('errors/err-course')
    }
  });
};