const secrets = require("./secrets");
const jwt = require("jsonwebtoken");

//generate token @login
function createToken(user) {
	const payload = {
		username: user.username,
	};
	const options = {
		expiresIn: "1d",
	};
	return jwt.sign(payload, secrets.jwtSecrets, options);
}

function createRefreshToken(user) {
	const payload = {
		username: user.username,
	};
	const options = {
		expiresIn: "21d",
	};
	return jwt.sign(payload, secrets.jwtRefreshSecrets, options);
}

module.exports = {
	createToken,
	createRefreshToken,
};
