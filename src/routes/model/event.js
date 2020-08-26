const db = require("../../data/db-config");

module.exports = {
  getCurrentEvent,
  createEvent,
  deleteEvent,
  updateEvent,
  getAllEvent,
  getEvent,
};

function getEvent(eventId, allianceId) {
  return db("userAllianceEvent as uae")
    .join("userProfile as up", "uae.userId", "up.userId")
    .join("profile as p", "up.profileId", "p.profileId")
    .where({ allianceId, eventId, isParticipating: true });
}

function getAllEvent(allianceId) {
  return db("userAllianceEvent as uae")
    .join("event as e", "e.eventId", "uae.eventId")
    .where({ allianceId });
}

function updateEvent(userId, allianceId, isParticipating, eventId) {
  return db("userAllianceEvent")
    .where({ allianceId, userId, eventId })
    .update({ isParticipating });
}

function deleteEvent(eventId, allianceId) {
  return db("userAllianceEvent")
    .where({ eventId, allianceId })
    .del()
    .then(() => {
      return db("event").where({ eventId }).del();
    });
}

function createEvent(userId, allianceId, body) {
  return db("event")
    .insert(body)
    .then((ids) => {
      console.log("ids", ids);
      const eventId = ids[0];
      return db("userAllianceEvent")
        .insert({ userId, allianceId, eventId })
        .then();
    });
}

function getCurrentEvent(userId, allianceId) {
  return db("userAllianceEvent as uae")
    .join("event as e", "e.eventId", "uae.eventId")
    .where({ userId, allianceId, isExpired: false });
}
