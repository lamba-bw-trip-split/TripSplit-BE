// imports
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const server = express();

// utils
server.use(express.json());
server.use(helmet());
server.use(cors());

server.get("/", (req, res) => {
	res.send("<p>Good</p>");
});

module.exports = server;
