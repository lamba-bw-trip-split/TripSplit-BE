const express = require("express");
const Trips = require("../../models/Trips-model");
const TripExpenses = require("../../models/Expenses-model");
const TripMembers = require("../../models/expenseMembers-model");
const checkIfAuthor = require("../../utils/checkIfAuthor");
const authMW = require("../../utils/authMW");

const router = express.Router();

// Get trips created by user logged in
router.get("/", authMW, async (req, res) => {
	const authorID = req.headers.userID;

	try {
		const trips = await Trips.getTripByAuthor(authorID);

		res.status(200).json({ trips });
	} catch (err) {
		res.status(500).json({ message: "DB error", err });
	}
});

// Get trip details by trip id
router.get("/:id", authMW, async (req, res) => {
	const id = req.params.id;

	try {
		const trip = await Trips.getTripByTripID(id);
		if (trip) {
			const tripMembers = await TripMembers.getTripMembers(id);

			res.status(200).json(trip);
		} else {
			res.status(404).json({ message: "No trip found with that ID!" });
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

router.get("/:id/members", authMW, async (req, res) => {
	const id = req.params.id;

	try {
		let tripMembers = await TripMembers.getTripMembers(id);
		res.status(200).json(tripMembers);
	} catch (error) {
		res.status(500).json({ error });
	}
});

router.post("/:id/members", authMW, async (req, res) => {
	const id = req.params.id;
	let { username } = req.body;

	if (username) {
		try {
			let tripMembers = await TripMembers.addMemberToTrip(id, username);
			res.status(201).json(tripMembers);
		} catch (error) {
			res.status(500).json(error);
		}
	} else {
		res.status(400).json({
			message: "Must provide username of person you wish to add to this trip!"
		});
	}
});

// delete member from trip
router.delete(":/id/members", authMW, async (req, res) => {
	const trip_id = req.params.id;
	let { username } = req.body;

	if (username) {
		try {
			let tripMembers = await TripMembers.removeMemberFromTrip(
				trip_id,
				username
			);
			res.status(201).json(tripMembers);
		} catch (error) {
			res.status(500).json(error);
		}
	} else {
		res.status(400).json({
			message:
				"Must provide username of person you wish to delete from this trip!"
		});
	}
});

// Update existing trip "completed" boolean value by trip id
router.get("/:id/updateStatus", authMW, checkIfAuthor, async (req, res) => {
	const id = req.params.id;

	try {
		const updatedStatus = await Trips.boolTripStatus(id);

		res.status(200).json(updatedStatus);
	} catch (err) {
		res.status(500).json(err);
	}
});

// Add a new trip
router.post("/addTrip", authMW, async (req, res) => {
	const authorID = req.headers.userID;
	const authorName = req.headers.userName;
	console.log("from router", authorName);
	console.log("router", authorID);
	let { description, trip_start, trip_end } = req.body;

	if (description) {
		trip = {
			trip_creator: authorID,
			description: description,
			trip_start: trip_start,
			trip_end: trip_end
		};

		try {
			const tripAdded = await Trips.addTrip(trip, authorName);
			res.status(201).json(tripAdded);
		} catch (err) {
			res.status(500).json({ message: "Database error", err });
		}
	} else {
		res.status(500).json({ message: "A description of the trip is required." });
	}
});

// Delete an existing trip
router.delete("/:id", authMW, checkIfAuthor, async (req, res) => {
	const id = req.params.id;

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

// Update an existing trip
router.put("/:id", authMW, checkIfAuthor, async (req, res) => {
	const id = req.params.id;
	let tripUpdates = req.body;

	try {
		let newTrip = await Trips.updateTrip(id, tripUpdates);
		res.status(202).json(newTrip);
	} catch (error) {
		res.status(500).json({ err });
	}
});

module.exports = router;
