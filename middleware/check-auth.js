var jwt = require('jsonwebtoken');

function verifyJWT(req, res, next) {
  try {
    var jwtString = req.cookies.Authorization.split(" ");
    var profile = jwt.verify(jwtString[1], "Daniel O'Donell is some boi");

    if (profile) {
      next();
    }
  } catch (err) {
    res.render('errors/err-login')
  }
};

module.exports = verifyJWT;