const db = require("../../data/db-config");

module.exports = {
  getAllianceList,
  getUserAlliance,
  getMemberCount,
  getAlliance,
  getApplications,
  getMembers,
  createAlliance,
  postApplication,
  getAllianceIdByUuid,
  cancelApplication,
  updateSettings,
  getPrivilege,
  deleteAlliance,
  getMembersToNotify,
  userUpdate,
};

function userUpdate(userId) {
  return db("users")
    .where({ userId })
    .update({ isMember: false })
    .then(() => getAllianceList());
}

function getMembersToNotify(allianceId) {
  return db("userAlliance").where({ allianceId }).select("profileId");
}

function deleteAlliance(allianceId) {
  return db("alliance")
    .where({ allianceId })
    .del()
    .then(() => {
      return db("userAlliance")
        .where({ allianceId })
        .del()
        .then(() => {
          return db("allianceEventTeams")
            .where({ allianceId })
            .del()
            .then(() => {
              return db("eventTeams")
                .where({ allianceId })
                .del()
                .then(() => getAllianceList());
            });
        });
    });
}

function updateSettings(changes, allianceId) {
  return db("alliance")
    .where({ allianceId })
    .update(changes)
    .then(() => getAlliance(allianceId));
}
function getPrivilege(allianceId, profileId) {
  return db("userAlliance").where({ allianceId, profileId });
}

function getAllianceMembers(profileId) {
  return db("userProfile")
    .where({ profileId })
    .select("profileId")
    .then((ids) => {
      const profileId = ids[0];
      return db("profile").where(profileId);
    });
}

function getMembers(allianceId) {
  return db("userAlliance")
    .where({ allianceId, isMember: true })
    .select("profileId")
    .then(async (profileId) => {
      const members = [];
      for (let i = 0; i < profileId.length; i++) {
        const member = await getAllianceMembers(profileId[i].profileId);
        members.push(member);
      }
      return members[0];
    });
}

async function cancelApplication(uuid, profileId) {
  const id = await getAllianceIdByUuid(uuid);
  const post = { ...id, profileId: profileId };
  return db("userAlliance")
    .where(post)
    .first()
    .del()
    .then(() => getApplications(profileId));
}
function getAllianceIdByUuid(uuid) {
  return db("alliance").where({ uuid }).select("allianceId").first();
}
function getAllianceUuidById(allianceId) {
  return db("alliance").where({ allianceId }).select("uuid").first();
}

async function postApplication(uuid, profileId) {
  const id = await getAllianceIdByUuid(uuid);
  const post = { ...id, profileId: profileId, hasApplied: true };
  return db("userAlliance")
    .insert(post)
    .then(() => getApplications(profileId));
}

function getApplications(profileId) {
  return db("userAlliance")
    .where({ profileId, hasApplied: true })
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

function getUserAlliance(profileId) {
  return db("userAlliance").where({ profileId, isMember: true }).first();
}
function getAlliance(allianceId) {
  return db("alliance").where({ allianceId }).first();
}

function createAlliance(post) {
  const profileId = post.allianceOwner;
  return db("alliance")
    .insert(post)
    .then((id) => {
      const allianceId = id[0];
      return db("userAlliance")
        .insert({
          profileId,
          allianceId,
          isOwner: true,
          isMember: true,
          isLead: true,
        })
        .then(() => getAlliance(allianceId));
    });
}
function getAllianceList() {
  return db("alliance");
}
