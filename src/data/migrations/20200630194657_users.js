exports.up = function (knex) {
	return knex.schema
		.createTable("users", (tbl) => {
			tbl.increments("userId").primary();
			tbl.string("uuid", 255).notNullable().unique();
			tbl.string("username", 255).notNullable().unique();
			tbl.string("email").notNullable().unique();
			tbl.string("password", 255).notNullable();
			tbl.timestamp("created_at").defaultTo(knex.fn.now());
		})
		.createTable("profile", (tbl) => {
			tbl.increments("profileId").primary();
			tbl.string("uuid", 255).notNullable().unique();
			tbl.string("inGameName", 255);
			tbl.binary("profile-pic", 255);
			tbl.integer("t3cav").defaultTo(0);
			tbl.integer("t3inf").defaultTo(0);
			tbl.integer("t3arch").defaultTo(0);
			tbl.integer("t4cav").defaultTo(0);
			tbl.integer("t4inf").defaultTo(0);
			tbl.integer("t4arch").defaultTo(0);
			tbl.integer("t5cav").defaultTo(0);
			tbl.integer("t5inf").defaultTo(0);
			tbl.integer("t5arch").defaultTo(0);
			tbl.integer("city");
			tbl.integer("castle");
		})
		.createTable("userProfile", (tbl) => {
			tbl.increments("userProfile").primary();
			tbl.string("uuid", 255);
			tbl.integer("userId")
				.unsigned()
				.references("uuid")
				.inTable("users")
				.onDelete("CASCADE")
				.onUpdate("CASCADE");
			tbl.integer("profileId")
				.unsigned()
				.references("uuid")
				.inTable("profile")
				.onDelete("CASCADE")
				.onUpdate("CASCADE");
		});
};

exports.down = function (knex) {
	return knex.schema
		.dropTableIfExists("userProfile")
		.dropTableIfExists("profile")
		.dropTableIfExists("users");
};
