const jwt = require("jsonwebtoken");

const secrets = require("../../config/secrets");

module.exports = (req, res, next) => {
	const token = req.headers.authorization;

	if (token) {
		jwt.verify(token, secrets.jwtSecret, (err, decodedToken) => {
			if (err) {
				res.status(401).json({
					message:
						"Error authenticating user. Please logout and log back in to try again.",
					err
				});
			} else {
				req.headers.token = decodedToken;
				req.headers.userID = Number(decodedToken.subject);
				req.headers.userName = decodedToken.userName;
				next();
			}
		});
	} else {
		res.status(401).json({
			message:
				"You must be authorized to view this content. Please login to continue."
		});
	}
};
