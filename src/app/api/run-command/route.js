import { NextResponse } from "next/server";
import { spawn } from "child_process";
import { access } from "fs/promises";
import net from "net"

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

export async function POST(req) {
    try {
        const { command = "npm run dev", path, port } = await req.json();

        if (!path) {
            return NextResponse.json({ error: "Path is required" }, { status: 400 });
        }

        // Check if the path exists
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
                    return NextResponse.json({ error: "Invalid or inaccessible port", isPortUnvailable: true }, { status: 404 });
                }

            }
        } catch (err) {
            console.log("err", err)
            return NextResponse.json({ error: "Error while checking port" }, { status: 500 });
        }
        
        // Ensure DISPLAY is set for GUI access
        const envVariables = { ...process.env, DISPLAY: ":0" };

        // Construct the execution command
        const execCommand = `gnome-terminal -- zsh -i -c "source ~/.zshrc; cd ${path} && ${command}; exec zsh"`;

        console.log("execCommand", execCommand)
        // Spawn the process with the correct DISPLAY environment variable
        const childProcess = spawn(execCommand, {
            shell: true,
            stdio: "inherit",
            env: envVariables // 👈 ADDING DISPLAY VARIABLE HERE
        });

        return NextResponse.json({
            message: "Command executed successfully",
            executedCommand: command,
            executedPath: path,
            processId: childProcess.pid
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
