const router = require("express").Router();
const Profile = require("../model/profile-model");

const { verifyUser } = require("../../middleware/verify-user");

// get profile info
router.get("/", verifyUser, async (req, res) => {
	const { userId } = req.user;
	try {
		const profile = await Profile.getProfile(userId);
		res.status(202).json(profile);
	} catch (e) {
		console.log("e", e);
		res.status(404).json({ message: `could not find ${e}`, e: e });
	}
});

// change profile db
router.put("/:profile_uuid", verifyUser, async (req, res) => {
	const body = req.body;
	const profileId = req.params.profile_uuid;
	try {
		const post = await Profile.update(profileId, body);
		res.status(202).json({ post });
	} catch (e) {
		console.log("e", e);
		res.status(404).json({ message: `could not find ${e}`, e: e });
	}
});

module.exports = router;
