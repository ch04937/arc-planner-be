const router = require("express").Router();
const { v1 } = require("uuid");

const Alliance = require("../model/alliance");
const User = require("../model/auth-model");

const { verifyUser } = require("../../middleware/verify-user");

// find alliances
router.get("/", verifyUser, async (req, res) => {
  try {
    const data = await Alliance.getUserAlliance(req.user.userId);
    const alliance = await Alliance.getAlliance(data.allianceId);
    const count = await Alliance.getMemberCount(data.allianceId);
    const response = { ...data, ...alliance, count: count.length };

    res.status(200).json(response);
  } catch (e) {
    res.status(404).json({ message: "could not find alliance", error: e });
  }
});

// applications
router.get("/applications", verifyUser, async (req, res) => {
  try {
    const data = await Alliance.getApplications(req.user.userId);
    res.status(200).json(data);
  } catch (e) {
    console.log("e", e);
    res.status(404).json({ message: "could not find alliance" });
  }
});
router.post("/applications/apply/:allianceId", verifyUser, async (req, res) => {
  const uuid = req.params.allianceId;
  try {
    const data = await Alliance.postApplication(uuid, req.user.userId);
    res.status(200).json(data);
  } catch (e) {
    console.log("e", e);
    res.status(404).json({ message: "could not find alliance" });
  }
});
router.delete(
  "/applications/cancel/:allianceId",
  verifyUser,
  async (req, res) => {
    const uuid = req.params.allianceId;
    try {
      const data = await Alliance.cancelApplication(uuid, req.user.userId);
      res.status(200).json(data);
    } catch (e) {
      console.log("e", e);
      res.status(404).json({ message: "could not find alliance" });
    }
  }
);

// create alliance
router.post("/", verifyUser, async (req, res) => {
  const body = req.body;
  const { userId } = req.user;
  const post = {
    ...body,
    uuid: v1(),
    allianceOwner: userId,
  };
  try {
    const alliance = await Alliance.createAlliance(post);
    const profile = await User.updateUserMember(userId);
    const response = {
      alliance: alliance,
      userProfile: {
        uuid: profile.uuid,
        username: profile.username,
        email: profile.email,
        created_at: profile.created_at,
        isMember: profile.isMember,
      },
    };
    console.log("response", response);
    res.status(200).json(response);
  } catch (e) {
    console.log("e", e);
    res.status(404).json({ message: "Could not create alliance" });
  }
});

module.exports = router;
