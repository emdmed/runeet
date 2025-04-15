/* eslint-disable @typescript-eslint/no-require-imports */
const express = require("express");
const router = express.Router();

router.get("/check-updates", async (req, res) => {
    try {
        const response = await fetch("https://api.github.com/repos/emdmed/runeet/releases/latest")

        const data = await response.json()

        return res.json(data);
    } catch (error) {
        console.error("Unexpected error:", error.message);
        return res.status(404).json({ error: error.message });
    }
})

module.exports = router