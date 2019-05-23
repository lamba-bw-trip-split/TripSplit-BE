const jwt = require("jsonwebtoken");
const secrets = require("../../config/secrets");

module.exports = {
	generateToken
};

function generateToken(users) {
	const payload = {
		subject: users.id,
		userName: users.username
	};

	const options = {
		expiresIn: "2d"
	};

	return jwt.sign(payload, secrets.jwtSecret, options);
}
