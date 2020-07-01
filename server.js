require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const port = process.env.PORT || 4000;

const server = express();
server.use(helmet());
server.use(cors());
server.use(express.json());

server.get("/", (req, res) => res.send("express bd for ark planner"));

server.listen(port, () => console.log(`\n*** Listening on port ${port}***\n`));
