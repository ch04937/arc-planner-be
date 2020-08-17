const db = require("../../data/db-config");

module.exports = {
  getUserAlliance,
  getMemberCount,
  getAlliance,
  getAllianceList,
  getApplications,
  createAlliance,
  postApplication,
  getAllianceIdByUuid,
  cancelApplication,
};

async function cancelApplication(uuid, userId) {
  const id = await getAllianceIdByUuid(uuid);
  const post = { ...id, userId: userId };
  return db("userAlliance")
    .where(post)
    .first()
    .del()
    .then(() => getApplications(userId));
}
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
    .then(() => getApplications(userId));
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

function getMemberCount(allianceId) {
  return db("userAlliance").where({ allianceId, isMember: true });
}

function getUserAlliance(userId) {
  return db("userAlliance").where({ userId, isMember: true }).first();
}
function getAlliance(allianceId) {
  return db("alliance").where({ allianceId }).first();
}
function getAllianceList() {
  return db("alliance");
}

function createAlliance(post) {
  const userId = post.allianceOwner;
  return db("alliance")
    .insert(post)
    .then((id) => {
      const allianceId = id[0];
      return db("userAlliance")
        .insert({
          userId,
          allianceId,
          isOwner: true,
          isMember: true,
          isLead: true,
        })
        .then(() => getAllAlliance());
    });
}
