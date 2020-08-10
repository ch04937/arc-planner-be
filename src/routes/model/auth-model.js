const db = require("../../data/db-config");

module.exports = {
	addNewUser,
	getByUserId,
	getByUsername,
	find,
	findGuild,
};

function findGuild(userId) {
	return db("users").where({ userId }).first().select("isMember");
}

function addNewUser(user) {
	return db("users")
		.insert(user, "uuid")
		.then((userId) => {
			return getByUserId(userId[0]);
		});
}
function getByUserId(userId) {
	return db("users").where({ userId }).first();
}

function getByUsername(username) {
	return db("users").where({ username }).first();
}

function find(userId) {
	return db("users")
		.where(function () {
			this.where("username", "=", userId).orWhere("email", "=", userId);
		})
		.first();
}
