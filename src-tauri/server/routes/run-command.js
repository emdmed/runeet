/* eslint-disable @typescript-eslint/no-require-imports */
const express = require("express");
const { spawn } = require("child_process");
const { access } = require("fs/promises");

const router = express.Router();

/**
 * Spawns a terminal process and runs a command inside a given directory.
 * @param {string} command - The command to execute.
 * @param {string} path - The directory where the command should be executed.
 * @returns {Promise<object>} - Execution details.
 */
async function startTerminalProcess(command = "npm run dev", path) {

  
    if (!path) {
        throw new Error("Path is required");
    }

    console.log("startTerminalProcess", command, path)

    // Check if the path exists
    try {
        await access(path);
    } catch (err) {
        console.log("Invalid or inaccessible path:", err);
        throw new Error("Invalid or inaccessible path");
    }

    
    // Ensure DISPLAY is set for GUI terminal access on Linux
    const envVariables = { ...process.env, DISPLAY: ":0" };

    // Construct the execution command for GNOME Terminal
    const execCommand = `gnome-terminal -- zsh -i -c "source ~/.zshrc; cd ${path} && ${command}; exec zsh"`;

    console.log("Executing command:", execCommand);

    // Spawn the process in the background
    const childProcess = spawn(execCommand, {
        shell: true,
        stdio: "inherit",
        env: envVariables
    });

    return {
        message: "Command executed successfully",
        executedCommand: command,
        executedPath: path,
        processId: childProcess.pid
    };
}

// **POST route to open a new terminal and run a command**
router.post("/run-command", async (req, res) => {
    try {
        const { command = "npm run dev", path } = req.body;

        console.log("Received request:", { command, path });

        if (!path) {
            return res.status(400).json({ error: "Path is required" });
        }

        const result = await startTerminalProcess(command, path);
        return res.json(result);
    } catch (error) {
        console.log("Error:", error.message);
        return res.status(500).json({ error: error.message });
    }
});

module.exports = router;
