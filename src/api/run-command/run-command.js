import { NextResponse } from "next/server";
import { spawn } from "child_process";
import { access } from "fs/promises";

export async function POST(req) {
    try {
        const { command = "npm run dev", path } = await req.json();

        if (!path) {
            return NextResponse.json({ error: "Path is required" }, { status: 400 });
        }

        // Check if the path exists
        try {
            await access(path);
        } catch (err) {
            return NextResponse.json({ error: "Invalid or inaccessible path", err }, { status: 400 });
        }

        // Use tmux for headless environments; gnome-terminal for GUI
        const isGui = process.env.DISPLAY;
        const execCommand = isGui
            ? `gnome-terminal --working-directory="${path}" -- bash -c '${command}; exec bash'`
            : `tmux new-session -d -c "${path}" '${command}'`;

        // Execute the command
        spawn(execCommand, { shell: true, detached: true });

        return NextResponse.json({
            message: "Command executed successfully",
            executedCommand: command,
            executedPath: path,
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
