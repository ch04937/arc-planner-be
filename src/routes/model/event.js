const db = require("../../data/db-config");

module.exports = {
  getCurrentEvent,
  createEvent,
  deleteEvent,
  updateEvent,
  getAllEvent,
  getEventParcipants,
  getAllTeams,
  getParticipatingEvents,
  eventExists,
  postEvent,
  createTeam,
  updateTeams,
};

function updateTeams(old, changes) {
  return db("allianceEventTeams").where(old).update(changes);
}
function createTeam(allianceId, eventId, post) {
  return db("teams")
    .insert(post)
    .then((ids) => {
      const teamId = ids[0];
      return db("eventTeams")
        .insert({ allianceId, eventId, teamId })
        .then(() => getAllTeams(allianceId, eventId));
    });
}

function getParticipatingEvents(allianceId, profileId) {
  return db("allianceEventTeams").where({
    allianceId,
    profileId,
    isParticipating: true,
  });
}

function getAllTeams(allianceId, eventId) {
  return db("teams as t")
    .join("eventTeams as et", "et.teamId", "t.teamId")
    .where({ allianceId, eventId });
}

function createEvent(allianceId, body) {
  const team = { teamName: "all participants" };
  return db("event")
    .insert(body)
    .then((ids) => {
      const eventId = ids[0];
      return db("teams")
        .insert(team)
        .then((ids) => {
          const teamId = ids[0];
          return db("eventTeams")
            .insert({
              allianceId,
              eventId,
              teamId,
            })
            .then(() => {
              return db("allianceEvents").insert({ allianceId, eventId });
            })
            .then(() => getAllEvent(allianceId));
        });
    });
}

function getEventParcipants(eventId, allianceId) {
  return db("allianceEventTeams as aet")
    .join("teams as t", "t.teamId", "aet.teamId")
    .join("profile as p", "p.profileId", "aet.profileId")
    .where({ allianceId, eventId, isParticipating: true });
}

function getAllEvent(allianceId) {
  return db("allianceEvents as at")
    .join("event as e", "e.eventId", "at.eventId")
    .where({ allianceId });
}

function eventExists(isParticipating, allianceId, eventId, profileId) {
  return db("allianceEventTeams").where({
    isParticipating,
    allianceId,
    eventId,
    profileId,
  });
}
function postEvent(profileId, allianceId, isParticipating, eventId) {
  return db("eventTeams as et")
    .join("teams as t", "et.teamId", "t.teamId")
    .where({ allianceId, eventId, teamName: "all participants" })
    .select("t.teamId")
    .then((res) => {
      const teamId = res[0].teamId;
      return db("allianceEventTeams")
        .insert({
          profileId,
          allianceId,
          isParticipating,
          eventId,
          teamId,
        })
        .then(() => getParticipatingEvents(allianceId, profileId));
    });
}
function updateEvent(profileId, allianceId, isParticipating, eventId) {
  return db("allianceEventTeams")
    .where({ allianceId, profileId, eventId })
    .del()
    .then(() => postEvent(profileId, allianceId, isParticipating, eventId));
}

function deleteEvent(eventId, allianceId) {
  return db("userAllianceEvent")
    .where({ eventId, allianceId })
    .del()
    .then(() => {
      return db("event").where({ eventId }).del();
    });
}

function getCurrentEvent(allianceId) {
  return db("event as e")
    .join("eventTeams as et", "e.eventId", "et.eventId")
    .where({ allianceId, isExpired: false });
}
