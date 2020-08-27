const db = require("../../data/db-config");

module.exports = {
  getCurrentEvent,
  createEvent,
  deleteEvent,
  updateEvent,
  getAllEvent,
  getEvent,
  createTeam,
  getAllTeams,
};

function getAllTeams(allianceId, eventId) {
  return db("teams as t")
    .join("allianceEventTeams as aet", "aet.teamId", "t.teamId")
    .where({ allianceId, eventId });
}

function createTeam(allianceId, eventId, body) {
  return db("teams")
    .insert(body)
    .then((ids) => {
      const teamId = ids[0];
      return db("allianceEventTeams")
        .insert({ allianceId, eventId, teamId })
        .then(() => getAllTeams(allianceId, eventId));
    });
}

function getEvent(eventId, allianceId) {
  return db("userAllianceEvent as uae")
    .join("userProfile as up", "uae.profileId", "up.profileId")
    .join("profile as p", "up.profileId", "p.profileId")
    .where({ allianceId, eventId, isParticipating: true });
}

function getAllEvent(allianceId) {
  return db("userAllianceEvent as uae")
    .join("event as e", "e.eventId", "uae.eventId")
    .where({ allianceId });
}

function updateEvent(profileId, allianceId, isParticipating, eventId) {
  return db("userAllianceEvent")
    .where({ allianceId, profileId, eventId })
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

function createEvent(profileId, allianceId, body) {
  return db("event")
    .insert(body)
    .then((ids) => {
      const eventId = ids[0];
      return db("userAllianceEvent")
        .insert({ profileId, allianceId, eventId })
        .then(() => getAllEvent(allianceId));
    });
}

function getCurrentEvent(profileId, allianceId) {
  return db("userAllianceEvent as uae")
    .join("event as e", "e.eventId", "uae.eventId")
    .where({ profileId, allianceId, isExpired: false });
}
