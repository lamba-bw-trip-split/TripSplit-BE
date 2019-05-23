const express = require("express");
const Expenses = require("../../models/Expenses-model");
const ExpenseMembers = require("../../models/expenseMembers-model");
const authMW = require("../../utils/authMW");

const router = express.Router({ mergeParams: true });

router.get("/", authMW, async (req, res) => {
	const [id] = req.params.tripid;

	try {
		tripExs = await Expenses.findByTripId(id);
		res.status(200).json(tripExs);
	} catch (err) {
		res.status(500).json(err);
	}
});

router.get("/:id", authMW, async (req, res) => {
	const id = req.params.id;

	try {
		let expenses = await Expenses.findByExId(id);

		res.status(200).json(expenses);
	} catch (err) {
		res.status(500).json({ err });
	}
});

router.get("/:id/members", authMW, async (req, res) => {
	const id = req.params.id;

	try {
		let expMembers = await ExpenseMembers.getExpenseMembers(id);

		res.status(200).json(expMembers);
	} catch (err) {
		res.status(500).json(err);
	}
});

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

router.post("/", authMW, async (req, res) => {
	expense = req.body;
	const trip_id = req.params.tripid;
	const authorName = req.headers.userName;
	console.log("from exp router", authorName);

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

// router.put

// delete expense function
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
