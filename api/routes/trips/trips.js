const express = require("express");
const Trips = require("../../models/Trips-model");
const authMW = require("../../utils/authMW");

const router = express.Router();

router.get("/", authMW, async (req, res) => {
	// const authorID = Number(req.headers.userID);
	const authorID = req.headers.userID;
	try {
		console.log(authorID);
		const trips = await Trips.getTripByAuthor(authorID);

		// console.log(req.headers.userID);
		console.log(trips);
		res.send({ trips });
	} catch (err) {
		console.log(err);
	}
});

router.post("/addTrip", authMW, async (req, res) => {
	const authorID = req.headers.userID;

	let { description, trip_start, trip_end } = req.body;

	if (description) {
		trip = {
			trip_creator: authorID,
			description: description,
			trip_start: trip_start,
			trip_end: trip_end
		};

		try {
			const tripAdded = await Trips.addTrip(trip);
			res.send(tripAdded);
		} catch (err) {
			res.status(500).json({ message: "Database error", err });
		}
	} else {
		res.status(500).json({ message: "A description of the trip is required." });
	}
});

module.exports = router;
