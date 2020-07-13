const db = require("../../data/db-config");
const db = require("../../data/db-config");

module.exports = {
	getAllFrom,
	postTo,
};

function getAllFrom(table) {
	return db(table);
}

function postTo(table, userId, body) {
	body.uuid = uuidv1();
	return db(table)
		.insert(body, "uuid")
		.then((res) => getByUserId(res[0]));
}
