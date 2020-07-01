const db = require("../../data/db-config");

module.exports = {
	addNewUser,
	getByUserId,
	find,
};

function getByUserId(userId) {
	return db("users").where({ userId }).first();
}

function addNewUser(user) {
	return db("users")
		.insert(user, "userId")
		.then((userIds) => {
			return getByUserId(userIds[0]);
		});
}
function find(username) {
	return db("users")
		.where(function () {
			this.where("username", "=", username).orWhere(
				"email",
				"=",
				username
			);
		})
		.first();
}
