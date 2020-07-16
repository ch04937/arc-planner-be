const db = require("../../data/db-config");

module.exports = {
	addNewUser,
	getByUserUuid,
	getByUsername,
	find,
};

function addNewUser(user) {
	return db("users")
		.insert(user, "uuid")
		.then((userId) => {
			return getByUserId(userId[0]);
		});
}
function getByUserUuid(uuid) {
	return db("users").where({ uuid }).first();
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
