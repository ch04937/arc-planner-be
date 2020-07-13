const db = require("../../data/db-config");
const { v1 } = require("uuid");

module.exports = {
	getProfile,
	add,
	addDefaultProfile,
};

function getProfile(uuid) {
	return db("profile").where({ uuid }).first();
}

function add(body) {
	body.uuid = uuidv1();
	return db("profile")
		.insert(body, "uuid")
		.then((res) => getByUserId(res[0]));
}

function addDefaultProfile(userId) {
	const profile = {
		uuid: v1(),
	};
	return db("profile")
		.insert(profile, "profileId")
		.then((ids) => {
			const profileId = ids[0];
			return db("userProfile")
				.insert({
					userId,
					profileId,
					uuid: v1(),
				})
				.then((ids) => ids[0]);
		});
}
