const router = require("express").Router();

const { verifyAlliance } = require("../../middleware/verify-alliance");
const { verifyUser } = require("../../middleware/verify-user");
const Event = require("../model/event");

const f5Error = "An error occurred loading reload page";

router.get("/current", [verifyUser, verifyAlliance], async (req, res) => {
  const { allianceId } = req.alliance;
  const { profileId } = req.profile;

  try {
    const response = await Event.getCurrentEvent(profileId, allianceId);
    if (response.length) {
      res.status(200).json(response);
    } else {
      res.status(404).json({ message: "No current event going on" });
    }
  } catch (e) {
    console.log("e", e);
    res.status(500).json({ message: f5Error });
  }
});
router.get(
  "/specific/:eventId",
  [verifyUser, verifyAlliance],
  async (req, res) => {
    const { allianceId } = req.alliance;
    const { eventId } = req.params;
    try {
      const response = await Event.getEvent(eventId, allianceId);
      res.status(200).json(response);
    } catch (e) {
      res.status(500).json({ message: f5Error });
    }
  }
);
router.get("/all", [verifyUser, verifyAlliance], async (req, res) => {
  const { allianceId } = req.alliance;
  try {
    const response = await Event.getAllEvent(allianceId);
    if (response.length) {
      res.status(200).json(response);
    } else {
      res.status(404).json({ message: "No current event going on" });
    }
  } catch (e) {
    res.status(500).json({ message: f5Error });
  }
});

router.post("/", [verifyUser, verifyAlliance], async (req, res) => {
  try {
    await Event.createEvent(
      req.profile.profileId,
      req.alliance.allianceId,
      req.body
    );

    res.status(200).json({ message: "Event Created Succesfully" });
  } catch (e) {
    console.log("e", e);
    res.status(200).json({ message: f5Error });
  }
});
router.put("/:eventId", [verifyUser, verifyAlliance], async (req, res) => {
  const { isParticipating } = req.body;
  const { userId, allianceId } = req.alliance;
  const { eventId } = req.params;
  try {
    await Event.updateEvent(userId, allianceId, isParticipating, eventId);
    res.status(200).json({ message: "updated successfully" });
  } catch (e) {
    res.status(200).json({ message: f5Error });
  }
});
router.delete("/:eventId", [verifyUser, verifyAlliance], async (req, res) => {
  const { eventId } = req.params;
  try {
    await Event.deleteEvent(eventId, req.alliance.allianceId);
    res.status(200).json({ message: "Event Deleted Succesfully" });
  } catch (e) {
    console.log("e", e);
  }
});

module.exports = router;
