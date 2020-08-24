exports.up = function (knex, Promise) {
  return knex.schema
    .createTable("events", (tbl) => {
      tbl.increments("eventsId");
      tbl.string("eventName", 255);
      tbl.text("eventDescription");
      tbl.timestamp("startDate");
      tbl.timestamp("endDate");
      tbl.boolean("isExpired").defaultTo(false);
    })
    .createTable("userAllianceEvent", (tbl) => {
      tbl.increments("userAllianceEventId");
      tbl
        .integer("userId", 255)
        .unsigned()
        .references("userId")
        .inTable("users")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl
        .integer("allianceId", 255)
        .unsigned()
        .references("allianceId")
        .inTable("alliance")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl
        .integer("eventsId", 255)
        .unsigned()
        .references("eventsId")
        .inTable("events")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl.boolean("isParticipating").defaultTo(false);
    });
};

exports.down = function (knex, Promise) {};
