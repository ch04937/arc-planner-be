const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Users = require("./auth-model.js");
const secrets = require("../../configs/secrets.js");

const {
	validateRegistration,
	validateLogin,
} = require("../../middleware/validate-auth");

//post register
router.post("/register", validateRegistration, async (req, res) => {
	// implement registration
	let { username, password, email } = req.body;
	const hash = bcrypt.hashSync(password, 10);
	const newUser = {
		username,
		password,
		email,
		password: hash,
	};

	try {
		const users = await Users.addNewUser(newUser);
		const token = generateToken({
			profile: {
				username: users.username,
				email: users.email,
			},
		});

		res.status(201).json({
			profile: {
				firstName: users.firstName,
				lastName: users.lastName,
				email: users.email,
			},
			accessToken: token,
		});
	} catch (e) {
		console.log(e);
		res.status(500).json({ message: "unable to add user", e: e });
	}
});

//post login
router.post("/login", validateLogin, (req, res) => {
	// implement login
	let { username, password } = req.body;
	Users.find(username)
		.then((user) => {
			if (user && bcrypt.compareSync(password, user.password)) {
				const token = generateToken({ username: user.username });
				res.status(200).json({
					profile: { email: user.email, username: username },
					accessToken: token,
				});
			} else {
				res.status(401).json({ message: "invalid credentials" });
			}
		})
		.catch((err) => {
			res.status(500).json({ message: `server 500 error`, e: err });
		});
});

//generate token @login
function generateToken(user) {
	const payload = {
		username: user.username,
	};
	const options = {
		expiresIn: "1d",
	};
	return jwt.sign(payload, secrets.jwtSecrets, options);
}

module.exports = router;
