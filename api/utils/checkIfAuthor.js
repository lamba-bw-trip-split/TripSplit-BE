// Imports

const Trips = require("../models/Trips-model");

async function grabTripCreator(id) {
	let trip = await Trips.getTripByTripID(id);
	let tripCreator = await trip.trip_creator;
	return tripCreator;
}

module.exports = async (req, res, next) => {
	// Request dfinitions
	const userID = req.headers.userID;
	const token = req.headers.token;
	const dataItem = req.params.id;

	// Author definitions
	const authorID = await grabTripCreator(dataItem);

	// Check if the person requesting this endpoint is the author of the data item.
	// If not, deny access! (For deleting trip, marking completed, etc.)

	if (!authorID) {
		res.status(404).json({ message: "No item artifact found." });
	} else if (authorID === userID) {
		next();
	} else {
		res.status(401).json({
			nessage:
				"You are unauthorized to do this! Only the creator of this item may modify it."
		});
	}
};
