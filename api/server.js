// imports
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

// route imports
const registerRouter = require("./routes/auth/register");
const loginRouter = require("./routes/auth/login");
const tripsRouter = require("./routes/trips/trips");

// server invokation
const server = express();

// middleware utils
server.use(express.json());
server.use(helmet());
server.use(cors());

server.get("/", (req, res) => {
	res.send("<p>Good</p>");
});

// authentication
server.use("/auth/register/", registerRouter);
server.use("/auth/login/", loginRouter);

// trips
server.use("/api/trips", tripsRouter);

module.exports = server;
