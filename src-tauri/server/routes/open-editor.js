/* eslint-disable @typescript-eslint/no-require-imports */
const express = require("express");
const { exec } = require("child_process");
const { promisify } = require("util");

const router = express.Router();
const execAsync = promisify(exec);

/**
 * Executes a shell command in a given directory.
 * @param {string} command - The command to run.
 * @param {string} path - The directory path where the command should be executed.
 * @returns {Promise<string>} - Execution output or error message.
 */
async function executeCommand(command, path) {
    try {
        if (!path) {
            throw new Error("Path is required");
        }

        const fullCommand = `cd ${path} && ${command}`;
        console.log("Executing:", fullCommand);

        await execAsync(fullCommand);

        return { message: "Command executed successfully" };
    } catch (error) {
        console.error("Error executing command:", error.message);
        return { error: "Invalid or inaccessible path" };
    }
}

// **POST route to execute a command in a specified directory**
router.post("/execute-command", async (req, res) => {
    try {
        const { command = "code .", path } = req.body;

        console.log("Received path:", path, "Command:", command);

        if (!path) {
            return res.status(400).json({ error: "Path is required" });
        }

        const result = await executeCommand(command, path);

        if (result.error) {
            return res.status(400).json(result);
        }

        return res.json(result);
    } catch (error) {
        console.error("Unexpected error:", error.message);
        return res.status(500).json({ error: error.message });
    }
});

module.exports = router;
