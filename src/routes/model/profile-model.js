const db = require("../../data/db-config");
const { v1 } = require("uuid");

module.exports = {
	getProfile,
	getImg,
	add,
	saveImg,
	addDefaultProfile,
	addDefaultImage,
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
function getImg(userId) {
	return db("userImage as ui", "ui.userId")
		.join("users as u ")
		.where("u.userId", "=", userId)
		.select("ui.imgId")
		.then((ids) => {
			imgId = ids[0];
			return db("profilePicture").where(imgId).first();
		});
}
function add(body) {
	body.uuid = uuidv1();
	return db("profile")
		.insert(body, "uuid")
		.then((res) => getByUserId(res[0]));
}

function getUpdatedImg(imgId) {
	return db("profilePicture").where({ imgId }).first();
}

function saveImg(imgId, changes) {
	return db("profilePicture")
		.where({ imgId })
		.update(changes)
		.then((count) => (count > 0 ? getUpdatedImg(imgId) : null));
}

function addDefaultImage(userId) {
	const imgId = {
		uuid: v1(),
	};
	return db("profilePicture")
		.insert(imgId, "imgId")
		.then((ids) => {
			const imgId = ids[0];
			return db("userImage")
				.insert({ userId, imgId })
				.then((ids) => ids[0]);
		});
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
				.insert({ userId, profileId })
				.then((ids) => ids[0]);
		});
}

function update(profileId, changes) {
	return db("profile")
		.where({ profileId })
		.update(changes)
		.then((count) => (count > 0 ? getProfile(profileId) : null));
}
