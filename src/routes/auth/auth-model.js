const db = require("../../data/db-config");

module.exports = {
	addNewUser,
	getByUserId,
	getByUsername,
	find,
};

function addNewUser(user) {
	return db("users")
		.insert(user, "uuid")
		.then((userIds) => {
			return getByUserId(userIds[0]);
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
