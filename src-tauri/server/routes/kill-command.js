import express from "express";
import { exec } from "child_process";
import { promisify } from "util";

const router = express.Router();
const execAsync = promisify(exec);

async function getTerminalsAndCommands() {
    try {
        console.log("Fetching all active terminals...");

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

// Express route
router.post("/kill", async (req, res) => {
    try {
        const { path } = req.body; // Correct way to read JSON body

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

            await execAsync(`kill -9 ${terminalToKill.pid} || true`);

            return res.json({
                message: `Terminated terminal with PID ${terminalToKill.pid} successfully`
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ error: `Failed to close terminal: ${err.message}` });
        }
    } catch (error) {
        console.error("Unexpected error:", error.message);
        return res.status(500).json({ error: error.message });
    }
});

export default router;
