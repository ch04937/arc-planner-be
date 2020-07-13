const router = require("express").Router();
const Profile = require("../model/profile-model");

const {
	verifyUser,
	authenticateUser,
} = require("../../middleware/verify-user");

// get profile info
router.get("/", [authenticateUser, verifyUser], async (req, res) => {
	const { uuid } = req.user;
	try {
		const profile = Profile.getProfile(uuid);
		res.status(202).json({ profile: profile });
	} catch (e) {
		console.log("e", e);
		res.status(404).json({ message: `could not find ${e}`, e: e });
	}
});

// add info
router.post("/", [authenticateUser, verifyUser], async (req, res) => {
	const body = req.body;
	console.log("body", body);
	try {
		const post = Profile.add(body);
		res.status(202).json({ profile: post });
	} catch (e) {
		console.log("e", e);
		res.status(404).json({ message: `could not find ${e}`, e: e });
	}
});

module.exports = router;
