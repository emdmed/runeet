import { NextResponse } from "next/server";
import { spawn } from "child_process";
import { access } from "fs/promises";
import { exec } from "child_process";
import { promisify } from "util";
import net from "net";
import os from "os";

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

export async function POST(req) {
    try {
        const { command = "npm run dev", path, port } = await req.json();

        if (!path) {
            return NextResponse.json({ error: "Path is required" }, { status: 400 });
        }

        try {
            await access(path);
        } catch (err) {
            console.log("Path error", err);
            return NextResponse.json({ error: "Invalid or inaccessible path" }, { status: 400 });
        }

        if (port) {
            try {
                const isPortAvailable = await findIsPortAvailable(port);

                if (!isPortAvailable) {
                    return NextResponse.json({ error: "Port is in use", isPortUnavailable: true }, { status: 404 });
                }
            } catch (err) {
                console.log("Port check error", err);
                return NextResponse.json({ error: "Error while checking port" }, { status: 500 });
            }
        }

        let execCommand;

        if (os.platform() === "win32") {
            execCommand = `powershell -Command "Start-Process -NoNewWindow -FilePath 'cmd.exe' -ArgumentList '/k cd /d ${path} && ${command}'"`;
        } else {
            const possibleTerminals = ["gnome-terminal", "konsole", "xfce4-terminal", "xterm"];
            let terminal = "x-terminal-emulator"; // Default fallback

            for (const term of possibleTerminals) {
                try {
                    await execAsync(`which ${term}`);
                    terminal = term;
                    break;
                } catch (err) {
                    console.log(`Terminal ${term} not found, checking next...`, err);
                }
            }

            execCommand = `${terminal} -- bash -i -c "cd ${path} && ${command}; exec bash"`;

        }

        console.log("Executing:", execCommand);

        const childProcess = spawn(execCommand, {
            shell: true,
            stdio: "inherit",
            env: { ...process.env, DISPLAY: ":0" },
        });

        return NextResponse.json({
            message: "Command executed successfully",
            executedCommand: command,
            executedPath: path,
            processId: childProcess.pid,
        });
    } catch (error) {
        console.error("Unexpected error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
