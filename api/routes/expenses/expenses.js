const express = require("express");
const Expenses = require("../../models/Expenses-model");
const ExpenseMembers = require("../../models/expenseMembers-model");
const authMW = require("../../utils/authMW");

const router = express.Router({ mergeParams: true });

// Get expenses for trip via trip id
router.get("/", authMW, async (req, res) => {
	const id = req.params.tripid;

	try {
		tripExs = await Expenses.findByTripId(id);
		res.status(200).json(tripExs);
	} catch (err) {
		res.status(500).json(err);
	}
});

// Get specific expense for trip via expense id.
router.get("/:id", authMW, async (req, res) => {
	const id = req.params.id;

	try {
		let expenses = await Expenses.findByExId(id);

		res.status(200).json(expenses);
	} catch (err) {
		res.status(500).json({ err });
	}
});

// Get members who belong to that expense via expense id.
router.get("/:id/members", authMW, async (req, res) => {
	const id = req.params.id;

	try {
		let expMembers = await ExpenseMembers.getExpenseMembers(id);

		res.status(200).json(expMembers);
	} catch (err) {
		res.status(500).json(err);
	}
});

// Add members to specific expense via expense id. Requires username of registered user.
router.post("/:id/members", authMW, async (req, res) => {
	const expense_id = req.params.id;
	const trip_id = req.params.tripid;

	let { username } = req.body;

	if (username) {
		try {
			let newExpMemList = await ExpenseMembers.addMemberToExpense(
				expense_id,
				trip_id,
				username
			);

			res.status(201).json(newExpMemList);
		} catch (err) {
			res.status(500).json({ err });
		}
	} else {
		res.status(400).json({
			message: "A username is required to add a friend to an expense."
		});
	}
});

// Toggle specific individual's payment status on specific expense via expense id and individual's username.
router.post("/:id/members/paid", authMW, async (req, res) => {
	const expense_id = req.params.id;
	const trip_id = req.params.tripid;

	let { username } = req.body;

	if (username) {
		try {
			let newExpMemList = await ExpenseMembers.boolPaidStatus(
				expense_id,
				trip_id,
				username
			);

			res.status(201).json(newExpMemList);
		} catch (err) {
			res.status(500).json({ err });
		}
	} else {
		res.status(400).json({
			message: "A username is required to update expense payment status."
		});
	}
});

// Delete specific individual from specific expense via expense id and individual's username.
router.delete("/:id/members", authMW, async (req, res) => {
	const expense_id = req.params.id;
	const trip_id = req.params.tripid;

	let { username } = req.body;

	if (username) {
		try {
			let itemToDel = await ExpenseMembers.removeMemberFromExpense(
				expense_id,
				trip_id,
				username
			);

			res.status(200).json(itemToDel);
		} catch (error) {
			res.status(500).json(err);
		}
	} else {
		res
			.status(404)
			.json({ message: "Must provide username to delete user from expense" });
	}
});

// Add a new expense to a specific trip. Requires expense description and amount (integer) in request.
router.post("/", authMW, async (req, res) => {
	expense = req.body;
	const trip_id = req.params.tripid;
	const authorName = req.headers.userName;

	let { description, amount } = req.body;

	expense = {
		...expense,
		trip_id: trip_id
	};

	if (trip_id && description && amount) {
		let newEx = await Expenses.addExToTrip(expense, authorName);

		try {
			res.status(201).json(newEx);
		} catch (err) {
			res.status(500).json(err);
		}
	} else {
		res.status(500).json({
			message:
				"You need to provide a both a description, and expense amount. In addition, you must specify which trip this expense shall be added to."
		});
	}
});

// Delete specific expense from trip via expense id.
router.delete("/:id", authMW, async (req, res) => {
	const id = req.params.id;

	try {
		let deleted = await Expenses.deleteExpense(id);

		if (deleted === 1) {
			res.status(201).json({ message: `Expense deleted!` });
		} else {
			res.status(404).json({
				message: `No expense found to delete! Was the expense ID valid?`
			});
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

// Edit an existing expense via expense id. Pass changes in request body.
router.put("/:id", authMW, async (req, res) => {
	const id = req.params.id;
	let toBeNewExpense = req.body;

	try {
		let newExpense = await Expenses.updateExpense(id, toBeNewExpense);

		res.status(201).json(newExpense);
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
