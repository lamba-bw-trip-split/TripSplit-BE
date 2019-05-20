const express = require("express");
const bcrypt = require("bcryptjs");
const Users = require("../../models/Users-model");

const router = express.Router();

router.post("/", (req, res) => {
	let { username, password, email } = req.body;

	if (username && password && email) {
		// username = username.toLowerCase();
		let user = req.body;
		const hash = bcrypt.hashSync(user.password, 13);
		user.password = hash;
		user.username = user.username.toLowerCase();
		Users.add(user)
			.then(newUser => {
				res.status(200).json(newUser);
			})
			.catch(err => {
				res.send(err);
			});
	} else {
		res.status(500).json({
			message: "All fields (username, password, and email) must be completed."
		});
	}
});

module.exports = router;
