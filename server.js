require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const auth = require("./src/routes/auth/auth-route");
const player = require("./src/routes/player/player-route");

const port = process.env.PORT || 4000;

const server = express();
server.use(helmet());
server.use(cors());
server.use(express.json());

server.use("/user", auth);
server.use("/player", player);

server.get("/", (req, res) => res.send("express bd for ark planner"));

server.listen(port, () => console.log(`\n*** Listening on port ${port}***\n`));
