exports.up = function(knex, Promise) {
	return knex.schema.createTable("expenses", tbl => {
		tbl.increments("expense_id");
		tbl
			.integer("trip_id")
			.references("trip_id")
			.inTable("Trips")
			.notNullable()
			.onDelete("CASCADE")
			.onUpdate("CASCADE");

		tbl.string("description", 256).notNullable();
		tbl.integer("amount").notNullable();

		tbl
			.integer("countPeoplePaid")
			.notNullable()
			.defaultTo(0);

		tbl.specificType("peopleWhoPaid", intArray);
	});
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTableIfExists("expenses");
};
