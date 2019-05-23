const db = require("../../data/dbConfig");

module.exports = {
	getTripMembers,
	getExpenseMembers,
	addMemberToTrip,
	removeMemberFromTrip,
	addMemberToExpense,
	removeMemberFromExpense,
	boolPaidStatus
};

async function getTripMembers(trip_id) {
	let tripMembers = await db("expenseMembers")
		.where({ trip_id })
		.select("username");

	return tripMembers;
}

async function getExpenseMembers(expense_id) {
	let expenseMembers = await db("expenseMembers")
		.where({ expense_id })
		.select("username", "paid");

	return expenseMembers;
}

async function addMemberToTrip(trip_id, username) {
	// take in trip, username

	let tripMemObj = {
		username: username.toLowerCase(),
		trip_id: trip_id
	};
	// add username to trip

	// let newMemberOfTrip = await db("expenseMembers").insert(tripMemObj);
	let newMemberOfTrip = await db("expenseMembers").insert(tripMemObj, "id");

	// async call getTripMembers, return new tripMembers list
	let newMembersOfTrip = await getTripMembers(trip_id);

	return newMembersOfTrip;
}

async function removeMemberFromTrip(trip_id, username) {
	//

	let toDelete = await db("expenseMembers")
		.where({
			expense_id: null || undefined,
			username: username.toLowerCase(),
			trip_id: trip_id
		})
		.del();

	let newTripMembers = await getTripMembers(trip_id);

	return newTripMembers;
}

async function addMemberToExpense(expense_id, trip_id, username) {
	let expMemObj = {
		expense_id: expense_id,
		trip_id: trip_id,
		username: username.toLowerCase()
	};

	// let memberOfExpense = await db("expenseMembers").insert(expMemObj);
	let memberOfExpense = await db("expenseMembers").insert(expMemObj, "id");

	let newMembersOfExpenses = await getExpenseMembers(expense_id);

	return newMembersOfExpenses;
}

async function removeMemberFromExpense(expense_id, trip_id, username) {
	//

	let toDelete = await db("expenseMembers")
		.where({
			expense_id: expense_id,
			username: username.toLowerCase(),
			trip_id: trip_id
		})
		.del();

	let newMembersOfExpenses = await getExpenseMembers(expense_id);

	return newMembersOfExpenses;
}

async function boolPaidStatus(expense_id, trip_id, username) {
	const oldStatus = await db("expenseMembers")
		.select("paid")
		.where({
			expense_id: expense_id,
			username: username.toLowerCase(),
			trip_id: trip_id
		})
		.first();

	const newStatus = await db("expenseMembers")
		.where({
			expense_id: expense_id,
			username: username.toLowerCase(),
			trip_id: trip_id
		})
		.update("paid", !oldStatus.paid);

	return getExpenseMembers(expense_id);
}
