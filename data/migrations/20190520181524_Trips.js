exports.up = function(knex, Promise) {
	return knex.schema.createTable("Trips", tbl => {
		tbl.increments("trip_id");
		tbl.string("description", 256).notNullable();

		tbl
			.integer("trip_creator")
			.references("id")
			.inTable("Users")
			.notNullable()
			.onDelete("CASCADE")
			.onUpdate("CASCADE");

		tbl.date("trip_start");

		tbl.date("trip_end");
		tbl.boolean("completed").defaultTo(false);
	});
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTableIfExists("Trips");
};
