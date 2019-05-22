const express = require("express");
const Expenses = require("../../models/Expenses-model");
const authMW = require("../../utils/authMW");

const router = express.Router();

router.get("/:id", authMW, async (req, res) => {
	const id = req.params.id;

	console.log(id);
	try {
		let expenses = await Expenses.findByExId(id);

		console.log(expenses);
		res.status(200).json(expenses);
	} catch (err) {
		res.status(500).json({ err });
	}
});

router.post("/", async (req, res) => {
	expense = req.body;
	let { trip_id, description, amount } = req.body;

	if (trip_id && description && amount) {
		let newEx = await Expenses.addExToTrip(expense);

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

module.exports = router;
