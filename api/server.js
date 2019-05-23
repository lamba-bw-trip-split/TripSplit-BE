// imports
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

// route imports
const registerRouter = require("./routes/auth/register");
const loginRouter = require("./routes/auth/login");
const tripsRouter = require("./routes/trips/trips");
const expensesRouter = require("./routes/expenses/expenses");

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
server.use("/api/trips/", tripsRouter);
// expenses
// server.use("/api/expenses", expensesRouter);
server.use("/api/trips/:tripid/expenses/", expensesRouter);

module.exports = server;
