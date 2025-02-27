/* eslint-disable @typescript-eslint/no-require-imports */
const express = require("express");
const { spawn } = require("child_process");
const { access } = require("fs/promises");
import net from "net"

const router = express.Router();

const portHandler = {
    vite: "-- --port",
    next: "-- -p"
}

const findIsPortAvailable = async (port) => {

    return new Promise((resolve) => {
        const server = net.createServer();

        server.once('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                resolve(false); // Port is in use
            } else {
                resolve(false); // Some other error (e.g., permissions issue)
            }
        });

        server.once('listening', () => {
            server.close(() => resolve(true)); // Port is available
        });

        server.listen(port);
    });
};


/**
 * Spawns a terminal process and runs a command inside a given directory.
 * @param {string} command - The command to execute.
 * @param {string} path - The directory where the command should be executed.
 * @returns {Promise<object>} - Execution details.
 */
async function startTerminalProcess(command = "npm run dev", path, port, framework) {


    if (!path) {
        throw new Error("Path is required");
    }

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
    const execCommand = `gnome-terminal -- zsh -i -c "source ~/.zshrc; cd ${path} && ${command} ${port ? portHandler[framework] : ""} ${port} ; exec zsh"`;

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
        const { command = "npm run dev", path, port, framework } = req.body;

        console.log("port ", port, "framework", framework)

        if (!path) {
            return res.status(400).json({ error: "Path is required" });
        }

        try {
            await access(path);
        } catch (err) {
            console.log("err", err)
            return NextResponse.json({ error: "Invalid or inaccessible path" }, { status: 400 });
        }

        try {
            if (port) {
                const isPortAvailable = await findIsPortAvailable(port)

                if (!isPortAvailable) {
                    return res.status(404).json({ error: "Invalid or inaccessible port", isPortUnvailable: true });
                }

            }
        } catch (err) {
            console.log("err", err)
            return res.status(500).json({ error: "Error while checking port" });
        }

        const result = await startTerminalProcess(command, path, port, framework);
        return res.json(result);
    } catch (error) {
        console.log("Error:", error.message);
        return res.status(500).json({ error: error.message });
    }
});

module.exports = router;
