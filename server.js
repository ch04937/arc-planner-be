require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const auth = require("./src/routes/router/auth");
const profile = require("./src/routes/router/profile");
const alliance = require("./src/routes/router/alliance");
const events = require("./src/routes/router/events");

const port = process.env.PORT || 4000;

const server = express();

server.use(express.static("./public"));

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use("/user", auth);
server.use("/profile", profile);
server.use("/alliance", alliance);
server.use("/events", events);
server.use("/public", express.static("./public"));

server.get("/", (req, res) => res.send("index"));

server.listen(port, () => console.log(`\n*** Listening on port ${port}***\n`));
