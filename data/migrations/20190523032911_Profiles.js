exports.up = function(knex, Promise) {
	return knex.schema.createTable("Profiles", tbl => {
		tbl.increments("profile_id");
		tbl
			.string("username")
			.unique()
			.notNullable();
		tbl.string("first_name");
		tbl.string("last_name");

		tbl
			.foreign("username")
			.references("username")
			.inTable("Users");
	});
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTableIfExists("Profiles");
};
