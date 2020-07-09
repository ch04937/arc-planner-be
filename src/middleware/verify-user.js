const jwt = require("jsonwebtoken");
const secrets = require("../configs/secrets.js");
const Users = require("../routes/auth/auth-model");

const authenticateUser = (req, res, next) => {
	const token = req.headers.authorization;

	if (token) {
		jwt.verify(token, secrets.jwtSecrets, (err, decodedToken) => {
			if (err) {
				res.status(401).json({ message: "you shall not pass!" });
			} else {
				req.user = { username: decodedToken.username };
				next();
			}
		});
	} else {
		res.status(403).json({
			message: "You Need to be logged In",
		});
	}
};

const verifyUser = async (req, res, next) => {
	const user = req.user;
	const registered = await Users.getByUsername(user.username);

	if (!registered) {
		res.status(401).json({ message: "The user is not registered." });
	}

	req.user = registered;

	next();
};

module.exports = { verifyUser, authenticateUser };
