const router = require("express").Router();
const Player = require("./player-model");

const {
	verifyUser,
	authenticateUser,
} = require("../../middleware/verify-user");

// route gets player info
router.get("/", [authenticateUser, verifyUser], async (req, res) => {
	const { username, uuid } = req.user;
	try {
		const profile = await Player.getProfile(uuid);
		console.log("profile", profile);

		res.status(200).json({ profile: profile });
	} catch (e) {
		console.log("e", e);
		res.status(404).json({
			message: `An error has occured ${e}`,
			error: e,
		});
	}
});
router.post("/troop", async (req, res) => {
	const units = req.body.units;
	const { userId } = req.user;
	try {
		const newTroops = await Player.addTroops(userId, units);

		console.log("newTroops", newTroops);
	} catch (e) {
		console.log("e", e);
		res.json(404).json({
			message: `an error has occured ${e}`,
			error: e,
		});
	}
});
module.exports = router;
