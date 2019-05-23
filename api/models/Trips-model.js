const db = require("../../data/dbConfig");

module.exports = {
	getTripByAuthor,
	getTripByTripID,
	addTrip,
	boolTripStatus,
	deleteTrip,
	updateTrip
};

function getTripByAuthor(trip_creator) {
	return db("Trips").where({ trip_creator });
}

async function getTripByTripID(trip_id) {
	let trip = await db("Trips")
		.where({ trip_id })
		.first();

	if (trip) {
		return trip;
	} else {
		return false;
	}
}

async function addTrip(trip, authorName) {
	const [id] = await db("Trips").insert(trip, "trip_id");
	// const [id] = await db("Trips").insert(trip);

	console.log(authorName);
	console.log(trip);
	console.log(id);
	const newExpMember = {
		username: authorName,
		trip_id: id
	};

	// const expenseMember = await db("expenseMembers").insert(newExpMember);
	const expenseMember = await db("expenseMembers").insert(newExpMember, "id");

	return getTripByTripID(id);
}

async function boolTripStatus(trip_id) {
	const oldStatus = await db("Trips")
		.select("completed")
		.where({ trip_id })
		.first();

	const newStatus = await db("Trips")
		.where({ trip_id })
		.update("completed", !oldStatus.completed);

	return getTripByTripID(trip_id);
}

async function deleteTrip(trip_id) {
	let deleted = await db("Trips")
		.where({ trip_id })
		.first()
		.del();

	return deleted;
}

async function updateTrip(trip_id, toBeNewTrip) {
	let update = await db("Trips")
		.where({ trip_id })
		.update(toBeNewTrip);

	let newTrip = await getTripByTripID(trip_id);

	return newTrip;
}
