/* eslint-disable @typescript-eslint/no-require-imports */
const express = require("express");
const router = express.Router();
import { exec } from 'child_process';
import { promisify } from 'util';

function extractUsedPorts(portsStr, platform) {
    const ports = [];
    const lines = portsStr.split(/\r?\n/);

    if (platform === 'win32') {
        for (const line of lines) {
            if (!line.trim().startsWith('TCP')) continue;
            const tokens = line.trim().split(/\s+/);
            if (tokens.length < 2) continue;
            const localAddress = tokens[1];
            const parts = localAddress.split(':');
            const portStr = parts[parts.length - 1];
            const port = Number(portStr);
            if (!isNaN(port)) {
                ports.push(port);
            }
        }
    } else if (platform === 'linux') {

        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith('tcp') && !trimmed.startsWith('tcp6')) continue;
            const tokens = trimmed.split(/\s+/);
            if (tokens.length < 4) continue;
            const localAddress = tokens[3];
            const match = localAddress.match(/:(\d+)$/);
            if (match) {
                ports.push(Number(match[1]));
            }
        }
    } else if (platform === 'darwin') {
        for (const line of lines) {
            if (!line.includes('(LISTEN)')) continue;
            const match = line.match(/:(\d+)\s+\(LISTEN\)/);
            if (match) {
                ports.push(Number(match[1]));
            } else {
                const matchGeneral = line.match(/:(\d+)\b/);
                if (matchGeneral) {
                    ports.push(Number(matchGeneral[1]));
                }
            }
        }
    } else {
        throw new Error('Unsupported platform');
    }

    return ports;
}

const execAsync = promisify(exec);

router.get("/used-ports", async (req, res) => {
    try {
        const platform = process.platform;
        let command = '';

        if (platform === 'win32') {
            // Windows: List all TCP connections with process IDs.
            command = 'netstat -ano';
        } else if (platform === 'linux') {
            // Ubuntu/Linux: List TCP ports in use.
            command = 'netstat -tuln';
        } else if (platform === 'darwin') {
            // macOS: List listening TCP ports.
            command = 'lsof -nP -iTCP -sTCP:LISTEN';
        } else {
            return res.status(400).json({ error: 'Unsupported platform' });
        }

        const { stdout, stderr } = await execAsync(command);
        if (stderr) {
            return res.status(500).json({ error: stderr });
        }

        const formattedStdout = extractUsedPorts(stdout, platform)

        return res.json({ ports: formattedStdout });

    } catch (error) {
        console.error("Unexpected error:", error.message);
        return res.status(404).json({ error: error.message });
    }
})

module.exports = router