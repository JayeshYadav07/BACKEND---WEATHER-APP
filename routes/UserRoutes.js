const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createClient } = require("redis");
const { UserModel } = require("../model/UserModel");
require("dotenv").config();
const UserRouter = express.Router();

UserRouter.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hash = bcrypt.hashSync(password, 4);
        const user = new UserModel({ name, email, password: hash });
        await user.save();
        res.send(user);
    } catch (error) {
        res.status(404).send({ msg: error.message });
    }
});
UserRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email: email });
        if (!user) {
            res.status(404).send({ msg: "User not found" });
        } else {
            if (bcrypt.compareSync(password, user.password)) {
                const normal_token = jwt.sign(
                    { userId: user._id },
                    process.env.NORMAL_TOKEN,
                    {
                        expiresIn: 100,
                    }
                );
                const refresh_token = jwt.sign(
                    { userId: user._id },
                    process.env.REFRESH_TOKEN,
                    {
                        expiresIn: 500,
                    }
                );
                res.send({
                    msg: "Login Successfully",
                    normal_token,
                    refresh_token,
                });
            } else {
                res.status(404).send({
                    msg: "Username and Password is wrong!",
                });
            }
        }
    } catch (error) {
        res.status(404).send({ msg: error.message });
    }
});
UserRouter.get("/logout", async (req, res) => {
    const token = req.headers.authorization;
    try {
        const client = createClient();
        client.on("error", (err) => console.log("Redis Client Error", err));
        await client.connect();
        await client.LPUSH("blacklist", token);
        await client.disconnect();
        res.send("User logout successfully");
    } catch (error) {
        res.status(404).send({ msg: error.message });
    }
});

module.exports = { UserRouter };
