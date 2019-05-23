exports.up = function(knex, Promise) {
	return knex.schema.createTable("expenseMembers", tbl => {
		tbl.increments();
		tbl
			.integer("expense_id")
			.references("expense_id")
			.inTable("Expenses")
			.onDelete("CASCADE")
			.onUpdate("CASCADE");

		tbl
			.string("username")
			.references("username")
			.inTable("Profiles")
			.notNullable()
			.onDelete("CASCADE")
			.onUpdate("CASCADE");

		tbl
			.integer("trip_id")
			.references("trip_id")
			.inTable("Trips")
			.notNullable()
			.onDelete("CASCADE")
			.onUpdate("CASCADE");
	});
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTableIfExists("expenseMembers");
};
