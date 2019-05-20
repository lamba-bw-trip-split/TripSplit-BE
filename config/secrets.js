// This is a private file!
// We will access the real jwtSecret to sign our tokens with from our dotenv config.
// We'll also leave a default in here for development usage

module.exports = {
	jwtSecret: process.env.JWT_SECRET || "Dummy signature!"
};
