const router = require("express").Router();

const { verifyAlliance } = require("../../middleware/verify-alliance");
const { verifyUser } = require("../../middleware/verify-user");
const Event = require("../model/event");

const f5Error = "An error occurred loading reload page";

router.get("/current", [verifyUser, verifyAlliance], async (req, res) => {
  const { userId, allianceId } = req.alliance;
  try {
    const response = await Event.getCurrentEvent(userId, allianceId);
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

router.post("/", [verifyUser, verifyAlliance], async (req, res) => {
  try {
    Event.createEvent(req.user.userId, req.alliance.allianceId, req.body);

    res.status(200).json({ message: "Event Created Succesfully" });
  } catch (e) {
    console.log("e", e);
    res.status(200).json({ message: f5Error });
  }
});
router.delete("/:eventId", [verifyUser, verifyAlliance], async (req, res) => {
  const { eventId } = req.params;
  try {
    const response = await Event.deleteEvent(eventId, req.alliance.allianceId);
    console.log("response", response);
    res.status(200).json({ message: "Event Deleted Succesfully" });
  } catch (e) {
    console.log("e", e);
  }
});

module.exports = router;
