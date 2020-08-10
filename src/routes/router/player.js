const router = require("express").Router();
const Player = require("../model/auth-model");

const { verifyUser } = require("../../middleware/verify-user");

// route gets player info
router.get("/", verifyUser, async (req, res) => {
	const { userId } = req.user;
	try {
		const profile = await Player.getByUserId(userId);
		const player = {
			uuid: profile.uuid,
			username: profile.username,
			email: profile.email,
			created_at: profile.created_at,
		};
		res.status(200).json(player);
	} catch (e) {
		res.status(404).json({
			message: `An error has occured ${e}`,
			error: e,
		});
	}
});

module.exports = router;
