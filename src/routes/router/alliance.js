const router = require("express").Router();
const { v1 } = require("uuid");

const Alliance = require("../model/alliance");
const User = require("../model/auth-model");

const { verifyUser } = require("../../middleware/verify-user");

router.get("/", verifyUser, async (req, res) => {
  try {
    const isMember = await User.findGuild(req.user.userId);
    if (isMember) {
      const alliance = await Alliance.getAllAlliance();
      res.status(200).json(alliance);
    }

    // const alliance = await Alliance.getAlliance(req.user.userId);
    // console.log("alliance", alliance);
  } catch (e) {
    console.log("e", e);
    res.status(404).json({ message: "could not find alliance", error: e });
  }
});

router.post("/", verifyUser, async (req, res) => {
  const body = req.body;
  const { userId } = req.user;
  const post = {
    ...body,
    uuid: v1(),
    allianceOwner: userId,
  };
  try {
    const response = await Alliance.createAlliance(post);
    res.status(200).json(response);
  } catch (e) {
    console.log("e", e);
    res.status(404).json({ message: "Could not create alliance" });
  }
});

module.exports = router;
