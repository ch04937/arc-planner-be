const router = require("express").Router();
const Player = require("../model/auth-model");

const {
	verifyUser,
	authenticateUser,
} = require("../../middleware/verify-user");

// route gets player info
router.get("/", [authenticateUser, verifyUser], async (req, res) => {
	const { uuid } = req.user;
	try {
		const profile = await Player.getByUserId(uuid);
		res.status(200).json({ profile: profile });
	} catch (e) {
		res.status(404).json({
			message: `An error has occured ${e}`,
			error: e,
		});
	}
});

module.exports = router;
