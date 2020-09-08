const router = require("express").Router();
const { v1 } = require("uuid");

const Alliance = require("../model/alliance");
const User = require("../model/auth-model");

const { verifyUser } = require("../../middleware/verify-user");
const { verifyAlliance } = require("../../middleware/verify-alliance");

const f5Error = "An error occurred loading refresh page";

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
    res.status(500).json({ message: f5Error });
  }
});
// find alliances
router.get("/", [verifyUser, verifyAlliance], async (req, res) => {
  const { allianceId } = req.alliance;
  try {
    const alliance = await Alliance.getAlliance(allianceId);
    const count = await Alliance.getMemberCount(allianceId);

    const response = { ...alliance, count: count.length };
    res.status(200).json(response);
  } catch (e) {
    console.log("e", e);
    res.status(404).json({ message: "could not find alliance", error: e });
  }
});

router.get("/permissions", [verifyUser, verifyAlliance], async (req, res) => {
  const { allianceId } = req.alliance;
  const { userId } = req.user;
  try {
    const privilege = await Alliance.getPrivilege(allianceId, userId);
    res.status(200).json(privilege[0]);
  } catch (e) {
    res.json(500).json({ message: "an error has ocurred" });
  }
});

router.get("/members", [verifyUser, verifyAlliance], async (req, res) => {
  try {
    const members = await Alliance.getMembers(req.alliance.allianceId);
    res.status(200).json(members);
  } catch (e) {
    console.log("e", e);
    res.status(500).json({ message: "An error has occured" });
  }
});

// applications
router.get("/applications", verifyUser, async (req, res) => {
  try {
    const data = await Alliance.getApplications(req.profile.profileId);
    res.status(200).json(data);
  } catch (e) {
    res.status(404).json({ message: "could not find alliance" });
  }
});
router.post("/applications/apply/:allianceId", verifyUser, async (req, res) => {
  const uuid = req.params.allianceId;
  try {
    const data = await Alliance.postApplication(uuid, req.profile.profileId);
    res.status(200).json(data);
  } catch (e) {
    res.status(404).json({ message: "could not find alliance" });
  }
});
router.delete(
  "/applications/cancel/:allianceId",
  verifyUser,
  async (req, res) => {
    const uuid = req.params.allianceId;
    try {
      const data = await Alliance.cancelApplication(
        uuid,
        req.profile.profileId
      );
      res.status(200).json(data);
    } catch (e) {
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
      profile: profile,
    };
    res.status(200).json(response);
  } catch (e) {
    res.status(404).json({ message: "Could not create alliance" });
  }
});

router.put("/changes", [verifyUser, verifyAlliance], async (req, res) => {
  const body = req.body;
  const { allianceId } = req.alliance;
  try {
    const changes = await Alliance.updateSettings(body, allianceId);
    res.status(200).json(changes);
  } catch (e) {
    res.status(404).json({ message: "an error has occured" });
  }
});

router.delete("/delete", [verifyUser, verifyAlliance], async (req, res) => {
  const { allianceId } = req.alliance;
  try {
    // send notifications to members when alliance is disbanded
    // and change there profile to is member false
    // await Alliance.changesToUserProfiles()
    // const notifiedMembers = await Alliance.getMembersToNotify(allianceId);
    const deleted = await Alliance.deleteAlliance(allianceId);
    await Alliance.userUpdate(req.user.userId);

    res.status(200).json(deleted);
  } catch (e) {
    console.log("e", e);
  }
});

module.exports = router;
