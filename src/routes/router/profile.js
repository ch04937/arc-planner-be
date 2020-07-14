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

// change profile db
router.put(
	"/:profile_uuid",
	[authenticateUser, verifyUser],
	async (req, res) => {
		const body = req.body;
		const profileId = req.params.profile_uuid;
		try {
			const post = await Profile.update(profileId, body);
			res.status(202).json({ post });
		} catch (e) {
			console.log("e", e);
			res.status(404).json({ message: `could not find ${e}`, e: e });
		}
	}
);

module.exports = router;
