exports.seed = function(knex, Promise) {
	// Deletes ALL existing entries
	return knex("Expenses")
		.truncate()
		.then(function() {
			// Inserts seed entries
			return knex("Expenses").insert([
				{
					expense_id: 1,
					trip_id: 3,
					description: "Uber to the hotel",
					amount: 25
				},
				{
					expense_id: 2,
					trip_id: 3,
					description: "Uber to the gym",
					amount: 5
				},
				{
					expense_id: 3,
					trip_id: 3,
					description: "Plane to Florida",
					amount: 400
				},
				{
					expense_id: 4,
					trip_id: 3,
					description: "Ticket to the concert",
					amount: 250
				}
			]);
		});
};
