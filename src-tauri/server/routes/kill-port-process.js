/* eslint-disable @typescript-eslint/no-require-imports */
const { exec } = require("child_process");
const util = require("util")
const express = require("express");
const router = express.Router();
const execPromise = util.promisify(exec);

router.post("/kill-command", async (req, res) => {
    try {
        const { port } = await req.body;

        if (!port) {
          return res.json({ error: "Port not provided" }, { status: 400 });
        }

        if (port < 3000) {
          return res.status(400).json({ error: "This port process might be not safe to kill" });
        }
    
        const numericPort = Number(port);
        if (isNaN(numericPort) || numericPort <= 0) {
          return res.status(400).json({ error: "Port must be a valid positive number" });
        }
    
        const platform = process.platform;
        let command = "";
    
        if (platform === "win32") {
          command = `for /f "tokens=5" %a in ('netstat -ano | findstr :${numericPort}') do taskkill /F /PID %a`;
        } else if (platform === "linux") {
          command = `fuser -k ${numericPort}/tcp 2>/dev/null || true`;
        } else if (platform === "darwin") {
          command = `lsof -t -i :${numericPort} | xargs kill -9 2>/dev/null || true`;
        } else {
          return res.status(500).json({ error: "Unsupported platform" });
        }
    
        try {
          const { stdout } = await execPromise(command);
          return res.json(
            {
              killed: true,
              message: `Killed process(es) using port ${numericPort}`,
              output: stdout.trim(),
            }
          );
        } catch (execError) {
          return res.status(500).json({ error: `Failed to kill process: ${execError.message}` });
        }
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
})

