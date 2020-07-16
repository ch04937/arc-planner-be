const jwt = require("jsonwebtoken");
const secrets = require("../utils/secrets.js");
const Users = require("../routes/model/auth-model");

const verifyUser = async (req, res, next) => {
	const token = req.headers.authorization;

	if (token) {
		jwt.verify(token, secrets.jwtSecrets, (err, decodedToken) => {
			if (err) {
				res.status(401).json({ message: "you shall not pass!" });
			}
			req.user = { username: decodedToken.username };
		});
		const registered = await Users.getByUsername(req.user.username);

		if (!registered) {
			res.status(401).json({ message: "The user is not registered." });
		}
		req.user = registered;
		next();
	} else {
		res.status(403).json({
			message: "You Need to be logged In",
		});
	}
};

module.exports = { verifyUser };
