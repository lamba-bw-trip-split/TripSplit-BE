const db = require("../../data/dbConfig");

module.exports = {
	getTripByAuthor
};

function getTripByAuthor(trip_creator) {
	return db("Trips")
		.select("description", "trip_creator", "trip_start", "trip_end", "complete")
		.where({ trip_creator });
}
