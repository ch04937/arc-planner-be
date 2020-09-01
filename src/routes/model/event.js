const db = require("../../data/db-config");
const { post } = require("../router/event");

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
};

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
            .then(() => getAllEvent(allianceId));
        });
    });
}

function getEventParcipants(eventId, allianceId) {
  return db("allianceEventTeams as aet")
    .join("teams as t", "t.teamId", "aet.teamId")
    .where({ allianceId, eventId, isParticipating: true });
}

function getAllEvent(allianceId) {
  return db("eventTeams as et")
    .join("event as e", "e.eventId", "et.eventId")
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
  return db("allianceEventTeams")
    .insert({
      profileId,
      allianceId,
      isParticipating,
      eventId,
    })
    .then(() => getParticipatingEvents(allianceId, profileId));
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
