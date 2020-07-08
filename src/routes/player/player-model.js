const db = require("../../data/db-config");

module.exports = { find, addTroops };

function find() {
	return db("troops");
}
function addTroops(userId, units) {
	console.log("units", units);
	return db("troops");
}
