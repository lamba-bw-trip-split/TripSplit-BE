exports.up = function(knex, Promise) {
	return knex.schema.createTable("Users", tbl => {
		tbl.increments();
		tbl
			.string("username", 128)
			.notNullable()
			.unique();
		tbl
			.string("email", 128)
			.notNullable()
			.unique();
		tbl.string("password", 256).notNullable();
	});
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTableIfExists("Users");
};
