/* eslint-disable @typescript-eslint/no-require-imports */
const express = require("express");
const { exec } = require("child_process");
const { promisify } = require("util");
const os = require("os");

const router = express.Router();
const execAsync = promisify(exec);

router.post("/open-editor", async (req, res) => {
    try {
        const { command = "code .", path } = req.body;

        if (!path) {
            return res.status(400).json({ error: "Path is required" });
        }

        const fullCommand = os.platform() === "win32"
            ? `cd /d "${path}" && ${command}`
            : `cd "${path}" && ${command}`;



        console.log('fullCommand', fullCommand)
        try {
            await execAsync(fullCommand, { shell: os.platform() === "win32" ? "cmd.exe" : "/bin/sh" });
        } catch (err) {
            console.error("Execution error:", err);
            return res.status(400).json({ error: "Invalid or inaccessible path or command failed" });
        }

        return res.json({
            message: "Command executed successfully",
        });
    } catch (error) {
        console.error("Server error:", error.message);
        return res.status(500).json({ error: error.message });
    }
});

module.exports = router;
