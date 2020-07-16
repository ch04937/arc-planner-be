module.exports = {
	jwtSecrets: process.env.JTW_SECRET || "keep it secret, keep it safe",
	jwtRefreshSecrets: process.env.JTW_SECRET2 || "SO_SECRET",
};
