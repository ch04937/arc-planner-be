const db = require("../../data/db-config");

module.exports = {
  getCurrentEvent,
};

function getCurrentEvent(userId, allianceId) {
  return db("userAllianceEvent")
    .where({ userId, allianceId })
    .then((res) => {
      return db("events").where({ isExpired: false });
    });
}
