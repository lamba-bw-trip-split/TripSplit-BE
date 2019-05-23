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

// Get members associated with that trip via trip id
router.get("/:id/members", authMW, async (req, res) => {
	const id = req.params.id;

	try {
		let tripMembers = await TripMembers.getTripMembers(id);
		res.status(200).json(tripMembers);
	} catch (error) {
		res.status(500).json({ error });
	}
});

// Add an existing registered user to a trip via trip id. Requires username of user in request.
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

// Note: You are not required to be the author to add members to a trip (above function).
// You are, however, required to be the author of the trip if you would like to remove members from a trip.

// Delete an existing registered user from a trip via trip id. Requires username of user in request. Must be the author of the trip to do so.
router.delete(":/id/members", authMW, checkIfAuthor, async (req, res) => {
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

// Update existing trip "completed" boolean value by trip id. Must be the author of the trip to do so.
router.get("/:id/updateStatus", authMW, checkIfAuthor, async (req, res) => {
	const id = req.params.id;

	try {
		const updatedStatus = await Trips.boolTripStatus(id);

		res.status(200).json(updatedStatus);
	} catch (err) {
		res.status(500).json(err);
	}
});

// Add a new trip. Requires description of trip in request.
router.post("/addTrip", authMW, async (req, res) => {
	const authorID = req.headers.userID;
	const authorName = req.headers.userName;
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

// Delete an existing trip via trip id. Must be the author of the trip to do so.
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

// Update an existing trip via trip id. Must be the author of the trip to do so.
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
