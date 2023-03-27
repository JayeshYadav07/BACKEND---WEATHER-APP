require("dotenv").config();
const { UserModel } = require("../model/UserModel");
const redis = require("redis");

const client = redis.createClient();
const jwt = require("jsonwebtoken");

const authenticate = async (req, res, next) => {
    const token = req.headers.authorization;
    try {
        await client.connect();
        const bArr = await client.lRange("blacklist", 0, -1, (err, res) => res);
        let isBlocked = bArr.includes(token);
        client.disconnect();

        if (isBlocked) {
            return res.status(403).json({ message: "Login first" });
        }

        // check is token is expired or not
        const decoded = jwt.verify(token, process.env.NORMAL_TOKEN);
        const { userId } = decoded;

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError")
            return res.status(400).json({ message: "Access token expired" });
        else return res.status(400).json({ message: "Something went wrong" });
    }
};

module.exports = { authenticate };
