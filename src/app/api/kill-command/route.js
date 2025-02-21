import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(req) {
    try {
        const { path } = await req.json();

        console.log("Received path:", path);

        if (!path) {
            return NextResponse.json({ error: "Path is required" }, { status: 400 });
        }

        try {
            // Find all Node.js processes running from the given path
            const { stdout } = await execAsync(
                `ps aux | grep node | grep "${path}" | grep -v grep | awk '{print $2}'`
            );

            const pids = stdout.trim().split("\n").filter(pid => pid);

            if (pids.length === 0) {
                return NextResponse.json({ error: `No Node.js process found running from: ${path}` }, { status: 404 });
            }

            console.log("Found PIDs:", pids);

            // Kill all matching PIDs (ignore errors if already dead)
            await execAsync(`kill -9 ${pids.join(" ")} || true`);

            return NextResponse.json({ 
                message: `Processes from ${path} (PIDs: ${pids.join(", ")}) terminated successfully` 
            });
        } catch (err) {
            console.error("Kill error:", err.message);
            return NextResponse.json({ error: `Failed to terminate process: ${err.message}` }, { status: 500 });
        }
    } catch (error) {
        console.error("Unexpected error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
