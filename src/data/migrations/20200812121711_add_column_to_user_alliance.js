exports.up = function (knex, Promise) {
  return knex.schema.table("userAlliance", function (tbl) {
    tbl.boolean("hasApplied").defaultTo(false);
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.table("userAlliance", function (tbl) {
    tbl.dropColumn("hasApplied");
  });
};
