const router = require("express").Router();

const { verifyAlliance } = require("../../middleware/verify-alliance");
const { verifyUser } = require("../../middleware/verify-user");
const Events = require("../model/events");

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
    console.log("response", response);
    res.status(200).json(response);
  } catch (e) {
    console.log("e", e);
  }
});

module.exports = router;
