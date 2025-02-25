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
                        return null;
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

// **GET route to fetch all active terminals**
router.get("/list-terminals", async (req, res) => {
    try {
        const activeTerminals = await getTerminalsAndCommands();
        
        return res.json({
            terminals: activeTerminals.filter(terminal => !terminal.cwd.includes("Unknown"))
        });
    } catch (error) {
        console.error("Unexpected error:", error.message);
        return res.status(500).json({ error: error.message });
    }
});

module.exports = router;
