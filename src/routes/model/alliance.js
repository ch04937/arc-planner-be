const db = require("../../data/db-config");

module.exports = {
  getAlliance,
  getAllAlliance,
  createAlliance,
};

function getAlliance(userId) {
  return db("userAlliance as ua", "ua.userId")
    .join("users as u")
    .where("u.userId", "=", userId)
    .select("ua.allianceId")
    .then((ids) => {
      console.log("ids", ids);
      allainceId = ids[0];
      return db("alliance").where(allainceId).first();
    });
}

function getAllAlliance() {
  return db("alliance");
}

function getAllianceById(allianceId) {
  return db("alliance").where({ allianceId }).first();
}

function createAlliance(post) {
  return db("alliance")
    .insert(post)
    .then((allianceId) => {
      console.log("allianceId", allianceId);
      return getAllianceById(allianceId);
    });
}
