const db = require("../../data/dbConfig");

module.exports = {
	findByExId,
	addExToTrip,
	findByTripId,
	deleteExpense,
	updateExpense
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
	return db("Expenses").where({ trip_id });
}

async function deleteExpense(expense_id) {
	let deleted = await db("Expenses")
		.where({ expense_id })
		.first()
		.del();

	return deleted;
}

async function updateExpense(expense_id, toBeNewExpense) {
	let update = await db("Expenses")
		.where({ expense_id })
		.update(toBeNewExpense);

	let newExpense = await findByExId(expense_id);

	return newExpense;
}
