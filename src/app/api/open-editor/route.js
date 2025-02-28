import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import os from "os";

const execAsync = promisify(exec);

export async function POST(req) {
    try {
        const { command = "code .", path } = await req.json();

        if (!path) {
            return NextResponse.json({ error: "Path is required" }, { status: 400 });
        }

        const fullCommand = os.platform() === "win32"
            ? `cd /d "${path}" && ${command}`
            : `cd "${path}" && ${command}`;

        try {
            await execAsync(fullCommand, { shell: os.platform() === "win32" ? "cmd.exe" : "/bin/sh" });
        } catch (err) {
            console.log("Execution error:", err);
            return NextResponse.json({ error: "Invalid or inaccessible path or command failed" }, { status: 400 });
        }

        return NextResponse.json({
            message: "Command executed successfully",
        });
    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
