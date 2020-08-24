const router = require("express").Router();

const { verifyAlliance } = require("../../middleware/verify-alliance");
const { verifyUser } = require("../../middleware/verify-user");
const Events = require("../model/events");
const { post } = require("./alliance");

router.get("/", verifyAlliance, async (req, res) => {
  try {
    res.status(200).json({ message: "working" });
  } catch (e) {
    console.log("e", e);
  }
});

router.get("/current", [verifyUser, verifyAlliance], async (req, res) => {
  try {
    const response = await Events.getCurrentEvent(
      req.alliance.userId,
      req.alliance.allianceId
    );
    if (response.length) {
      res.status(200).json(response);
    } else {
      res.status(404).json({ message: "No current events going on" });
    }
  } catch (e) {
    console.log("e", e);
  }
});

router.post("/", [verifyUser, verifyAlliance], async (req, res) => {
  try {
    const response = await Events.createEvent(
      req.alliance.userId,
      req.alliance.allianceId,
      req.body
    );
    console.log("response", response);
    //   res.status(200).json(response);
  } catch (e) {
    console.log("e", e);
  }
});
router.delete("/:eventId", [verifyUser, verifyAlliance], async (req, res) => {
  const { eventId } = req.params;
  try {
    const response = await Events.deleteEvent(eventId, req.alliance.allianceId);
    res.status(200).json({ message: "Event Deleted Succesfully" });
  } catch (e) {
    console.log("e", e);
  }
});

module.exports = router;
