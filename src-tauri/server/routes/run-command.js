import { spawn } from "child_process";
import { access } from "fs/promises";

export async function runCommand(req, res) {
    try {
        const { command = "npm run dev", path } = await req.body;

        if (!path) {
            return res.status(400).json({ error: "Path is required" });
        }

        // Check if the path exists
        try {
            await access(path);
        } catch (err) {
            console.log("err", err)
            return res.status(400).json({ error: "Invalid or inaccessible path" });
        }

        // Ensure DISPLAY is set for GUI access
        const envVariables = { ...process.env, DISPLAY: ":0" };

        // Construct the execution command
        const execCommand = `gnome-terminal -- zsh -i -c "source ~/.zshrc; cd ${path} && ${command}; exec zsh"`;



        console.log("Executing command:", execCommand);

        // Spawn the process with the correct DISPLAY environment variable
        const childProcess = spawn(execCommand, {
            shell: true,
            stdio: "inherit",
            env: envVariables // 👈 ADDING DISPLAY VARIABLE HERE
        });

        console.log("Started process with PID:", childProcess.pid);

        return res.json({
            message: "Command executed successfully",
            executedCommand: command,
            executedPath: path,
            processId: childProcess.pid
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
