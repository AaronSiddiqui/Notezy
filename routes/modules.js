var express = require('express');
var router = express.Router();
var Module = require('../models/modules');
var posts = require('../routes/posts');
var checkModule = require('../middleware/check-module')

/* GET modules listing. */
router.get('/', function(req, res, next) {
  res.render('list-modules');
});

/**
 * Returns a single module from our database
 */
router.get('/getModule/:id', function (req, res, next) {
    var id = req.params.id;

    module.find({ _id: id }, function (err, module) {
        if (err)
            res.status(500).json(err);

        res.status(200).json(module);
    })
});

/**
 * Returns all modules from our database
 */
router.get('/getModules', function (req, res, next) {
    Module.find({}, function (err, modules) {
        if (err)
            res.status(500).json(err);

        res.status(200).json(modules);
    });
});

/**
 * Adds modules to our database
 */
router.post('/addModule', function (req, res, next) {
    // Extract the request body which contains the modules
    var module = new Module(req.body);

    module.save(function (err, savedModule) {
        if (err)
            res.status(500).json(err);

        res.status(201).json({
            status: "Successfully added the module",
            id: savedModule._id
        });
    });
});

/**
  Updates a module already in the database
 */
router.put('/updateModule/:id', function (req, res, next) {
    var id = req.params.id;

    Module.update({ _id: id }, req.body, function (err) {
        if (err)
            res.status(500).json(err);

        res.status(405).json({
            status: "Successfully updated the module"
        });
    });
});

/**
 * Deletes a module from the database
 */
router.delete('/removeModule/:id', function (req, res, next) {
    var id = req.params.id;

    Module.remove({ _id: id }, function (err) {
        if (err)
            res.status(500).json(err);

        res.status(405).json({
            status: "Successfully removed the module"
        });
    });
});

router.use('/:module_code', checkModule, posts);  //Checks to see if the module exists and then passes it to posts

module.exports = router;