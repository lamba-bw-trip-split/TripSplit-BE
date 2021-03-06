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

	let expenses = await db("Expenses")
		.join("Trips", "Trips.trip_id", "Expenses.trip_id")
		.where("Expenses.trip_id", trip_id)
		.select(
			"Expenses.expense_id",
			"Expenses.trip_id",
			"Expenses.description",
			"Expenses.amount"
		);

	let members = await db("expenseMembers")
		.join("Trips", "Trips.trip_id", "expenseMembers.trip_id")
		.where({
			"expenseMembers.trip_id": trip_id,
			"expenseMembers.expense_id": null
		})
		.select("expenseMembers.username", "expenseMembers.paid");
	// TRIP JOIN WITH EXPENSES AND MEMBERS

	if (trip && expenses && members) {
		return {
			...trip,
			expenses,
			members
		};
	} else if (trip && expenses) {
		return {
			...trip,
			expenses
		};
	} else if (trip && members) {
		return {
			...trip,
			members
		};
	} else if (trip) {
		return trip;
	} else {
		return false;
	}
}

async function addTrip(trip, authorName) {
	const [id] = await db("Trips").insert(trip, "trip_id");
	// const [id] = await db("Trips").insert(trip);

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
