var Module = require('../models/modules');

module.exports = function (req, res, next) {
  var moduleCode = req.params.module_code;

  Module.findOne({ module_code: moduleCode.toUpperCase() }, function (err, module) {
    if (err)
      res.status(500).json(err);

    if (module) {                    //Checks to see if the module exists
      next();
    } else {
      res.render('errors/err-module')
    }
  });
};