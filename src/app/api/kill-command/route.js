import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

async function getTerminalsAndCommands() {
    try {
        console.log("Fetching all active terminals...");

        const { stdout: terminalProcesses } = await execAsync(
            `ps aux | grep -E 'gnome-terminal|konsole|xterm|mate-terminal|xfce4-terminal' | grep -v grep`
        );

        if (!terminalProcesses.trim()) {
            console.log("No active terminals found.");
            return [];
        }

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
                        console.log(error)
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

export async function POST(req) {
    try {
        const { path } = await req.json();

        console.log("Received path:", path);

        if (!path) {
            return NextResponse.json({ error: "Path is required" }, { status: 400 });
        }

        try {
            const { stdout } = await execAsync(
                `ps aux | grep node | grep "${path}" | grep -v grep | awk '{print $2}'`
            );

            const pids = stdout.trim().split("\n").filter(pid => pid);

            if (pids.length === 0) {
                return NextResponse.json({ error: `No Node.js process found running from: ${path}` }, { status: 404 });
            }

            console.log("Found PIDs:", pids);   

            await execAsync(`kill -9 ${pids.join(" ")} || true`);


        } catch (err) {
            console.error("Kill error:", err.message);
            return NextResponse.json({ error: `Failed to terminate process: ${err.message}` }, { status: 500 });
        }


        try {
            const activeTerminals = await getTerminalsAndCommands()
            const terminalToKill = activeTerminals.find(terminal => terminal.cwd === path)
            await execAsync(`kill -9 ${terminalToKill.pid} || true`);
        } catch (err) {
            console.log(err)
            return NextResponse.json({ error: `Failed to close terminal: ${err.message}` }, { status: 500 });
        }

        return NextResponse.json({
            message: `Terminated successfully`
        });
    } catch (error) {
        console.error("Unexpected error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
