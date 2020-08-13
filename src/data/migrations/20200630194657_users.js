exports.up = function (knex) {
  return knex.schema
    .createTable("users", (tbl) => {
      tbl.increments("userId").primary();
      tbl.string("uuid", 255).notNullable().unique();
      tbl.string("username", 255).notNullable().unique();
      tbl.string("email").notNullable().unique();
      tbl.string("password", 255).notNullable();
      tbl.timestamp("created_at").defaultTo(knex.fn.now());
      tbl.boolean("isMember").defaultTo(false);
      tbl.boolean("isLead").defaultTo(false);
      tbl.boolean("isOwner").defaultTo(false);
    })
    .createTable("profile", (tbl) => {
      tbl.increments("profileId").primary();
      tbl.string("uuid", 255).notNullable().unique();
      tbl.string("inGameName", 255);
      tbl.integer("t3cav").defaultTo(0);
      tbl.integer("t3inf").defaultTo(0);
      tbl.integer("t3arch").defaultTo(0);
      tbl.integer("t4cav").defaultTo(0);
      tbl.integer("t4inf").defaultTo(0);
      tbl.integer("t4arch").defaultTo(0);
      tbl.integer("t5cav").defaultTo(0);
      tbl.integer("t5inf").defaultTo(0);
      tbl.integer("t5arch").defaultTo(0);
      tbl.integer("city").defaultTo(0);
      tbl.integer("castle").defaultTo(0);
    })
    .createTable("profilePicture", (tbl) => {
      tbl.increments("imgId").primary();
      tbl.string("uuid", 255).notNullable().unique();
      tbl.string("updated_at", 255).defaultTo(knex.fn.now());
      tbl.string("originalname", 255).defaultTo("unknowman.png");
      tbl.string("filename", 255).defaultTo("unknowman.png");
      tbl.string("mimetype", 255).defaultTo("image/png");
      tbl.string("path", 255).defaultTo("public\\unknowman.png");
      tbl.integer("size", 255).defaultTo(2325);
    })
    .createTable("userProfile", (tbl) => {
      tbl.increments("userProfile").primary();
      tbl
        .integer("userId")
        .unsigned()
        .references("userId")
        .inTable("users")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl
        .integer("profileId")
        .unsigned()
        .references("profileId")
        .inTable("profile")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
    })
    .createTable("userImage", (tbl) => {
      tbl.increments("userImageId").primary();
      tbl
        .integer("userId")
        .unsigned()
        .references("userId")
        .inTable("users")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl
        .integer("imgId")
        .unsigned()
        .references("imgId")
        .inTable("profilePicture")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
    })
    .createTable("alliance", (tbl) => {
      tbl.increments("allianceId").primary();
      tbl.integer("uuid", 255).notNullable().unique();
      tbl.integer("kingdomNumber").notNullable();
      tbl.integer("allianceOwner").notNullable();
      tbl.string("allianceTag", 255).notNullable();
      tbl.string("allianceName", 255).notNullable();
    })
    .createTable("userAlliance", (tbl) => {
      tbl.increments().primary();
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
      tbl.boolean("isOwner").defaultTo(false);
      tbl.boolean("isR4").defaultTo(false);
      tbl.boolean("isParticipating").defaultTo(false);
      tbl.boolean("hasApplied").defaultTo(false);
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("userAlliance")
    .dropTableIfExists("alliance")
    .dropTableIfExists("userImage")
    .dropTableIfExists("userProfile")
    .dropTableIfExists("profilePicture")
    .dropTableIfExists("profile")
    .dropTableIfExists("users");
};
