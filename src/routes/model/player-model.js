const db = require("../../data/db-config");

module.exports = { find, getProfile };

function find() {
	return db("troops");
}

function getProfile(uuid) {
	return db("users").where({ uuid }).first();
}
