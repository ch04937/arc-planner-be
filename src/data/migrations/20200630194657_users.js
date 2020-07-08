exports.up = function (knex) {
	return knex.schema
		.createTable("users", (tbl) => {
			tbl.increments("userId").primary();
			tbl.string("username", 255).notNullable().unique();
			tbl.string("email").notNullable().unique();
			tbl.string("password", 255).notNullable();
			tbl.string("inGameName", 255);
			tbl.string("uuid", 255).notNullable().unique();
		})
		.createTable("troops", (tbl) => {
			tbl.increments("troopId").primary();
			tbl.integer("t3cav").defaultTo(0);
			tbl.integer("t3inf").defaultTo(0);
			tbl.integer("t3arch").defaultTo(0);
			tbl.integer("t4cav").defaultTo(0);
			tbl.integer("t4inf").defaultTo(0);
			tbl.integer("t4arch").defaultTo(0);
			tbl.integer("t5cav").defaultTo(0);
			tbl.integer("t5inf").defaultTo(0);
			tbl.integer("t5arch").defaultTo(0);
			tbl.string("uuid").notNullable().unique();
		})
		.createTable("building", (tbl) => {
			tbl.increments("buildingId");
			tbl.integer("city");
			tbl.integer("castle");
			tbl.string("uuid").notNullable().unique();
		})
		.createTable("userTroopsBuilding", (tbl) => {
			tbl.increments("userTroopBuildingId").primary();
			tbl.integer("userId")
				.unsigned()
				.references("userId")
				.inTable("users")
				.onDelete("CASCADE")
				.onUpdate("CASCADE");
			tbl.integer("troopId")
				.unsigned()
				.references("troopId")
				.inTable("troops")
				.onDelete("CASCADE")
				.onUpdate("CASCADE");
			tbl.integer("buildingId")
				.unsigned()
				.references("buildingId")
				.inTable("building")
				.onDelete("CASCADE")
				.onUpdate("CASCADE");
			tbl.string("uuid").notNullable().unique();
		});
};

exports.down = function (knex) {
	return knex.schema
		.dropTableIfExists("userTroopsBuilding")
		.dropTableIfExists("building")
		.dropTableIfExists("troops")
		.dropTableIfExists("users");
};
