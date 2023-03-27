const express = require("express");
require("dotenv").config();
const PORT = process.env.PORT;
const app = express();

app.get("/", (req, res) => {
    res.send("hello world!");
});

app.listen(PORT, () => {
    console.log("listening on port " + PORT);
});
