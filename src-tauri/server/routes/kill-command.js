/* eslint-disable @typescript-eslint/no-require-imports */
const express = require("express");
const { exec } = require("child_process");
const { promisify } = require("util");

const router = express.Router();
const execAsync = promisify(exec);

/**
 * Gets a list of active terminal sessions and their commands.
 * @returns {Promise<Array>} - List of terminal sessions with PID, TTY, command, and CWD.
 */
async function getTerminalsAndCommands() {
    try {
        console.log("Fetching all active terminals...");

        // Get all running terminal processes
        const { stdout: terminalProcesses } = await execAsync(
            `ps aux | grep -E 'gnome-terminal|konsole|xterm|mate-terminal|xfce4-terminal' | grep -v grep`
        );

        if (!terminalProcesses.trim()) {
            console.log("No active terminals found.");
            return [];
        }

        // Get all processes attached to a pseudo-terminal (pts/)
        const { stdout: ptsProcesses } = await execAsync(
            `ps aux | grep pts/ | grep -v grep`
        );

        const terminalInfo = await Promise.all(
            ptsProcesses.split("\n").map(async (line) => {
                const parts = line.trim().split(/\s+/);
                if (parts.length > 10) {
                    const pid = parts[1];  
                    const tty = parts[6];  
                    const command = parts.slice(10).join(" ");

                    try {
                        // Get the working directory of the process
                        const { stdout: cwd } = await execAsync(`readlink /proc/${pid}/cwd`);
                        return { pid, tty, command, cwd: cwd.trim() };
                    } catch (error) {
                        console.log(error);
                        return { pid, tty, command, cwd: "Unknown (Permission Denied or Process Ended)" };
                    }
                }
                return null;
            })
        );

        return terminalInfo.filter(Boolean);
    } catch (error) {
        console.error("Error fetching terminal details:", error.message);
        return [];
    }
}

// **POST route to close a terminal based on its working directory**
router.post("/kill-command", async (req, res) => {
    try {
        const { path } = req.body;

        console.log("Received path:", path);

        if (!path) {
            return res.status(400).json({ error: "Path is required" });
        }

        try {
            const activeTerminals = await getTerminalsAndCommands();
            const terminalToKill = activeTerminals.find(terminal => terminal.cwd === path);

            if (!terminalToKill) {
                return res.status(404).json({ error: "No matching terminal found" });
            }

            // Kill the process
            await execAsync(`kill -9 ${terminalToKill.pid} || true`);

            return res.json({ message: `Terminated successfully (PID: ${terminalToKill.pid})` });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ error: `Failed to close terminal: ${err.message}` });
        }
    } catch (error) {
        console.error("Unexpected error:", error.message);
        return res.status(500).json({ error: error.message });
    }
});

module.exports = router;
