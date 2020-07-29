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
router.put("/change", verifyUser, async (req, res) => {
	const changes = req.query;
	const profileId = req.user.userId;
	try {
		const post = await Profile.update(profileId, changes);
		res.status(202).json(post);
	} catch (e) {
		res.status(404).json({ message: `could not find ${e}`, e: e });
	}
});

router.put("/ncc", verifyUser, async (req, res) => {
	const changes = req.body;
	const profileId = req.user.userId;
	try {
		const post = await Profile.update(profileId, changes);
		res.status(202).json(post);
	} catch (e) {
		res.status(404).json({ message: `could not find ${e}`, e: e });
	}
});

router.put("/img", verifyUser, async (req, res) => {
	const img = req.body;
	const profileId = req.user.userId;

	console.log("img", profileId, img);
});

module.exports = router;
