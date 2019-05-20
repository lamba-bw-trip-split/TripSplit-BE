exports.seed = function(knex, Promise) {
	// Deletes ALL existing entries
	return knex("Users")
		.truncate()
		.then(function() {
			// Inserts seed entries
			return knex("Users").insert([
				{ id: 1, username: "seed1", email: "seed1@seed.com", password: "Seed" },
				{ id: 2, username: "seed2", email: "seed2@seed.com", password: "Seed" },
				{ id: 3, username: "seed3", email: "seed3@seed.com", password: "Seed" }
			]);
		});
};
