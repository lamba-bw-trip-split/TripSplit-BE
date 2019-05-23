const db = require("../../data/dbConfig");

module.exports = {
	find,
	findBy,
	findById,
	add
};
function find() {
	return db("Users").select("id", "username");
}

function findBy(filter) {
	return db("Users").where(filter);
}

function findById(id) {
	return db("Users")
		.where({ id })
		.first();
}

async function add(user) {
	// const [id] = await db("Users").insert(user, "id");
	const profile = {
		username: user.username
	};
	const [id] = await db("Users").insert(user);

	// const userProfile = await db("Profiles").insert(userrname, "username");
	const userProfile = await db("Profiles").insert(profile);

	return findById(id);
}
