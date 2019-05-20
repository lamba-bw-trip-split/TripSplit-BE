exports.seed = function(knex, Promise) {
	// Deletes ALL existing entries
	return knex("Users")
		.truncate()
		.then(function() {
			// Inserts seed entries
			return knex("Users").insert([
				{ id: 1, username: "Seed", email: "seed@seed.com", password: "Seed" }
			]);
		});
};
