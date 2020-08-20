const router = require("express").Router();
const { v1 } = require("uuid");

const Alliance = require("../model/alliance");
const User = require("../model/auth-model");

const { verifyUser } = require("../../middleware/verify-user");
const { verifyAlliance } = require("../../middleware/verify-alliance");

// find alliances
router.get("/list", verifyUser, async (req, res) => {
  try {
    const list = await Alliance.getAllianceList();
    if (list.length) {
      res.status(200).json(list);
    } else {
      res.status(404).json({ message: "Could not find any alliances" });
    }
  } catch (e) {
    res.status(500).json({
      message: "There is a server error, refresh the page or try again later",
      error: e,
    });
  }
});
// find alliances
router.get("/", [verifyUser, verifyAlliance], async (req, res) => {
  try {
    const alliance = await Alliance.getAlliance(req.alliance.allianceId);
    const count = await Alliance.getMemberCount(req.alliance.allianceId);
    const response = { ...alliance, count: count.length };
    res.status(200).json(response);
  } catch (e) {
    console.log("e", e);
    res.status(404).json({ message: "could not find alliance", error: e });
  }
});

router.get("/members", [verifyUser, verifyAlliance], async (req, res) => {
  try {
    const members = await Alliance.getMembers(req.alliance.allianceId);
    console.log("members", members);
    res.status(200).json(members);
  } catch (e) {
    console.log("e", e);
    res.status(500).json({ message: "An error has occured" });
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
    Alliance.createAlliance(post);
    const profile = await User.updateUserMember(userId);

    res.status(200).json(profile);
  } catch (e) {
    console.log("e", e);
    res.status(404).json({ message: "Could not create alliance" });
  }
});

module.exports = router;
