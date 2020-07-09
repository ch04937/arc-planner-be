const validateRegistration = (req, res, next) => {
	if (Object.keys(req.body) === 0) {
		res.status(400).json({ message: "auth/missing form information" });
	}

	if (!req.body.username || !req.body.email || !req.body.password) {
		res.status(400).json({
			message: "auth/missing one or more request combination.",
		});
	}

	next();
};

const validateLogin = (req, res, next) => {
	if (Object.keys(req.body) === 0) {
		res.status(400).json({ message: "auth/missing form information" });
	}

	if (!req.body.userId || !req.body.password) {
		res.status(400).json({
			message: "auth/missing one or more request combination.",
		});
	}

	next();
};

module.exports = {
	validateRegistration,
	validateLogin,
};
