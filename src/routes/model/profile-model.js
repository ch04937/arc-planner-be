const db = require("../../data/db-config");
const { v1 } = require("uuid");

module.exports = {
  getProfile,
  add,
  saveImg,
  addDefaultProfile,
  update,
};

function getProfile(userId) {
  return db("userProfile as up")
    .join("profile as p", "up.profileId", "p.profileId")
    .where({ userId });
}

function add(body) {
  body.uuid = uuidv1();
  return db("profile")
    .insert(body, "uuid")
    .then((res) => getByUserId(res[0]));
}

function getUpdatedImg(profileId) {
  return db("profile").where({ profileId }).first();
}

function saveImg(profileId, changes) {
  return db("profile")
    .where({ profileId })
    .update(changes)
    .then((count) => (count > 0 ? getUpdatedImg(profileId) : null));
}

function addDefaultProfile(userId, inGameName) {
  const profile = {
    inGameName: inGameName,
    uuid: v1(),
  };
  return db("profile")
    .insert(profile)
    .then((ids) => {
      const profileId = ids[0];
      return db("userProfile")
        .insert({ userId, profileId })
        .then((ids) => ids[0]);
    });
}

function update(profileId, changes) {
  return db("profile")
    .where({ profileId })
    .update(changes)
    .then((count) => (count > 0 ? getProfile(profileId) : null));
}
