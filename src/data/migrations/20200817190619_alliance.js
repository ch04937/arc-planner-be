exports.up = function (knex, Promise) {
  return knex.schema
    .createTable("alliance", (tbl) => {
      tbl.increments("allianceId");
      tbl.integer("kingdomNumber").notNullable();
      tbl.integer("allianceOwner").notNullable();
      tbl.string("allianceTag", 255).notNullable();
      tbl.string("allianceName", 255).notNullable();
      tbl.string("uuid", 255).notNullable().unique();
      tbl.text("messageBoard");
    })
    .createTable("userAlliance", (tbl) => {
      tbl.increments("userAllianceId");
      tbl
        .integer("profileId")
        .unsigned()
        .references("profileId")
        .inTable("profile")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl
        .integer("allianceId", 255)
        .unsigned()
        .references("allianceId")
        .inTable("alliance")
        .onDelete("CASCADE")
        .onUpdate("CASCADE")
        .defaultTo(0);
      tbl.boolean("isOwner").defaultTo(false);
      tbl.boolean("isLead").defaultTo(false);
      tbl.boolean("isMember").defaultTo(false);
      tbl.boolean("hasApplied").defaultTo(false);
    });
};

exports.down = function (knex, Promise) {};
