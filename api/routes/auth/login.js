const express = require("express");
const bcrypt = require("bcryptjs");
const Users = require("../../models/Users-model");
const tokenService = require("../../utils/token-service");

const router = express.Router();

// Log an existing user in. Requires a username and password.
router.post("/", (req, res) => {
	let { username, password } = req.body;
	if (username && password) {
		username = username.toLowerCase();
		Users.findBy({ username })
			.first()
			.then(user => {
				if (user && bcrypt.compareSync(password, user.password)) {
					const token = tokenService.generateToken(user);
					res.status(200).json({
						message: `Succesful login! Welcome, ${user.username}`,
						token
					});

					console.log("success");
				} else {
					res
						.status(401)
						.json({ message: "You've provided invalid credentials" });
				}
			})
			.catch(err => {
				res.status(500).json(err);
			});
	} else {
		res
			.status(500)
			.json({ message: "You must provide both a username and a password!" });
	}
});

module.exports = router;
