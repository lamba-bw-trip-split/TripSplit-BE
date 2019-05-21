const express = require("express");
const Trips = require("../../models/Trips-model");
const authMW = require("../../utils/authMW");

const router = express.Router();

router.get("/", authMW, async (req, res) => {
	try {
		const trips = await Trips.getTripByAuthor(3);

		console.log(req.headers.userID);
		console.log(trips);
		// res.send({ trips });
	} catch (err) {
		console.log(err);
	}
});

module.exports = router;
