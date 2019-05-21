const db = require("../../data/dbConfig");

module.exports = {
	getTripByAuthor,
	getTripByTripID,
	addTrip
};

function getTripByAuthor(trip_creator) {
	return db("Trips")
		.select(
			"description",
			"trip_creator",
			"trip_start",
			"trip_end",
			"completed"
		)
		.where({ trip_creator });
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
