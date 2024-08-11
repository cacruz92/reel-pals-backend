const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("../config");
const {UnauthorizedError} = require("../expressError");

function authenticateJWT(req, res, next) {
  try {
    const authHeader = req.headers && req.headers.authorization;
    if (!authHeader) {
      return next();
    }
    const token = authHeader.replace(/^[Bb]earer /, "").trim().replace(/^"|"$/g, '');
      try {
      req.user = jwt.verify(token, JWT_SECRET);
    } catch (verifyError) {
      console.error("Token verification failed:", verifyError.message);
      req.user = null;
    }

    return next();
  } catch (e) {
    console.error("JWT authentication error:", e);
    req.user = null;
    return next();
  }
  }

  function ensureLoggedIn(req, res, next) {
    try {
      if (!req.user) throw new UnauthorizedError("Authentication required");
      return next();
    } catch (e) {
      return next(e);
    }
  }

  function ensureCorrectUser(req, res, next) {
    try {
      if (!req.user) throw new UnauthorizedError("Authentication required");
      
      const user = req.user;
      if (!user) throw new UnauthorizedError("Authentication required");
      if (user.username !== req.params.username) {
          throw new UnauthorizedError("Unauthorized");
      }
      return next();
    } catch (e) {
        return next(e);
    }
}
  
  module.exports = {
    authenticateJWT,
    ensureLoggedIn,
    ensureCorrectUser
  }