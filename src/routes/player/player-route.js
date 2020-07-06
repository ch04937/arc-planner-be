const router = require("express").Router();
const Player = require("./player-model");

// route gets player info
router.get("/profile", async (req, res) => {
	console.error("herer");

	try {
		const profile = await Player.find();
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
module.exports = router;
