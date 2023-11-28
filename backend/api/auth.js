const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { createUser, getUserByUsername } = require("../db/models/users");

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const { username, firstName, lastName, password } = req.body;

        // Check if the username is already registered
        const existingUser = await getUserByUsername(username);
        if (existingUser) {
            return res.status(400).json({ message: "Username is already registered" });
        }

        const newUser = await createUser({ username, password, firstName, lastName });

        const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET);

        res.status(201).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await getUserByUsername(username);

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
