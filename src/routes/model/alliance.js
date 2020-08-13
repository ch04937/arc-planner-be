const db = require("../../data/db-config");

module.exports = {
  getAlliance,
  getAllAlliance,
  getApplications,
  createAlliance,
  postApplication,
  getAllianceIdByUuid,
};

function getAllianceIdByUuid(uuid) {
  return db("alliance").where({ uuid }).select("allianceId").first();
}
function getAllianceUuidById(allianceId) {
  return db("alliance").where({ allianceId }).select("uuid").first();
}

async function postApplication(uuid, userId) {
  const id = await getAllianceIdByUuid(uuid);
  const post = { ...id, userId: userId, hasApplied: true };
  return db("userAlliance")
    .insert(post)
    .then((ids) => {
      const allianceId = post.allianceId;
      // get the alliance uuid
      console.log("allianceId", allianceId);
      return db("alliance").where({ allianceId }).select("uuid");
    });
}

function getApplications(userId) {
  return db("userAlliance")
    .where({ userId, hasApplied: true })
    .select("allianceId")
    .then(async (ids) => {
      const uuids = [];
      for (let i = 0; i < ids.length; i++) {
        const uuid = await getAllianceUuidById(ids[i].allianceId);
        uuids.push(uuid.uuid);
      }
      return uuids;
    });
}

function getAlliance(userId) {
  return db("userAlliance as ua", "ua.userId")
    .join("users as u")
    .where("u.userId", "=", userId)
    .select("ua.allianceId")
    .then((ids) => {
      allianceId = ids[0];
      return db("alliance").where(allianceId).first();
    });
}

function getAllAlliance() {
  return db("alliance");
}

function createAlliance(post) {
  const userId = post.allianceOwner;
  return db("alliance")
    .insert(post)
    .then((id) => {
      const allianceId = id[0];
      return db("userAlliance")
        .insert({ userId, allianceId, isOwner: true })
        .then((ids) => getByUserAllianceId(ids[0]));
    });
}

function getByUserAllianceId(id) {
  return db("userAlliance").where({ id }).first();
}
