const db = require("../../data/db-config");

module.exports = {
  getCurrentEvent,
  createEvent,
  deleteEvent,
};

function deleteEvent(eventId, allianceId) {
  console.log("enventId", eventId);
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
