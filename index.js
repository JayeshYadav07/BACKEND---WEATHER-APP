const express = require("express");
require("dotenv").config();
const PORT = process.env.PORT;
const { UserRouter } = require("./routes/UserRoutes.js");
const { connection } = require("./config/db");
const winston = require("winston");
const expressWinston = require("express-winston");
require("winston-mongodb");
const app = express();
app.use(express.json());

app.use(
    expressWinston.logger({
        statusLevels: true,
        transports: [
            // how we want it to be transported

            new winston.transports.File({
                filename: "error.json",
                level: "info",
                json: true,
            }),
        ],
    })
);
app.get("/", (req, res) => {
    res.send("hello world!");
});

app.use("/user", UserRouter);


app.listen(PORT, async () => {
    try {
        await connection;
        console.log("Connected to DB");
        console.log("listening on port " + PORT);
    } catch (error) {
        console.log({ msg: error.message });
    }
});
