const express = require("express");
const Trips = require("../../models/Trips-model");
const TripExpenses = require("../../models/Expenses-model");
const checkIfAuthor = require("../../utils/checkIfAuthor");
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
		res.status(200).json({ trips });
	} catch (err) {
		res.status(500).json({ message: "DB error", err });
	}
});

// get trip details by trip id
router.get("/:id", authMW, async (req, res) => {
	const id = req.params.id;

	try {
		const trip = await Trips.getTripByTripID(id);
		if (trip) {
			res.status(200).json(trip);
		} else {
			res.status(404).json({ message: "No trip found with that ID!" });
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

// endpoint for changing boolean value of "completed"

router.get("/:id/updateStatus", authMW, async (req, res) => {
	const [id] = req.params.id;

	try {
		const updatedStatus = await Trips.boolTripStatus(id);

		res.status(200).json(updatedStatus);
	} catch (err) {
		res.status(500).json(err);
	}
});

// ADD A TRIP
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

// DELETE A TRIP
router.delete("/:id", authMW, checkIfAuthor, async (req, res) => {
	const [id] = req.params.id;
	try {
		let toDelete = await Trips.deleteTrip(id);
		if (toDelete === 1) {
			res
				.status(200)
				.json({ message: `Your trip has been deleted succesfully!` });
		} else {
			res.status(404).json({
				message: `Trip could not be deleted. Please ensure you are attempting to delete a valid trip.`
			});
		}
	} catch (error) {
		res.status(500).json(error);
	}
});

// UPDATE A TRIP
router.put("/:id", authMW, async (req, res) => {
	const [id] = req.params.id;
	let updatedTrip = req.body;
});

module.exports = router;
