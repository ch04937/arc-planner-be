exports.up = function (knex) {
	return knex.schema.createTable("users", (table) => {
		table.increments("userId").primary();
		table.string("username", 255).notNullable().unique();
		table.string("email").notNullable().unique();
		table.string("password", 255).notNullable();
		table.string("inGameName", 255);
	});
};

exports.down = function (knex) {
	return knex.schema.dropTable("users");
};
