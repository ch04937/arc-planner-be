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
      return db("events").where({ eventId }).del();
    });
}

function createEvent(userId, allianceId, body) {
  return db("events")
    .insert(body)
    .then((ids) => {
      console.log("ids", ids);
      const eventsId = ids[0];
      return db("userAllianceEvent")
        .insert({ userId, allianceId, eventsId })
        .then();
    });
}

function getCurrentEvent(userId, allianceId) {
  return db("userAllianceEvent")
    .where({ userId, allianceId })
    .then((res) => {
      return db("events").where({ isExpired: false });
    });
}
