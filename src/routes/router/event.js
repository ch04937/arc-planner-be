const router = require("express").Router();

const { verifyAlliance } = require("../../middleware/verify-alliance");
const { verifyUser } = require("../../middleware/verify-user");
const Event = require("../model/event");

const f5Error = "An error occurred loading reload page";

// get all events
router.get("/all", [verifyUser, verifyAlliance], async (req, res) => {
  const { allianceId } = req.alliance;
  try {
    const response = await Event.getAllEvent(allianceId);
    if (response.length) {
      res.status(200).json(response);
    } else {
      res.status(404).json({ message: "No events going on" });
    }
  } catch (e) {
    res.status(500).json({ message: f5Error });
  }
});
// get current evetns
router.get("/current", [verifyUser, verifyAlliance], async (req, res) => {
  const { allianceId } = req.alliance;
  try {
    const current = await Event.getCurrentEvent(allianceId);
    res.status(200).json(current);
  } catch (e) {
    res.status(500).json({ message: f5Error });
  }
});
// get a specific event
router.get(
  "/specific/:eventId",
  [verifyUser, verifyAlliance],
  async (req, res) => {
    const { allianceId } = req.alliance;
    const { eventId } = req.params;
    try {
      const participants = await Event.getEventParcipants(eventId, allianceId);
      const teams = await Event.getAllTeams(allianceId, eventId);
      const response = {
        participants: participants,
        teams: teams,
      };
      res.status(200).json(response);
    } catch (e) {
      res.status(500).json({ message: f5Error });
    }
  }
);
// get the list of events that the user is participating in
router.get("/participating", [verifyUser, verifyAlliance], async (req, res) => {
  const { allianceId } = req.alliance;
  const { profileId } = req.profile;
  try {
    const data = await Event.getParticipatingEvents(allianceId, profileId);
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ message: f5Error });
  }
});

// create event for alliance
router.post("/", [verifyUser, verifyAlliance], async (req, res) => {
  const { allianceId } = req.alliance;
  try {
    const event = await Event.createEvent(allianceId, req.body);
    res.status(200).json(event);
  } catch (e) {
    res.status(200).json({ message: f5Error });
  }
});
// create a team
router.post(
  "/team/:eventId",
  [verifyUser, verifyAlliance],
  async (req, res) => {
    const { allianceId } = req.alliance;
    const { eventId } = req.params;
    try {
      const teams = await Event.createTeam(allianceId, eventId, req.body);
      res.status(200).json(teams);
    } catch (e) {
      res.status(200).json({ message: f5Error });
    }
  }
);

// updates participants of events
router.put("/:eventId", [verifyUser, verifyAlliance], async (req, res) => {
  const { isParticipating } = req.body;
  const { allianceId } = req.alliance;
  const { eventId } = req.params;
  const { profileId } = req.profile;

  try {
    const exists = await Event.eventExists(
      isParticipating,
      allianceId,
      eventId,
      profileId
    );
    if (exists.length) {
      const doesExist = await Event.updateEvent(
        profileId,
        allianceId,
        isParticipating,
        eventId
      );
      res.status(200).json(doesExist);
    } else {
      const doesNotExist = await Event.postEvent(
        profileId,
        allianceId,
        isParticipating,
        eventId
      );
      res.status(200).json(doesNotExist);
    }
  } catch (e) {
    res.status(200).json({ message: f5Error });
  }
});

router.put("/ondrop/teams", [verifyUser, verifyAlliance], async (req, res) => {
  const old = req.body.old;
  const updates = req.body.newest;
  const changes = {
    teamId: updates.teamId,
    allianceId: updates.allianceId,
    eventId: updates.eventId,
    profileId: updates.profileId,
  };
  try {
    await Event.updateTeams(old, changes);
  } catch (e) {
    res.status(200).json({ message: f5Error });
  }
});
router.delete("/:eventId", [verifyUser, verifyAlliance], async (req, res) => {
  const { eventId } = req.params;
  try {
    const removed = await Event.deleteEvent(eventId, req.alliance.allianceId);
    res.status(200).json(removed);
  } catch (e) {
    console.log("e", e);
  }
});

module.exports = router;
