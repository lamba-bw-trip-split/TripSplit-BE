const db = require("../../data/dbConfig");

module.exports = {
	findByExId,
	addExToTrip,
	findByTripId,
	deleteExpense
};

function findByExId(expense_id) {
	return db("Expenses")
		.where({ expense_id })
		.first();
}

async function addExToTrip(expense) {
	let [ExID] = await db("Expenses").insert(expense);

	let ExRes = await findByExId(ExID);

	return ExRes;
}

function findByTripId(trip_id) {
	return db("Expenses")
		.where({ trip_id })
		.first();
}

async function deleteExpense(expense_id) {
	let deleted = await db("Expenses")
		.where({ expense_id })
		.first()
		.del();

	return deleted;
}
