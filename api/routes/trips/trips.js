const express = require("express");
const Trips = require("../../models/Trips-model");

const router = express.Router();

router.get("/", (req, res) => {
	const trips = Trips.getTripByAuthor(user);

	res.send(trips);
});

module.exports = router;
