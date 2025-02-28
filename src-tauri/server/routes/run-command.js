/* eslint-disable @typescript-eslint/no-require-imports */
const express = require("express");
const { spawn } = require("child_process");
const { access } = require("fs/promises");
const { exec } = require("child_process");
const { promisify } = require("util");
const net = require("net");
const os = require("os");

const router = express.Router();
const execAsync = promisify(exec);

const findIsPortAvailable = async (port) => {
    return new Promise((resolve) => {
        const server = net.createServer();

        server.once("error", (err) => {
            if (err.code === "EADDRINUSE") {
                resolve(false);
            } else {
                resolve(false);
            }
        });

        server.once("listening", () => {
            server.close(() => resolve(true));
        });

        server.listen(port);
    });
};

router.post("/run-command", async (req, res) => {
    try {
        const { command = "npm run dev", path, port } = req.body;

        if (!path) {
            return res.status(400).json({ error: "Path is required" });
        }

        try {
            await access(path);
        } catch (err) {
            console.log("Path error", err);
            return res.status(400).json({ error: "Invalid or inaccessible path" });
        }

        if (port) {
            try {
                const isPortAvailable = await findIsPortAvailable(port);
                if (!isPortAvailable) {
                    return res.status(404).json({ error: "Port is in use", isPortUnavailable: true });
                }
            } catch (err) {
                console.log("Port check error", err);
                return res.status(500).json({ error: "Error while checking port" });
            }
        }

        let execCommand;

        if (os.platform() === "win32") {
            execCommand = `powershell -Command "Start-Process -NoNewWindow -FilePath 'cmd.exe' -ArgumentList '/k cd /d ${path} && ${command}'"`;
        } else {
            const possibleTerminals = ["gnome-terminal", "konsole", "xfce4-terminal", "xterm"];
            let terminal = "x-terminal-emulator";

            for (const term of possibleTerminals) {
                try {
                    await execAsync(`which ${term}`);
                    terminal = term;
                    break;
                } catch (err) {
                    console.log(`Terminal ${term} not found, checking next...`, err);
                }
            }

            execCommand = `${terminal} -- zsh -i -c "source ~/.zshrc; cd ${path} && ${command}; exec zsh"`;
        }

        console.log("Executing:", execCommand);

        const childProcess = spawn(execCommand, {
            shell: true,
            stdio: "inherit",
            env: { ...process.env, DISPLAY: ":0" },
        });

        return res.json({
            message: "Command executed successfully",
            executedCommand: command,
            executedPath: path,
            processId: childProcess.pid,
        });
    } catch (error) {
        console.error("Unexpected error:", error.message);
        return res.status(500).json({ error: error.message });
    }
});

module.exports = router;
