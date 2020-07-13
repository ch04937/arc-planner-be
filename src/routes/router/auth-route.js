const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v1 } = require("uuid");

const Users = require("../model/auth-model.js");
const secrets = require("../../configs/secrets.js");

const {
	validateRegistration,
	validateLogin,
} = require("../../middleware/validate-auth");

//post register
router.post("/register", validateRegistration, async (req, res) => {
	// implement registration
	let { username, password, email } = req.body;
	const hashedPassword = bcrypt.hashSync(password, 10);

	const newUser = {
		username,
		password,
		email,
		password: hashedPassword,
		uuid: v1(),
	};

	try {
		const user = await Users.addNewUser(newUser);
		const token = generateToken({
			username: user.username,
			uuid: user.uuid,
		});
		// add default info
		res.status(201).json({
			profile: {
				username: user.username,
				email: user.email,
			},
			accessToken: token,
		});
	} catch (e) {
		console.log("e", e);
		res.status(500).json({ message: "unable to add user", e: e });
	}
});

//post login
router.post("/login", validateLogin, async (req, res) => {
	// implement login
	let { userId, password } = req.body;
	try {
		const createUser = await Users.find(userId);
		if (createUser && bcrypt.compareSync(password, createUser.password)) {
			const token = generateToken({
				username: createUser.username,
				uuid: createUser.uuid,
			});
			res.status(201).json({
				profile: {
					uuid: createUser.uuid,
					username: createUser.username,
					email: createUser.email,
				},
				accessToken: token,
			});
		} else {
			res.status(401).json({ message: "invalid credentials" });
		}
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: `an error occured ${err}` });
	}
});
//generate token @login
function generateToken(user) {
	const payload = {
		username: user.username,
		uuid: user.uuid,
	};
	const options = {
		expiresIn: "1d",
	};
	return jwt.sign(payload, secrets.jwtSecrets, options);
}

module.exports = router;
