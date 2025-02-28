/* eslint-disable @typescript-eslint/no-require-imports */
const express = require("express");
const { exec } = require("child_process");
const { promisify } = require("util");
const os = require("os");

const router = express.Router();
const execAsync = promisify(exec);

async function getTerminalsAndCommands() {
    try {
        if (os.platform() === "win32") {
            const { stdout } = await execAsync(
                `powershell -Command "Get-WmiObject Win32_Process | Select-Object ProcessId,CommandLine,ExecutablePath | ConvertTo-Json"`
            );

            const processes = JSON.parse(stdout);
            const processList = Array.isArray(processes) ? processes : [processes];

            return processList
                .filter(proc => proc.ExecutablePath)
                .map(proc => ({
                    pid: proc.ProcessId,
                    command: proc.CommandLine || "Unknown",
                    path: proc.ExecutablePath,
                    cwd: "Unknown (Windows does not expose cwd easily)",
                }));
        } else {
            const { stdout } = await execAsync(`ps aux | grep pts/ | grep -v grep`);

            if (!stdout.trim()) {
                console.log("No active terminals found.");
                return [];
            }

            const terminalInfo = await Promise.all(
                stdout.split("\n").map(async (line) => {
                    const parts = line.trim().split(/\s+/);
                    if (parts.length > 10) {
                        const pid = parts[1];
                        const tty = parts[6];
                        const command = parts.slice(10).join(" ");

                        try {
                            const { stdout: cwd } = await execAsync(`readlink /proc/${pid}/cwd`);
                            return { pid, tty, command, cwd: cwd.trim(), path: cwd.trim() };
                        } catch (error) {
                            console.log(error);
                            return { pid, tty, command, cwd: "Unknown (Permission Denied or Process Ended)", path: "Unknown" };
                        }
                    }
                    return null;
                })
            );

            return terminalInfo.filter(Boolean);
        }
    } catch (error) {
        console.error("Error fetching terminal details:", error.message);
        return [];
    }
}

router.post("/kill-command", async (req, res) => {
    try {
        const { path } = req.body;

        if (!path) {
            return res.status(400).json({ error: "Path is required" });
        }

        try {
            const activeTerminals = await getTerminalsAndCommands();
            const terminalToKill = activeTerminals.find(terminal => terminal.cwd === path);

            if (!terminalToKill) {
                return res.status(404).json({ error: "No active terminal found for the given path" });
            }

            const killCommand = os.platform() === "win32"
                ? `taskkill /PID ${terminalToKill.pid} /F`
                : `kill -9 ${terminalToKill.pid} || true`;

            await execAsync(killCommand);
        } catch (err) {
            console.log(err);
            return res.status(500).json({ error: `Failed to close terminal: ${err.message}` });
        }

        return res.json({
            message: "Terminated successfully",
        });
    } catch (error) {
        console.error("Unexpected error:", error.message);
        return res.status(500).json({ error: error.message });
    }
});

module.exports = router;
