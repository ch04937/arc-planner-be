exports.up = function (knex, Promise) {
  return knex.schema
    .createTable("event", (tbl) => {
      tbl.increments("eventId");
      tbl.string("eventName", 255);
      tbl.text("eventDescription");
      tbl.timestamp("startDate");
      tbl.timestamp("endDate");
      tbl.boolean("isExpired").defaultTo(false);
    })
    .createTable("allianceEvents", (tbl) => {
      tbl.increments("allianceEventsId");
      tbl
        .integer("allianceId")
        .unsigned()
        .references("allianceId")
        .inTable("alliance")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl
        .integer("eventId")
        .unsigned()
        .references("eventId")
        .inTable("event")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
    })
    .createTable("teams", (tbl) => {
      tbl.increments("teamId");
      tbl.string("teamName").notNullable();
    })
    .createTable("eventTeams", (tbl) => {
      tbl.increments("eventTeamId");
      tbl
        .integer("allianceId")
        .unsigned()
        .references("allianceId")
        .inTable("alliance")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl
        .integer("eventId")
        .unsigned()
        .references("eventId")
        .inTable("event")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl
        .integer("teamId")
        .unsigned()
        .references("teamId")
        .inTable("teams")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
    })
    .createTable("allianceEventTeams", (tbl) => {
      tbl.increments("allianceEventTeamsId");
      tbl
        .integer("profileId")
        .unsigned()
        .references("profileId")
        .inTable("profile")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl
        .integer("allianceId")
        .unsigned()
        .references("allianceId")
        .inTable("alliance")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl
        .integer("eventId")
        .unsigned()
        .references("eventId")
        .inTable("event")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl
        .integer("teamId")
        .unsigned()
        .references("teamId")
        .inTable("teams")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl.boolean("isParticipating");
    });
};

exports.down = function (knex, Promise) {
  return knex.schema
    .dropTableIfExists("allianceEventTeams")
    .dropTableIfExists("eventTeams")
    .dropTableIfExists("teams")
    .dropTableIfExists("userAlliance")
    .dropTableIfExists("allianceEvents")
    .dropTableIfExists("event")
    .dropTableIfExists("alliance")
    .dropTableIfExists("userProfile")
    .dropTableIfExists("profile")
    .dropTableIfExists("users");
};
