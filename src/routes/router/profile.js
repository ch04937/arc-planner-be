const router = require("express").Router();
const Player = require("../model/player-model");

const {
	verifyUser,
	authenticateUser,
} = require("../../middleware/verify-user");

router.post(
	"/add-name",
	[authenticateUser, verifyUser],
	async (req, res) => {}
);
module.exports = router;
