exports.seed = function(knex, Promise) {
	// Deletes ALL existing entries
	return knex("Trips")
		.truncate()
		.then(function() {
			// Inserts seed entries
			return knex("Trips").insert([
				{
					trip_id: 1,
					description: "Cancun Trip!",
					trip_creator: 1,
					trip_start: Date.now()
				},
				{
					trip_id: 2,
					description: "Uber to the beach",
					trip_creator: 3,
					trip_start: Date.now()
				},
				{
					trip_id: 3,
					description: "Las Vegas Trip!",
					trip_creator: 3,
					trip_start: Date.now()
				}
			]);
		});
};
