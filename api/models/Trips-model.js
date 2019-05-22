const db = require("../../data/dbConfig");

module.exports = {
	getTripByAuthor,
	getTripByTripID,
	addTrip,
	boolTripStatus
};

function getTripByAuthor(trip_creator) {
	return (
		db("Trips")
			// .select(
			// 	"description",
			// 	"trip_creator",
			// 	"trip_start",
			// 	"trip_end",
			// 	"completed"
			// )
			.where({ trip_creator })
	);
}

function getTripByTripID(trip_id) {
	return (
		db("trips")
			// .select(
			// 	"description",
			// 	"trip_creator",
			// 	"trip_start",
			// 	"trip_end",
			// 	"completed"
			// )
			.where({ trip_id })
			.first()
	);
}

async function addTrip(trip) {
	const [id] = await db("Trips").insert(trip);

	return getTripByTripID(id);
}

async function boolTripStatus(trip_id) {
	//
	const oldStatus = await db("Trips")
		.select("completed")
		.where({ trip_id })
		.first();

	const newStatus = await db("Trips")
		.where({ trip_id })
		.update("completed", !oldStatus.completed);

	return getTripByTripID(trip_id);
}
