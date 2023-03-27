const express = require("express");
require("dotenv").config();
const PORT = process.env.PORT;
const { UserRouter } = require("./routes/UserRoutes.js");
const { connection } = require("./config/db");
const app = express();
app.use(express.json());
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
