exports.up = function (knex) {
	return knex.schema
		.createTable("users", (tbl) => {
			tbl.string("uuid", 255).notNullable().unique().primary();
			tbl.string("username", 255).notNullable().unique();
			tbl.string("email").notNullable().unique();
			tbl.string("password", 255).notNullable();
			tbl.string("inGameName", 255);
		})
		.createTable("troops", (tbl) => {
			tbl.string("uuid").notNullable().unique().primary();
			tbl.integer("t3cav").defaultTo(0);
			tbl.integer("t3inf").defaultTo(0);
			tbl.integer("t3arch").defaultTo(0);
			tbl.integer("t4cav").defaultTo(0);
			tbl.integer("t4inf").defaultTo(0);
			tbl.integer("t4arch").defaultTo(0);
			tbl.integer("t5cav").defaultTo(0);
			tbl.integer("t5inf").defaultTo(0);
			tbl.integer("t5arch").defaultTo(0);
		})
		.createTable("building", (tbl) => {
			tbl.string("uuid").notNullable().unique().primary();
			tbl.integer("city");
			tbl.integer("castle");
		})
		.createTable("userTroopsBuilding", (tbl) => {
			tbl.string("uuid").notNullable().unique().primary();
			tbl.integer("userId")
				.unsigned()
				.references("uuid")
				.inTable("users")
				.onDelete("CASCADE")
				.onUpdate("CASCADE");
			tbl.integer("troopId")
				.unsigned()
				.references("uuid")
				.inTable("troops")
				.onDelete("CASCADE")
				.onUpdate("CASCADE");
			tbl.integer("buildingId")
				.unsigned()
				.references("uuid")
				.inTable("building")
				.onDelete("CASCADE")
				.onUpdate("CASCADE");
		});
};

exports.down = function (knex) {
	return knex.schema
		.dropTableIfExists("userTroopsBuilding")
		.dropTableIfExists("building")
		.dropTableIfExists("troops")
		.dropTableIfExists("users");
};
