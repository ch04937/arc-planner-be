const db = require("../../data/db-config");
const { v1 } = require("uuid");

module.exports = {
	getProfile,
	add,
	addDefaultProfile,
	// getProfileById,
	update,
};

function getProfile(userId) {
	return db("userProfile as up", "up.userId")
		.join("users as u")
		.where("u.userId", "=", userId)
		.select("up.profileId")
		.then((ids) => {
			profileId = ids[0];
			return db("profile").where(profileId).first();
		});
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

function update(profileId, changes) {
	return db("profile")
		.where({ profileId })
		.update(changes)
		.then((count) => (count > 0 ? getProfile(profileId) : null));
}
