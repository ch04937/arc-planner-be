const jwt = require("jsonwebtoken");
const secrets = require("../utils/secrets.js");
const Users = require("../routes/model/auth-model");

const verifyUser = async (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, secrets.jwtRefreshSecrets, (err, decodedToken) => {
      if (err) {
        res.status(401).json({ message: "You need to login" });
      }
      req.user = { username: decodedToken.username };
    });
    const registered = await Users.getByUsername(req.user.username);
    if (!registered) {
      res.status(401).json({ message: "You need to create an account" });
    }
    req.user = registered;
    const profile = await Users.getProfile(req.user.userId);
    req.profile = profile[0];
    next();
  } else {
    res.status(403).json({ message: "You need to be logged in" });
  }
};

module.exports = { verifyUser };
