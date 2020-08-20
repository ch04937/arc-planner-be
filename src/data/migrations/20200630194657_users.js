exports.up = function (knex, Promise) {
  return knex.schema
    .createTable("users", (tbl) => {
      tbl.increments("userId");
      tbl.string("uuid", 255).notNullable().unique();
      tbl.string("username", 255).notNullable().unique();
      tbl.string("email").notNullable().unique();
      tbl.string("password", 255).notNullable();
      tbl.timestamp("created_at").defaultTo(knex.fn.now());
      tbl.boolean("isMember").defaultTo(false);
    })
    .createTable("profile", (tbl) => {
      tbl.increments("profileId");
      tbl.string("uuid", 255).notNullable().unique();
      tbl.string("inGameName", 255);
      tbl.integer("size", 255).defaultTo(2325);
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
      tbl.string("updated_at", 255).defaultTo(knex.fn.now());
      tbl.string("originalname", 255).defaultTo("unknowman.png");
      tbl.string("filename", 255).defaultTo("unknowman.png");
      tbl.string("mimetype", 255).defaultTo("image/png");
      tbl.string("path", 255).defaultTo("public\\unknowman.png");
    })

    .createTable("userProfile", (tbl) => {
      tbl.increments("userProfile");
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
    });
};

exports.down = function (knex, Promise) {};
