import express from "express";
import Users from "./model/user.js";

const Router = express.Router();

Router.post("/register", async(req, res) => {
    try {
        const { name, email } = req.body;
        const existingUser = await Users.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const newUsers = await Users.create({ name, email });
        res.status(201).json(newUsers)
    }catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
})

const User = Router
export default User