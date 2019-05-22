const express = require("express");
const Trips = require("../../models/Trips-model");
const TripExpenses = require("../../models/Expenses-model");
const authMW = require("../../utils/authMW");

const router = express.Router();

// "my trips". Will return trips of the user logged in
router.get("/", authMW, async (req, res) => {
	// const authorID = Number(req.headers.userID);
	const authorID = req.headers.userID;
	try {
		// console.log(authorID);
		const trips = await Trips.getTripByAuthor(authorID);

		// console.log(req.headers.userID);
		console.log(trips);
		res.status(200).json({ trips });
	} catch (err) {
		res.status(500).json({ message: "DB error", err });
	}
});

// add back authMW
router.get("/:id", async (req, res) => {
	const id = req.params.id;

	try {
		const trip = await Trips.getTripByTripID(id);

		res.status(200).json(trip);
	} catch (err) {
		res.status(500).json(err);
	}
});

// endpoint for changing boolean value of "completed"

router.get("/:id/updateStatus", async (req, res) => {
	const [id] = req.params.id;

	try {
		const updatedStatus = await Trips.boolTripStatus(id);

		res.status(200).json(updatedStatus);
	} catch (err) {
		res.status(500).json(err);
	}
});

router.get("/:id/expenses", authMW, async (req, res) => {
	const id = req.params.id;

	try {
		tripExs = await TripExpenses.findByTripId(id);
		res.status(200).json(tripExs);
	} catch (err) {
		res.status(500).json(err);
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
			res.status(201).json(tripAdded);
		} catch (err) {
			res.status(500).json({ message: "Database error", err });
		}
	} else {
		res.status(500).json({ message: "A description of the trip is required." });
	}
});

// router.get("/")

module.exports = router;
