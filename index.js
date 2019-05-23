require("dotenv").config();
const server = require("./api/server");

// define port to either be set from environment variables (for Heroku deployment) or 4000 if local/no env vars set
const port = process.env.PORT || 4000;

server.listen(port, () => {
	console.log(`\n server running on port ${port} \n`);
});
